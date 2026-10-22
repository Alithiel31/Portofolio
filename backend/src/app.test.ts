import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

const {
  pageViewCreate,
  pageViewCount,
  pageViewGroupBy,
  pageViewFindMany,
  queryRaw,
  sendMock,
  geoLookup,
} = vi.hoisted(() => ({
  pageViewCreate: vi.fn(),
  pageViewCount: vi.fn(),
  pageViewGroupBy: vi.fn(),
  pageViewFindMany: vi.fn(),
  queryRaw: vi.fn(),
  sendMock: vi.fn(),
  geoLookup: vi.fn(),
}));

vi.mock('./prisma.js', () => ({
  default: {
    $queryRaw: queryRaw,
    pageView: {
      create: pageViewCreate,
      count: pageViewCount,
      groupBy: pageViewGroupBy,
      findMany: pageViewFindMany,
    },
  },
}));

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(function Resend() {
    return { emails: { send: sendMock } };
  }),
}));

vi.mock('geoip-lite', () => ({
  default: { lookup: geoLookup },
}));

process.env.STATS_TOKEN = 'test-stats-token-1234567890';
process.env.RESEND_API_KEY = 're_test_key';
process.env.CONTACT_EMAIL = 'contact@example.com';

const { app } = await import('./app.js');

/** Délai de remplissage réaliste, au-delà du seuil anti-robot (MIN_FILL_MS). */
const HUMAN = 8000;

describe('GET /api/health', () => {
  beforeEach(() => {
    queryRaw.mockReset();
    queryRaw.mockResolvedValue([{ '?column?': 1 }]);
  });

  it('returns 200 with an ok status when the database answers', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.timestamp).toBe('string');
    expect(queryRaw).toHaveBeenCalledTimes(1);
  });

  it('returns 503 when the database is unreachable', async () => {
    queryRaw.mockRejectedValueOnce(new Error("Can't reach database server"));
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(503);
    expect(res.body.status).toBe('error');
    // Le message d'erreur Prisma (hôte, port) ne doit pas fuiter vers l'appelant.
    expect(JSON.stringify(res.body)).not.toContain('database server');
    errorSpy.mockRestore();
  });

  it('does not leak NODE_ENV to an unauthenticated caller', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.env).toBeUndefined();
  });
});

