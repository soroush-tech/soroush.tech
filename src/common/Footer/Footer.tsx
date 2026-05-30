import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { View } from 'src/theme/View'
import { Logo } from 'src/common/Logo'
import { Flex } from 'src/theme/Flex'
import { Grid } from 'src/theme/Grid'
import { Typography } from 'src/theme/Typography'
import { Navbar } from 'src/common/Navbar'

const DIRECTORIES = [
  { href: '/design/system', label: 'Design System' },
  { href: '/domain', label: 'System Domain' },
  { href: '/about', label: 'AI Automation' },
  { href: '/blog', label: 'Contacts' },
]

const CONNECTIVITY = [
  { href: 'https://github.com/soroushm', target: '_blank', label: 'GitHub Repository' },
  { href: '/npm', label: 'NPM Packages' },
  { href: 'wiki', label: 'Technical Wiki' },
]

// single-side top border — View's borderColor applies to all four sides
const FooterRoot = styled(View, { label: 'FooterRoot' })`
  border-top: 1px solid ${({ theme }) => theme.border.primary}1A;
`

const TerminalBlock = styled(View, { label: 'TerminalBlock' })`
  border-left: 2px solid ${({ theme }) => theme.border.primary};
`

const pulseAnim = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
`

const TerminalText = styled('span', { label: 'TerminalText' })`
  display: block;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes[0]}px;
  color: ${({ theme }) => theme.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  animation: ${pulseAnim} 1s ease-in-out infinite;
`

export function Footer() {
  return (
    <FooterRoot as="footer" bg="terminal" px={6} py={6}>
      <View maxWidth="1280px" mx="auto">
        <Grid gridTemplateColumns="repeat(4, 1fr)" gap={6}>
          {/* Col 1 — Logo + tagline */}
          <View>
            <Flex flexDirection="row" alignItems="center" gap={2} mb={3}>
              <Logo size={72} />
              <Typography
                as="span"
                fontSize={1}
                fontWeight="bold"
                letterSpacing="tighter"
                color="initial"
              >
                SOROUSH.TECH
              </Typography>
            </Flex>
            <Typography variant="caption" color="secondary" lineHeight="relaxed">
              A proprietary system designed for the orchestration of high-performance digital
              environments. Built for speed, scaled for eternity.
            </Typography>
          </View>

          {/* Col 2 — Directories (internal NavLinks) */}
          <View>
            <Typography
              variant="caption"
              letterSpacing="widest"
              color="primary"
              display="block"
              mb={3}
              fontFamily="mono"
              textTransform="uppercase"
            >
              Directories
            </Typography>
            <Navbar
              items={DIRECTORIES}
              direction="vertical"
              gap={2}
              variant="caption"
              underline="none"
            />
          </View>

          {/* Col 3 — Connectivity (external links) */}
          <View>
            <Typography
              variant="caption"
              letterSpacing="widest"
              color="primary"
              display="block"
              mb={3}
              fontFamily="mono"
              textTransform="uppercase"
            >
              Connectivity
            </Typography>
            <Navbar
              items={CONNECTIVITY}
              direction="vertical"
              gap={2}
              variant="caption"
              underline="none"
            />
          </View>

          {/* Col 4 — Terminal readout + copyright */}
          <View>
            <TerminalBlock bg="primary" p={3} mb={4}>
              <Typography
                variant="caption"
                color="primary"
                display="block"
                mb={1}
                fontFamily="mono"
              >
                SYSTEM_OUTPUT
              </Typography>
              <TerminalText>Running diagnostic sequence... OK</TerminalText>
            </TerminalBlock>
            <Typography variant="caption" color="secondary" opacity={0.5} fontFamily="mono">
              © 2026 SOROUSH.TECH. ALL RIGHTS RESERVED.
            </Typography>
          </View>
        </Grid>
      </View>
    </FooterRoot>
  )
}
