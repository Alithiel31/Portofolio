import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const { findMany, findUnique } = vi.hoisted(() => ({
  findMany: vi.fn(),
  findUnique: vi.fn(),
}));

vi.mock('../prisma.js', () => ({
  default: { project: { findMany, findUnique } },
}));

const { default: projectsRouter } = await import('./projects.js');

const app = express();
app.use('/api/projects', projectsRouter);

const PROJECT = {
  id: 1,
  titleEn: 'Portfolio',
  titleFr: 'Portfolio (FR)',
  descriptionEn: 'A portfolio site',
  descriptionFr: 'Un site portfolio',
  techStack: 'Svelte,Express',
  imageUrl: null,
  demoUrl: null,
  githubUrl: null,
  featured: true,
  status: 'COMPLETED',
  order: 0,
};

describe('GET /api/projects', () => {
  beforeEach(() => {
    findMany.mockReset();
    findUnique.mockReset();
    findMany.mockResolvedValue([PROJECT]);
  });

  it('returns all projects, localized to English by default', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(200);
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ where: undefined }));
    expect(res.body[0].title).toBe('Portfolio');
  });

  it('filters featured=true', async () => {
    const res = await request(app).get('/api/projects?featured=true');
    expect(res.status).toBe(200);
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { featured: true } }));
  });

  it('does not filter on any other featured value', async () => {
    const res = await request(app).get('/api/projects?featured=nope');
    expect(res.status).toBe(200);
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ where: undefined }));
  });
});

describe('GET /api/projects/:id', () => {
  beforeEach(() => {
    findMany.mockReset();
    findUnique.mockReset();
  });

  it('returns a project by id, localized to French when requested', async () => {
    findUnique.mockResolvedValue(PROJECT);
    const res = await request(app).get('/api/projects/1?locale=fr');
    expect(res.status).toBe(200);
    expect(findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res.body.title).toBe('Portfolio (FR)');
  });

  it('returns 404 when the project does not exist', async () => {
    findUnique.mockResolvedValue(null);
    const res = await request(app).get('/api/projects/999');
    expect(res.status).toBe(404);
  });

  it('rejects a non-numeric id', async () => {
    const res = await request(app).get('/api/projects/not-a-number');
    expect(res.status).toBe(400);
    expect(findUnique).not.toHaveBeenCalled();
  });

  it('rejects a non-positive id', async () => {
    const res = await request(app).get('/api/projects/0');
    expect(res.status).toBe(400);
    expect(findUnique).not.toHaveBeenCalled();
  });
});
