import { useState, type ComponentType, type ImgHTMLAttributes, type CSSProperties } from 'react'
import styled from '@emotion/styled'
import { createShouldForwardProp, props } from '@styled-system/should-forward-prop'
import {
  layout,
  space,
  background,
  position,
  system,
  type LayoutProps,
  type SpaceProps,
  type BackgroundProps,
  type PositionProps,
} from 'styled-system'

type Phase = 'initial' | 'without-srcset' | 'fallback' | 'failed'

export interface ImageProps
  extends
    Omit<ImgHTMLAttributes<HTMLImageElement>, 'height' | 'width' | 'color'>,
    LayoutProps,
    SpaceProps,
    BackgroundProps,
    PositionProps {
  /** Fallback image URL tried when src (or srcSet) fails to load. */
  fallback?: string
  objectFit?: CSSProperties['objectFit']
  objectPosition?: CSSProperties['objectPosition']
  /** Called once when all image sources are exhausted. */
  onError?: () => void
}

const shouldForwardProp = createShouldForwardProp([
  ...props,
  'fallback',
  'objectFit',
  'objectPosition',
])

const objectSystem = system({
  objectFit: { property: 'objectFit' },
  objectPosition: { property: 'objectPosition' },
})

const StyledImg = styled('img', { label: 'image', shouldForwardProp })(
  layout,
  space,
  background,
  position,
  objectSystem
) as ComponentType<Omit<ImageProps, 'onError'> & { onError?: () => void }>

export function Image({ src, srcSet, fallback, alt, onError, ...rest }: ImageProps) {
  const [prevSrc, setPrevSrc] = useState(src)
  const [prevSrcSet, setPrevSrcSet] = useState(srcSet)
  const [prevFallback, setPrevFallback] = useState(fallback)
  const [phase, setPhase] = useState<Phase>('initial')

  if (prevSrc !== src || prevSrcSet !== srcSet || prevFallback !== fallback) {
    setPrevSrc(src)
    setPrevSrcSet(srcSet)
    setPrevFallback(fallback)
    setPhase('initial')
  }

  const handleError = () => {
    if (phase === 'initial') {
      // srcset candidate failed
      if (srcSet && src) {
        setPhase('without-srcset')
        return
      }

      if (fallback) {
        setPhase('fallback')
        return
      }

      setPhase('failed')
      onError?.()
      return
    }

    if (phase === 'without-srcset') {
      // plain src failed
      if (fallback) {
        setPhase('fallback')
        return
      }

      setPhase('failed')
      onError?.()
      return
    }

    if (phase === 'fallback') {
      // fallback failed too
      setPhase('failed')
      onError?.()
    }
  }

  const resolvedSrc = phase === 'fallback' || !src ? fallback : src
  const resolvedSrcSet = phase === 'initial' ? srcSet : undefined

  return (
    <StyledImg
      src={resolvedSrc}
      srcSet={resolvedSrcSet}
      alt={alt}
      onError={handleError}
      {...rest}
    />
  )
}
