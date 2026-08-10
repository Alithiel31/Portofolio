import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const { findMany } = vi.hoisted(() => ({ findMany: vi.fn() }));

vi.mock('../prisma.js', () => ({
  default: { experience: { findMany } },
}));

const { default: experiencesRouter } = await import('./experiences.js');

const app = express();
app.use('/api/experiences', experiencesRouter);

const WORK_EXP = {
  id: 1,
  year: '2024',
  titleEn: 'Engineer',
  titleFr: 'Ingénieur',
  company: 'Acme',
  descriptionEn: 'Did engineering things',
  descriptionFr: "A fait de l'ingénierie",
  type: 'WORK',
  order: 0,
};

describe('GET /api/experiences', () => {
  beforeEach(() => {
    findMany.mockReset();
    findMany.mockResolvedValue([WORK_EXP]);
  });

  it('returns experiences with no filter, localized to English by default', async () => {
    const res = await request(app).get('/api/experiences');
    expect(res.status).toBe(200);
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: undefined, orderBy: { order: 'asc' } }),
    );
    expect(res.body[0].title).toBe('Engineer');
    expect(res.body[0].description).toBe('Did engineering things');
  });

  it('localizes to French when locale=fr', async () => {
    const res = await request(app).get('/api/experiences?locale=fr');
    expect(res.body[0].title).toBe('Ingénieur');
  });

  it('filters by type=WORK', async () => {
    const res = await request(app).get('/api/experiences?type=WORK');
    expect(res.status).toBe(200);
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { type: 'WORK' } }),
    );
  });

  it('filters by type=EDUCATION', async () => {
    const res = await request(app).get('/api/experiences?type=EDUCATION');
    expect(res.status).toBe(200);
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { type: 'EDUCATION' } }),
    );
  });

  it('rejects an invalid type', async () => {
    const res = await request(app).get('/api/experiences?type=NOPE');
    expect(res.status).toBe(400);
    expect(findMany).not.toHaveBeenCalled();
  });
});
