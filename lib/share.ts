import { getCountry } from './countries'

export interface ShareContext {
  daysLeft: number
  countryCode?: string | null
  visitorsFromCountry?: number
  totalVisitors?: number
  siteUrl?: string
}

function buildSiteUrl(ctx: ShareContext) {
  return ctx.siteUrl ?? (typeof window !== 'undefined' ? window.location.href : 'https://wc26timer.com')
}

function buildMessage(ctx: ShareContext): string {
  const { daysLeft, countryCode, visitorsFromCountry } = ctx
  const country = countryCode ? getCountry(countryCode) : null
  const countryPart = country ? ` Join ${visitorsFromCountry?.toLocaleString() ?? 'thousands of'} fans from ${country.name}${country.flag}!` : ''
  return `Only ${daysLeft} day${daysLeft === 1 ? '' : 's'} until FIFA World Cup 2026! ⚽🌍 Who are you supporting?${countryPart}`
}

export function twitterShareUrl(ctx: ShareContext): string {
  const text = buildMessage(ctx)
  const url = buildSiteUrl(ctx)
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=WorldCup2026,FIFA`
}

export function facebookShareUrl(ctx: ShareContext): string {
  const url = buildSiteUrl(ctx)
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
}

export function linkedinShareUrl(ctx: ShareContext): string {
  const text = buildMessage(ctx)
  const url = buildSiteUrl(ctx)
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`
}

export function whatsappShareUrl(ctx: ShareContext): string {
  const text = buildMessage(ctx) + ' ' + buildSiteUrl(ctx)
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

export function telegramShareUrl(ctx: ShareContext): string {
  const text = buildMessage(ctx)
  const url = buildSiteUrl(ctx)
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
}

export function redditShareUrl(ctx: ShareContext): string {
  const url = buildSiteUrl(ctx)
  const title = `Only ${ctx.daysLeft} days until FIFA World Cup 2026! Live countdown with global fan tracker 🌍`
  return `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
}

export function buildReferralUrl(userId: string): string {
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://wc26timer.com'
  return `${base}?ref=${userId}`
}

export function generateUserId(): string {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('wc26_uid') : null
  if (stored) return stored
  const id = Math.random().toString(36).slice(2, 10)
  if (typeof window !== 'undefined') localStorage.setItem('wc26_uid', id)
  return id
}

export function trackReferral(): void {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  const ref = params.get('ref')
  if (ref) {
    const refs = JSON.parse(localStorage.getItem('wc26_referrals') ?? '[]') as string[]
    if (!refs.includes(ref)) {
      refs.push(ref)
      localStorage.setItem('wc26_referrals', JSON.stringify(refs))
    }
  }
}
