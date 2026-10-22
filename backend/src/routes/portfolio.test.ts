import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const mocks = vi.hoisted(() => ({
  profileFindFirst: vi.fn(),
  experienceFindMany: vi.fn(),
  skillCategoryFindMany: vi.fn(),
  projectFindMany: vi.fn(),
  serviceFindMany: vi.fn(),
  geoLookup: vi.fn(),
}));

vi.mock('../prisma.js', () => ({
  default: {
    profile: { findFirst: mocks.profileFindFirst },
    experience: { findMany: mocks.experienceFindMany },
    skillCategory: { findMany: mocks.skillCategoryFindMany },
    project: { findMany: mocks.projectFindMany },
    service: { findMany: mocks.serviceFindMany },
  },
}));

vi.mock('geoip-lite', () => ({ default: { lookup: mocks.geoLookup } }));

const { default: portfolioRouter } = await import('./portfolio.js');

const app = express();
app.set('trust proxy', 1);
app.use('/api/portfolio', portfolioRouter);

const PROFILE = {
  id: 1,
  name: 'Jacques',
  titleEn: 'Full Stack Developer',
  titleFr: 'Développeur Full Stack',
  bioEn: 'Bio',
  bioFr: 'Biographie',
  socialLinks: [],
};

describe('GET /api/portfolio', () => {
  beforeEach(() => {
    Object.values(mocks).forEach((m) => m.mockReset());
    mocks.profileFindFirst.mockResolvedValue(PROFILE);
    mocks.experienceFindMany.mockResolvedValue([
      { id: 1, titleEn: 'Dev', titleFr: 'Dév', descriptionEn: 'Did', descriptionFr: 'A fait' },
    ]);
    mocks.skillCategoryFindMany.mockResolvedValue([
      { id: 1, name: 'Languages', nameFr: 'Langages', skills: [] },
    ]);
    mocks.projectFindMany.mockResolvedValue([
      {
        id: 1,
        titleEn: 'App',
        titleFr: 'Appli',
        descriptionEn: 'An app',
        descriptionFr: 'Une appli',
      },
    ]);
    mocks.serviceFindMany.mockResolvedValue([]);
    mocks.geoLookup.mockReturnValue({ country: 'FR' });
  });

  it('returns every section of the home page in a single response', async () => {
    const res = await request(app).get('/api/portfolio');
    expect(res.status).toBe(200);
    expect(Object.keys(res.body).sort()).toEqual(
      ['experiences', 'location', 'profile', 'projects', 'services', 'skills'].sort(),
    );
    expect(res.body.profile.title).toBe('Full Stack Developer');
    expect(res.body.location).toBe('France');
  });

  it('localizes every section with locale=fr', async () => {
    const res = await request(app).get('/api/portfolio?locale=fr');
    expect(res.body.profile.title).toBe('Développeur Full Stack');
    expect(res.body.experiences[0].title).toBe('Dév');
    expect(res.body.skills[0].name).toBe('Langages');
    expect(res.body.projects[0].title).toBe('Appli');
    expect(res.body.projects[0].titleFr).toBeUndefined();
  });

  it('resolves the displayed location from the visitor IP', async () => {
    mocks.geoLookup.mockReturnValue({ country: 'CA' });
    const res = await request(app).get('/api/portfolio').set('CF-Connecting-IP', '24.48.0.1');
    expect(mocks.geoLookup).toHaveBeenCalledWith('24.48.0.1');
    expect(res.body.location).toBe('Montréal, QC');
  });

  it('returns 404 when no profile exists', async () => {
    mocks.profileFindFirst.mockResolvedValue(null);
    const res = await request(app).get('/api/portfolio');
    expect(res.status).toBe(404);
  });
});
