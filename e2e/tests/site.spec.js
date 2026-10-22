import { test, expect } from "@playwright/test";

// Contenu attendu : celui de backend/prisma/seed.ts.
const NAME = "Jacques Duchamplecheval";

test.beforeEach(async ({ page }) => {
  // Pas de mesure d'audience pendant les tests : les PageView de CI n'ont aucun intérêt.
  await page.addInitScript(() =>
    localStorage.setItem("analytics-opt-out", "1"),
  );
});

test("home page loads all its content from a single API call", async ({
  page,
}) => {
  const apiCalls = [];
  page.on("request", (req) => {
    if (new URL(req.url()).pathname.startsWith("/api/"))
      apiCalls.push(new URL(req.url()).pathname);
  });

  await page.goto("/?lang=en");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(NAME);
  await expect(page.locator("#projects article").first()).toBeVisible();
  expect(apiCalls).toEqual(["/api/portfolio"]);
});

test("legal page is reachable by direct URL", async ({ page }) => {
  await page.goto("/confidentialite?lang=fr");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    /confidentialité/i,
  );
  await expect(page).toHaveTitle(/confidentialité/i);
});

test("language switch updates the content, <html lang> and the URL", async ({
  page,
}) => {
  await page.goto("/?lang=fr");
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");

  await page.getByRole("button", { name: "Switch to English" }).click();

  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveURL(/\?lang=en$/);
  await expect(
    page.getByRole("button", { name: /send a message/i }),
  ).toBeVisible();
});

test("contact form announces success", async ({ page }) => {
  // Pas de vraie clé Resend en CI : la réponse du backend est simulée, le reste (rendu,
  // envoi, région live) est réel.
  let payload;
  await page.route("**/api/contact", async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({ status: 200, json: { success: true } });
  });

  await page.goto("/?lang=en");
  await page.getByLabel("Name").fill("Alice");
  await page.getByLabel("Email").fill("alice@example.com");
  await page.getByLabel("Message").fill("Hello from Playwright");
  await page.getByRole("button", { name: /send a message/i }).click();

  await expect(
    page.getByRole("status").filter({ hasText: "Message sent" }),
  ).toBeVisible();
  expect(payload).toMatchObject({ name: "Alice", website: "" });
});

test("project screenshots are served by nginx with a long cache", async ({
  request,
}) => {
  const res = await request.get("/screenshots/weatherqc.webp");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toBe("image/webp");
  expect(res.headers()["cache-control"]).toContain("max-age=2592000");
});
