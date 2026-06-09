declare module 'react-simple-maps' {
  import type { ComponentPropsWithoutRef, ReactNode } from 'react'

  interface Geography {
    rsmKey: string
    id: string | number
    properties: Record<string, string>
    [key: string]: unknown
  }

  interface GeographiesChildProps {
    geographies: Geography[]
  }

  export function ComposableMap(props: {
    projectionConfig?: Record<string, unknown>
    style?: React.CSSProperties
    children?: ReactNode
  }): JSX.Element

  export function ZoomableGroup(props: {
    zoom?: number
    children?: ReactNode
  }): JSX.Element

  export function Geographies(props: {
    geography: string
    children: (props: GeographiesChildProps) => ReactNode
  }): JSX.Element

  export function Geography(props: {
    key?: string
    geography: Geography
    fill?: string
    stroke?: string
    strokeWidth?: number
    style?: {
      default?: React.CSSProperties
      hover?: React.CSSProperties
      pressed?: React.CSSProperties
    }
    onMouseEnter?: (e: React.MouseEvent) => void
    onMouseLeave?: (e: React.MouseEvent) => void
    onClick?: (e: React.MouseEvent) => void
    'aria-label'?: string
  }): JSX.Element
}
