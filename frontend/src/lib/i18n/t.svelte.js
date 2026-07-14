import { locale } from '../stores/locale.svelte.js';
import { en } from './en.js';
import { fr } from './fr.js';

const translations = { en, fr };

export function t(key) {
  const dict = translations[locale.current] ?? translations.en;
  return key.split('.').reduce((obj, k) => obj?.[k], dict) ?? key;
}
