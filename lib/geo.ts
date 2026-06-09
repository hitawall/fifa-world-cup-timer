export async function detectCountryFromIP(): Promise<string | null> {
  try {
    const res = await fetch('https://get.geojs.io/v1/ip/country.json', {
      signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) return null
    const data = (await res.json()) as { country?: string; country_3?: string }
    return data.country?.toUpperCase() ?? null
  } catch {
    return null
  }
}

export async function detectCountryFromServerAPI(): Promise<string | null> {
  try {
    const res = await fetch('/api/geo', { signal: AbortSignal.timeout(3000) })
    if (!res.ok) return null
    const data = (await res.json()) as { country?: string }
    return data.country?.toUpperCase() ?? null
  } catch {
    return null
  }
}
