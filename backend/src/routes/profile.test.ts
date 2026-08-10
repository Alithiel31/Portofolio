import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const { findFirst } = vi.hoisted(() => ({ findFirst: vi.fn() }));

vi.mock('../prisma.js', () => ({
  default: { profile: { findFirst } },
}));

const { default: profileRouter } = await import('./profile.js');

const app = express();
app.use('/api/profile', profileRouter);

const BASE_PROFILE = {
  id: 1,
  name: 'Alithiel31',
  titleEn: 'Full Stack Developer',
  titleFr: 'Développeur Full Stack',
  bioEn: 'English bio',
  bioFr: 'Bio en français',
  photoUrl: null,
  email: null,
  location: null,
  cvEn: '/cv-en.pdf',
  cvFr: '/cv-fr.pdf',
  socialLinks: [],
};

describe('GET /api/profile', () => {
  beforeEach(() => {
    findFirst.mockReset();
  });

  it('returns 404 when no profile exists', async () => {
    findFirst.mockResolvedValue(null);
    const res = await request(app).get('/api/profile');
    expect(res.status).toBe(404);
  });

  it('defaults to English fields', async () => {
    findFirst.mockResolvedValue(BASE_PROFILE);
    const res = await request(app).get('/api/profile');
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Full Stack Developer');
    expect(res.body.bio).toBe('English bio');
    expect(res.body.titleEn).toBeUndefined();
    expect(res.body.titleFr).toBeUndefined();
  });

  it('returns French fields when locale=fr', async () => {
    findFirst.mockResolvedValue(BASE_PROFILE);
    const res = await request(app).get('/api/profile?locale=fr');
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Développeur Full Stack');
    expect(res.body.bio).toBe('Bio en français');
  });

  it('falls back to English when the French field is null', async () => {
    findFirst.mockResolvedValue({ ...BASE_PROFILE, titleFr: null, bioFr: null });
    const res = await request(app).get('/api/profile?locale=fr');
    expect(res.body.title).toBe('Full Stack Developer');
    expect(res.body.bio).toBe('English bio');
  });
});
