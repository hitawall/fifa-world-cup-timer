'use client'

import { useEffect, useRef, useState } from 'react'
import { getServerSnapshot, getClientSnapshot, type VisitorData } from '@/lib/visitor-store'

const UPDATE_INTERVAL_MS = 3000

export function useVisitorData(userCountry: string | null): VisitorData {
  const [data, setData] = useState<VisitorData>(() => getServerSnapshot())
  const mountedRef = useRef(false)

  useEffect(() => {
    // First client tick — picks up localStorage and fine-grained growth
    setData(getClientSnapshot(userCountry))
    mountedRef.current = true

    const id = setInterval(() => {
      setData(getClientSnapshot(userCountry))
    }, UPDATE_INTERVAL_MS)

    return () => clearInterval(id)
  }, [userCountry])

  return data
}
