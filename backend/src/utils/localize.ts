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
    const frKey = `${field}Fr`
    if (locale === 'fr' && result[frKey] != null) {
      result[field] = result[frKey]
    }
    delete result[frKey]
  }
  return result
}
