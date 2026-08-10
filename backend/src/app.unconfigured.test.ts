import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

vi.mock('./prisma.js', () => ({
  default: {
    pageView: { create: vi.fn(), count: vi.fn(), groupBy: vi.fn(), findMany: vi.fn() },
  },
}));

vi.mock('geoip-lite', () => ({
  default: { lookup: vi.fn(() => null) },
}));

delete process.env.STATS_TOKEN;
delete process.env.RESEND_API_KEY;
delete process.env.CONTACT_EMAIL;

const { app } = await import('./app.js');

describe('when STATS_TOKEN and RESEND_API_KEY are not configured', () => {
  it('GET /api/stats does not exist (404) rather than being wide open', async () => {
    const res = await request(app).get('/api/stats');
    expect(res.status).toBe(404);
  });

  it('POST /api/contact degrades to 503 instead of crashing', async () => {
    const res = await request(app)
      .post('/api/contact')
      .set('X-Forwarded-For', '10.0.3.1')
      .send({ name: 'Alice', email: 'alice@example.com', message: 'Hello there' });
    expect(res.status).toBe(503);
  });
});
