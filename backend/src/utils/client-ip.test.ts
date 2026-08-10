import { describe, it, expect } from 'vitest';
import type { Request } from 'express';
import { getClientIp } from './client-ip.js';

function fakeReq(headers: Record<string, string | string[] | undefined>, ip?: string): Request {
  return { headers, ip } as unknown as Request;
}

describe('getClientIp', () => {
  it('prefers CF-Connecting-IP when present and IP-shaped', () => {
    const req = fakeReq({ 'cf-connecting-ip': '203.0.113.9' }, '10.0.0.1');
    expect(getClientIp(req)).toBe('203.0.113.9');
  });

  it('falls back to req.ip when CF-Connecting-IP is absent', () => {
    const req = fakeReq({}, '198.51.100.7');
    expect(getClientIp(req)).toBe('198.51.100.7');
  });

  it('ignores a CF-Connecting-IP that does not look like an IP', () => {
    const req = fakeReq({ 'cf-connecting-ip': 'not-an-ip' }, '198.51.100.7');
    expect(getClientIp(req)).toBe('198.51.100.7');
  });

  it('takes the first value when the header is an array', () => {
    const req = fakeReq({ 'cf-connecting-ip': ['203.0.113.9', '203.0.113.10'] }, '10.0.0.1');
    expect(getClientIp(req)).toBe('203.0.113.9');
  });

  it('strips the ::ffff: IPv4-in-IPv6 prefix', () => {
    const req = fakeReq({}, '::ffff:198.51.100.7');
    expect(getClientIp(req)).toBe('198.51.100.7');
  });

  it('accepts an IPv6 CF-Connecting-IP', () => {
    const req = fakeReq({ 'cf-connecting-ip': '2001:db8::1' }, '10.0.0.1');
    expect(getClientIp(req)).toBe('2001:db8::1');
  });

  it('returns an empty string when neither source is available', () => {
    const req = fakeReq({});
    expect(getClientIp(req)).toBe('');
  });
});
