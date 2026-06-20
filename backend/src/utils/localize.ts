export type Locale = 'en' | 'fr'

export function getLocale(query: Record<string, unknown>): Locale {
  return query.locale === 'fr' ? 'fr' : 'en'
}

export function localizeFields<T extends Record<string, unknown>>(
  obj: T,
  locale: Locale,
  fields: string[]
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...obj }
  for (const field of fields) {
    const enKey = `${field}En`
    const frKey = `${field}Fr`
    result[field] = (locale === 'fr' && result[frKey] != null) ? result[frKey] : result[enKey]
    delete result[enKey]
    delete result[frKey]
  }
  return result
}
