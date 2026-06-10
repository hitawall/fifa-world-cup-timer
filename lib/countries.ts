export interface CountryInfo {
  code: string
  name: string
  flag: string
  seed: number
  isWC2026Team: boolean
}

export const COUNTRIES: CountryInfo[] = [
  // World Cup 2026 qualified teams (32 + hosts)
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', seed: 46200, isWC2026Team: true },
  { code: 'US', name: 'USA', flag: '🇺🇸', seed: 39800, isWC2026Team: true },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', seed: 31500, isWC2026Team: true },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', seed: 28900, isWC2026Team: true },
  { code: 'GB', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', seed: 24100, isWC2026Team: true },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', seed: 21400, isWC2026Team: true },
  { code: 'FR', name: 'France', flag: '🇫🇷', seed: 19800, isWC2026Team: true },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', seed: 17300, isWC2026Team: true },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', seed: 14900, isWC2026Team: true },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', seed: 12100, isWC2026Team: true },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', seed: 11800, isWC2026Team: true },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', seed: 10200, isWC2026Team: true },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', seed: 9400, isWC2026Team: true },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', seed: 8800, isWC2026Team: true },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', seed: 8200, isWC2026Team: true },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', seed: 7600, isWC2026Team: true },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', seed: 7200, isWC2026Team: true },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', seed: 6800, isWC2026Team: true },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', seed: 6400, isWC2026Team: true },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', seed: 6100, isWC2026Team: true },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', seed: 5800, isWC2026Team: true },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', seed: 5400, isWC2026Team: true },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', seed: 5100, isWC2026Team: true },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', seed: 4800, isWC2026Team: true },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', seed: 4500, isWC2026Team: true },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', seed: 4200, isWC2026Team: true },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲', seed: 3900, isWC2026Team: true },
  { code: 'IR', name: 'Iran', flag: '🇮🇷', seed: 3600, isWC2026Team: true },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', seed: 3300, isWC2026Team: true },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨', seed: 3000, isWC2026Team: true },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', seed: 2800, isWC2026Team: true },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳', seed: 2500, isWC2026Team: true },
  // Major non-WC countries with football following
  { code: 'IN', name: 'India', flag: '🇮🇳', seed: 8900, isWC2026Team: false },
  { code: 'CN', name: 'China', flag: '🇨🇳', seed: 7200, isWC2026Team: false },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', seed: 5100, isWC2026Team: false },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', seed: 4600, isWC2026Team: false },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', seed: 3200, isWC2026Team: false },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', seed: 2800, isWC2026Team: false },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', seed: 2500, isWC2026Team: false },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', seed: 2200, isWC2026Team: false },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', seed: 2000, isWC2026Team: false },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', seed: 1800, isWC2026Team: false },
  { code: 'CD', name: 'DR Congo', flag: '🇨🇩', seed: 1600, isWC2026Team: false },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', seed: 1900, isWC2026Team: false },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', seed: 2100, isWC2026Team: false },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', seed: 1400, isWC2026Team: false },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', seed: 1600, isWC2026Team: false },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿', seed: 2400, isWC2026Team: false },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩', seed: 1200, isWC2026Team: false },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', seed: 1100, isWC2026Team: false },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶', seed: 1500, isWC2026Team: false },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', seed: 3400, isWC2026Team: false },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', seed: 3800, isWC2026Team: false },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', seed: 2900, isWC2026Team: false },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', seed: 2600, isWC2026Team: false },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', seed: 3100, isWC2026Team: false },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', seed: 2300, isWC2026Team: false },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', seed: 2000, isWC2026Team: false },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', seed: 1800, isWC2026Team: false },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', seed: 1700, isWC2026Team: false },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', seed: 1500, isWC2026Team: false },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', seed: 2200, isWC2026Team: false },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴', seed: 1400, isWC2026Team: false },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾', seed: 1600, isWC2026Team: false },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', seed: 1300, isWC2026Team: false },
]

const COUNTRY_MAP = new Map(COUNTRIES.map((c) => [c.code, c]))

export function getCountry(code: string): CountryInfo | undefined {
  return COUNTRY_MAP.get(code.toUpperCase())
}

export function getTopCountries(data: Record<string, number>, limit = 10): Array<CountryInfo & { count: number }> {
  return Object.entries(data)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([code, count]) => {
      const info = getCountry(code) ?? {
        code,
        name: code,
        flag: '🏳️',
        seed: 0,
        isWC2026Team: false,
      }
      return { ...info, count }
    })
}
