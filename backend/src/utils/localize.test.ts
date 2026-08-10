import { describe, it, expect } from 'vitest';
import { getLocale, localizeFields } from './localize.js';

describe('getLocale', () => {
  it('returns fr when query.locale is fr', () => {
    expect(getLocale({ locale: 'fr' })).toBe('fr');
  });

  it('falls back to en for anything else', () => {
    expect(getLocale({ locale: 'en' })).toBe('en');
    expect(getLocale({ locale: 'de' })).toBe('en');
    expect(getLocale({})).toBe('en');
  });
});

describe('localizeFields', () => {
  it('picks the En field when locale is en', () => {
    const result = localizeFields(
      { id: 1, titleEn: 'Hello', titleFr: 'Bonjour' },
      'en',
      ['title'],
    );
    expect(result.title).toBe('Hello');
    expect(result.titleEn).toBeUndefined();
    expect(result.titleFr).toBeUndefined();
  });

  it('picks the Fr field when locale is fr and it is set', () => {
    const result = localizeFields(
      { id: 1, titleEn: 'Hello', titleFr: 'Bonjour' },
      'fr',
      ['title'],
    );
    expect(result.title).toBe('Bonjour');
  });

  it('falls back to the En field when locale is fr but the Fr field is null', () => {
    const result = localizeFields({ id: 1, titleEn: 'Hello', titleFr: null }, 'fr', ['title']);
    expect(result.title).toBe('Hello');
  });

  it('localizes multiple fields independently', () => {
    const result = localizeFields(
      { titleEn: 'T-en', titleFr: 'T-fr', bioEn: 'B-en', bioFr: 'B-fr' },
      'fr',
      ['title', 'bio'],
    );
    expect(result.title).toBe('T-fr');
    expect(result.bio).toBe('B-fr');
  });
});
