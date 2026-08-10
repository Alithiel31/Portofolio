import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

const { pageViewCreate, pageViewCount, pageViewGroupBy, pageViewFindMany, sendMock, geoLookup } =
  vi.hoisted(() => ({
    pageViewCreate: vi.fn(),
    pageViewCount: vi.fn(),
    pageViewGroupBy: vi.fn(),
    pageViewFindMany: vi.fn(),
    sendMock: vi.fn(),
    geoLookup: vi.fn(),
  }));

vi.mock('./prisma.js', () => ({
  default: {
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

describe('GET /api/health', () => {
  it('returns 200 with an ok status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.timestamp).toBe('string');
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
      .send({ name: 'Alice', email: 'not-an-email', message: 'Hello there' });
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
      .send({ name: 'Alice', email: 'alice@example.com', message: 'Hello there' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  it('returns 500 when the email provider fails', async () => {
    sendMock.mockRejectedValueOnce(new Error('boom'));
    const res = await request(app)
      .post('/api/contact')
      .set('X-Forwarded-For', '10.0.1.4')
      .send({ name: 'Alice', email: 'alice@example.com', message: 'Hello there' });
    expect(res.status).toBe(500);
  });

  it('rate-limits after 5 requests from the same IP within the window', async () => {
    const ip = '10.0.1.5';
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/contact')
        .set('X-Forwarded-For', ip)
        .send({ name: 'Alice', email: 'alice@example.com', message: 'Hello there' });
    }
    const res = await request(app)
      .post('/api/contact')
      .set('X-Forwarded-For', ip)
      .send({ name: 'Alice', email: 'alice@example.com', message: 'Hello there' });
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