describe('POST /api/contact', () => {
  beforeEach(() => {
    sendMock.mockReset();
    sendMock.mockResolvedValue({ id: 'email-id' });
  });

  it('rejects missing fields', async () => {
    const res = await request(app)
      .post('/api/contact')
      .set('X-Forwarded-For', '10.0.1.1')
      .send({ name: 'Alice' });
    expect(res.status).toBe(400);
  });

  it('rejects fields that are too long', async () => {
    const res = await request(app)
      .post('/api/contact')
      .set('X-Forwarded-For', '10.0.1.2')
      .send({ name: 'A'.repeat(101), email: 'a@b.com', message: 'hi' });
    expect(res.status).toBe(400);
  });

  it('rejects a malformed email address', async () => {
    const res = await request(app)
      .post('/api/contact')
      .set('X-Forwarded-For', '10.0.1.6')
      .send({ name: 'Alice', email: 'not-an-email', message: 'Hello there', elapsedMs: HUMAN });
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('rejects a name containing a newline (header injection attempt)', async () => {
    const res = await request(app)
      .post('/api/contact')
      .set('X-Forwarded-For', '10.0.1.7')
      .send({ name: 'Alice\nBcc: evil@example.com', email: 'alice@example.com', message: 'hi' });
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('rejects an email containing a control character', async () => {
    const res = await request(app)
      .post('/api/contact')
      .set('X-Forwarded-For', '10.0.1.8')
      .send({ name: 'Alice', email: 'alice@example.com\r\n', message: 'hi' });
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('accepts a valid message and calls the email provider', async () => {
    const res = await request(app)
      .post('/api/contact')
      .set('X-Forwarded-For', '10.0.1.3')
      .send({
        name: 'Alice',
        email: 'alice@example.com',
        message: 'Hello there',
        elapsedMs: HUMAN,
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  it('sets replyTo to the visitor and keeps the subject as plain text', async () => {
    const res = await request(app)
      .post('/api/contact')
      .set('X-Forwarded-For', '10.0.1.9')
      .send({
        name: "O'Brien",
        email: 'jane@example.com',
        message: 'Hello <b>there</b>',
        elapsedMs: HUMAN,
      });
    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        replyTo: 'jane@example.com',
        subject: "Nouveau message de O'Brien",
      }),
    );
    // Le corps HTML, lui, reste échappé.
    expect(sendMock.mock.calls[0][0].html).toContain('Hello &lt;b&gt;there&lt;/b&gt;');
  });

  it('silently drops a submission whose honeypot field is filled', async () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    const res = await request(app).post('/api/contact').set('X-Forwarded-For', '10.0.1.10').send({
      name: 'Bot',
      email: 'bot@example.com',
      message: 'Buy now',
      website: 'https://spam.example',
      elapsedMs: HUMAN,
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(sendMock).not.toHaveBeenCalled();
    infoSpy.mockRestore();
  });

  it('silently drops a submission filled faster than a human could', async () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    for (const elapsedMs of [500, undefined, 'fast']) {
      const res = await request(app)
        .post('/api/contact')
        .set('X-Forwarded-For', '10.0.1.11')
        .send({ name: 'Bot', email: 'bot@example.com', message: 'Buy now', elapsedMs });
      expect(res.status).toBe(200);
    }
    expect(sendMock).not.toHaveBeenCalled();
    infoSpy.mockRestore();
  });

  it('returns 500 when the email provider fails', async () => {
    sendMock.mockRejectedValueOnce(new Error('boom'));
    const res = await request(app)
      .post('/api/contact')
      .set('X-Forwarded-For', '10.0.1.4')
      .send({
        name: 'Alice',
        email: 'alice@example.com',
        message: 'Hello there',
        elapsedMs: HUMAN,
      });
    expect(res.status).toBe(500);
  });

  it('rate-limits after 5 requests from the same IP within the window', async () => {
    const ip = '10.0.1.5';
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/contact')
        .set('X-Forwarded-For', ip)
        .send({
          name: 'Alice',
          email: 'alice@example.com',
          message: 'Hello there',
          elapsedMs: HUMAN,
        });
    }
    const res = await request(app)
      .post('/api/contact')
      .set('X-Forwarded-For', ip)
      .send({
        name: 'Alice',
        email: 'alice@example.com',
        message: 'Hello there',
        elapsedMs: HUMAN,
      });
    expect(res.status).toBe(429);
  });
});

describe('GET /api/stats', () => {
  beforeEach(() => {
    pageViewCount.mockResolvedValue(42);
    pageViewGroupBy.mockResolvedValue([]);
    pageViewFindMany.mockResolvedValue([]);
  });

  it('rejects a request without a token', async () => {
    const res = await request(app).get('/api/stats');
    expect(res.status).toBe(401);
  });

  it('rejects an invalid token', async () => {
    const res = await request(app).get('/api/stats').set('x-stats-token', 'wrong-token');
    expect(res.status).toBe(401);
  });

  it('returns stats with a valid token', async () => {
    const res = await request(app)
      .get('/api/stats')
      .set('x-stats-token', process.env.STATS_TOKEN as string);
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(42);
  });
});

describe('POST /api/track', () => {
  beforeEach(() => {
    geoLookup.mockReturnValue({ country: 'FR' });
    pageViewCreate.mockResolvedValue({});
  });

  it('stores a page view and reduces the referer to its origin', async () => {
    const res = await request(app)
      .post('/api/track')
      .set('X-Forwarded-For', '10.0.2.1')
      .send({ page: '/projects', referer: 'https://example.com/some/path?x=1' });

    expect(res.status).toBe(200);
    expect(pageViewCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        page: '/projects',
        country: 'FR',
        zone: 'Europe',
        referer: 'https://example.com',
      }),
    });
  });

  it('rate-limits after 20 requests from the same IP within the window', async () => {
    const ip = '10.0.2.2';
    for (let i = 0; i < 20; i++) {
      await request(app).post('/api/track').set('X-Forwarded-For', ip).send({ page: '/' });
    }
    const res = await request(app)
      .post('/api/track')
      .set('X-Forwarded-For', ip)
      .send({ page: '/' });
    expect(res.status).toBe(429);
  });
});
