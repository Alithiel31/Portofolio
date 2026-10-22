import { defineConfig, devices } from "@playwright/test";

// Tests de bout en bout contre la stack de production (nginx + backend + PostgreSQL), lancée
// par `docker compose --profile dev up` puis seedée. Voir README, section Qualité.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [["list"], ["github"]] : "list",
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:8080",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
