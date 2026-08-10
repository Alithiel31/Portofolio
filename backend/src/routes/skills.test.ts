import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const { findMany } = vi.hoisted(() => ({ findMany: vi.fn() }));

vi.mock('../prisma.js', () => ({
  default: { skillCategory: { findMany } },
}));

const { default: skillsRouter } = await import('./skills.js');

const app = express();
app.use('/api/skills', skillsRouter);

const CATEGORY = {
  id: 1,
  name: 'Backend',
  nameFr: 'Backend (FR)',
  icon: 'bx-server',
  order: 0,
  skills: [{ id: 1, name: 'Node.js', type: 'MAIN', parent: null, iconUrl: null, order: 0 }],
};

describe('GET /api/skills', () => {
  beforeEach(() => {
    findMany.mockReset();
    findMany.mockResolvedValue([CATEGORY]);
  });

  it('returns categories with their skills, English name by default', async () => {
    const res = await request(app).get('/api/skills');
    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe('Backend');
    expect(res.body[0].nameFr).toBeUndefined();
    expect(res.body[0].skills).toHaveLength(1);
  });

  it('returns the French name when locale=fr', async () => {
    const res = await request(app).get('/api/skills?locale=fr');
    expect(res.body[0].name).toBe('Backend (FR)');
  });

  it('falls back to the English name when nameFr is null, even for locale=fr', async () => {
    findMany.mockResolvedValue([{ ...CATEGORY, nameFr: null }]);
    const res = await request(app).get('/api/skills?locale=fr');
    expect(res.body[0].name).toBe('Backend');
  });
});
