import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const deleteMany = vi.fn();

vi.mock('../prisma.js', () => ({
  default: { pageView: { deleteMany: (...args: unknown[]) => deleteMany(...args) } },
}));

const { purgeExpiredPageViews } = await import('./retention.js');

describe('purgeExpiredPageViews', () => {
  beforeEach(() => {
    deleteMany.mockReset();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-10T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deletes PageView rows older than 25 months', async () => {
    deleteMany.mockResolvedValue({ count: 3 });

    const count = await purgeExpiredPageViews();

    expect(count).toBe(3);
    expect(deleteMany).toHaveBeenCalledTimes(1);
    const { where } = deleteMany.mock.calls[0][0];
    const cutoff: Date = where.createdAt.lt;
    expect(cutoff.toISOString()).toBe('2024-07-10T00:00:00.000Z');
  });

  it('returns 0 when nothing was deleted, without throwing', async () => {
    deleteMany.mockResolvedValue({ count: 0 });

    await expect(purgeExpiredPageViews()).resolves.toBe(0);
  });
});
