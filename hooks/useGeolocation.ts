'use client'

import { useEffect, useState } from 'react'
import { detectCountryFromIP, detectCountryFromServerAPI } from '@/lib/geo'
import { recordVisit } from '@/lib/visitor-store'

const KEY = 'wc26_country'

export function useGeolocation() {
  const [country, setCountry] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function detect() {
      // Check localStorage cache first
      const cached = localStorage.getItem(KEY)
      if (cached) {
        setCountry(cached)
        setLoading(false)
        recordVisit(cached)
        return
      }

      // Try geojs.io (IP-based, no permission required)
      let detected = await detectCountryFromIP()

      // Fall back to server route (uses Vercel/CF headers)
      if (!detected) {
        detected = await detectCountryFromServerAPI()
      }

      if (detected) {
        localStorage.setItem(KEY, detected)
        setCountry(detected)
        recordVisit(detected)
      }
      setLoading(false)
    }

    detect()
  }, [])

  const setManually = (code: string) => {
    localStorage.setItem(KEY, code)
    setCountry(code)
    recordVisit(code)
  }

  return { country, loading, setManually }
}
