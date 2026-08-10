import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createRateLimiter } from './rate-limit.js';

describe('createRateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows requests up to max within the window', () => {
    const check = createRateLimiter({ windowMs: 1000, max: 3 });
    expect(check('1.2.3.4')).toBe(true);
    expect(check('1.2.3.4')).toBe(true);
    expect(check('1.2.3.4')).toBe(true);
  });

  it('rejects requests beyond max within the window', () => {
    const check = createRateLimiter({ windowMs: 1000, max: 2 });
    expect(check('1.2.3.4')).toBe(true);
    expect(check('1.2.3.4')).toBe(true);
    expect(check('1.2.3.4')).toBe(false);
  });

  it('tracks distinct IPs independently', () => {
    const check = createRateLimiter({ windowMs: 1000, max: 1 });
    expect(check('1.1.1.1')).toBe(true);
    expect(check('2.2.2.2')).toBe(true);
    expect(check('1.1.1.1')).toBe(false);
    expect(check('2.2.2.2')).toBe(false);
  });

  it('resets the count once the window has elapsed', () => {
    const check = createRateLimiter({ windowMs: 1000, max: 1 });
    expect(check('1.2.3.4')).toBe(true);
    expect(check('1.2.3.4')).toBe(false);

    vi.advanceTimersByTime(1001);

    expect(check('1.2.3.4')).toBe(true);
  });
});
