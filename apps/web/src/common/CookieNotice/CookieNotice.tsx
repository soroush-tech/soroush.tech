import { useState } from 'react'
import { styled, keyframes } from 'src/theme'
import { View } from 'src/theme/View'
import { Flex } from 'src/theme/Flex'
import { Icon } from 'src/theme/Icon'
import { Button } from 'src/theme/Button'
import { Typography } from 'src/theme/Typography'
import { alpha } from 'src/theme/utils'

export interface CookieNoticeProps {
  /** Body copy explaining the cookie situation. */
  message?: string
}

const DEFAULT_MESSAGE =
  'Cookie-Free by Design. The only cookies we like are the ones that come fresh from the oven.'

// Slides up from below the viewport on mount.
const slideIn = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
`

// Single-side top border — View's borderColor would apply to all four sides.
// Frosted-glass surface matching AppBar: semi-transparent appBar bg + backdrop blur.
const CookieNoticeRoot = styled(View, { label: 'CookieNoticeRoot' })`
  border-top: ${({ theme }) => theme.borderWidths.thin} solid
    ${({ theme }) => alpha(theme.border.primary, 0.3)};
  backdrop-filter: blur(${({ theme }) => theme.blur});
  -webkit-backdrop-filter: blur(${({ theme }) => theme.blur});
  animation: ${slideIn} 0.5s ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

/**
 * @description Sticky, dismissible bar that explains the site is cookie-free.
 * Pins to the viewport bottom while scrolling, then docks into place at the end of the page.
 * No persistence — re-shows on every page load; the X removes it for the session view.
 */
export function CookieNotice({ message = DEFAULT_MESSAGE }: CookieNoticeProps) {
  const [dismissed, setDismissed] = useState(false)
  const dismiss = () => setDismissed(true)

  if (dismissed) return null

  return (
    <CookieNoticeRoot
      role="region"
      aria-label="Cookie notice"
      position="sticky"
      bottom={0}
      bg="appBar"
      px={4}
      py={2}
      zIndex={10}
    >
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center" gap={[1, 4]}>
        <Flex flexDirection="row" alignItems="center" gap={3}>
          <Icon name="cookie" color="primary" />
          <Typography
            variant="body2"
            fontSize={[0, 1]}
            color="secondary"
            lineHeight="relaxed"
            m={0}
          >
            {message}
          </Typography>
        </Flex>
        <Button variant="text" size="sm" aria-label="Dismiss cookie notice" onClick={dismiss}>
          <Icon name="close" color="secondary" size="1.25rem" />
        </Button>
      </Flex>
    </CookieNoticeRoot>
  )
}
