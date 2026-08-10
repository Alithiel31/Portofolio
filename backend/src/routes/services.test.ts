import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const { findMany } = vi.hoisted(() => ({ findMany: vi.fn() }));

vi.mock('../prisma.js', () => ({
  default: { service: { findMany } },
}));

const { default: servicesRouter } = await import('./services.js');

const app = express();
app.use('/api/services', servicesRouter);

const SERVICE = {
  id: 1,
  titleEn: 'Web development',
  titleFr: 'Développement web',
  descriptionEn: 'Building websites',
  descriptionFr: 'Construction de sites web',
  icon: 'bx-code-alt',
  order: 0,
};

describe('GET /api/services', () => {
  beforeEach(() => {
    findMany.mockReset();
    findMany.mockResolvedValue([SERVICE]);
  });

  it('returns services ordered, localized to English by default', async () => {
    const res = await request(app).get('/api/services');
    expect(res.status).toBe(200);
    expect(findMany).toHaveBeenCalledWith({ orderBy: { order: 'asc' }, take: 100 });
    expect(res.body[0].title).toBe('Web development');
  });

  it('localizes to French when locale=fr', async () => {
    const res = await request(app).get('/api/services?locale=fr');
    expect(res.body[0].title).toBe('Développement web');
  });
});
