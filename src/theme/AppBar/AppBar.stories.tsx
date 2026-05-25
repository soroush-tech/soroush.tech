import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { m, p, position } from 'src/theme/utils/test/storiesArgs'
import { appBarSizeTokens, backgroundTokens } from 'src/theme/utils/test/storiesOptions'
import { ThemeProvider } from 'src/theme/ThemeProvider'
import { dark, light } from 'src/theme/themes'
import { Avatar } from 'src/theme/Avatar'
import { Flex } from 'src/theme/Flex'
import { Link } from 'src/theme/Link'
import { Typography } from 'src/theme/Typography'
import { Switch } from 'src/theme/Switch'
import { View } from 'src/theme/View'
import { AppBar } from './AppBar'
import Logo from '/soroush.svg'

const SunIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="0.6em"
    height="0.6em"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
)

const MoonIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="0.6em"
    height="0.6em"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const meta: Meta<typeof AppBar> = {
  title: 'Theme/AppBar',
  component: AppBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: {
      include: ['children', 'color', 'size', 'elevation', 'position', 'm', 'p'],
    },
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Content rendered inside the AppBar.',
      table: { category: 'Content' },
    },
    color: {
      control: { type: 'select' },
      options: backgroundTokens,
      description: 'Background color — resolves from theme.background.',
      table: { category: 'Visual' },
    },
    size: {
      control: { type: 'select' },
      options: appBarSizeTokens,
      description: 'Padding preset — resolves from theme.sizes. Default: "md".',
      table: { category: 'Visual', defaultValue: { summary: 'md' } },
    },
    elevation: {
      control: { type: 'number', min: 0, max: 24 },
      description: 'Box-shadow elevation — resolves from theme.shadows[n]. Omit for no shadow.',
      table: { category: 'Visual' },
    },
    position,
    m,
    p,
  },
}

export default meta
type Story = StoryObj<typeof AppBar>

export const Default: Story = {
  args: {
    color: 'paper',
    children: 'Application Header',
  },
}

export const Colors: Story = {
  render: () => (
    <Flex flexDirection="column">
      {(['paper', 'primary', 'secondary', 'modal'] as const).map((color) => (
        <AppBar key={color} color={color} mb={1}>
          <Flex flexDirection="row" alignItems="center" px={2} py={1.5}>
            <Typography variant="caption" color="secondary" m={0}>
              color="{color}"
            </Typography>
          </Flex>
        </AppBar>
      ))}
    </Flex>
  ),
}

export const Sizes: Story = {
  render: () => (
    <Flex flexDirection="column">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <AppBar key={size} size={size} color="paper" mb={1}>
          <Flex flexDirection="row" alignItems="center">
            <Typography variant="caption" color="secondary" m={0}>
              size=&quot;{size}&quot;
            </Typography>
          </Flex>
        </AppBar>
      ))}
    </Flex>
  ),
}

export const Positions: Story = {
  render: () => (
    <Flex flexDirection="column">
      {(['static', 'relative', 'sticky'] as const).map((pos) => (
        <AppBar key={pos} position={pos} color="paper" mb={1}>
          <Flex flexDirection="row" alignItems="center" px={2} py={1.5}>
            <Typography variant="caption" color="secondary" m={0}>
              position=&quot;{pos}&quot;
            </Typography>
          </Flex>
        </AppBar>
      ))}
      {(['absolute', 'fixed'] as const).map((pos) => (
        <Flex key={pos} position="relative" height="48px" mb={1}>
          <AppBar position={pos} color="paper">
            <Flex flexDirection="row" alignItems="center" px={2} py={1.5}>
              <Typography variant="caption" color="secondary" m={0}>
                position=&quot;{pos}&quot;
              </Typography>
            </Flex>
          </AppBar>
        </Flex>
      ))}
    </Flex>
  ),
}

export const Elevations: Story = {
  render: () => (
    <Flex flexDirection="column">
      {([0, 4, 8, 12, 16, 24] as const).map((elevation) => (
        <AppBar key={elevation} elevation={elevation} color="paper" mb={1}>
          <Flex flexDirection="row" alignItems="center" px={2} py={1.5}>
            <Typography variant="caption" color="secondary" m={0}>
              elevation={elevation}
            </Typography>
          </Flex>
        </AppBar>
      ))}
    </Flex>
  ),
}

const NAV_LINKS = ['Home', 'Experience', 'Stack', 'Architecture', 'Contact'] as const

export const SiteHeader: Story = {
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
  render: () => (
    <AppBar
      color="primary"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      px={3}
      elevation={4}
      minHeight={64}
    >
      {/* Logo */}
      <Flex flexDirection="row" alignItems="center" gap={2}>
        <Avatar variant="square" size="sm" src={Logo} alt="Masoud Soroush">
          <Typography variant="caption" color="primary" m={0}>
            M
          </Typography>
        </Avatar>
        <Typography variant="h6" color="secondary" m={0} fontFamily="monospace">
          Masoud Soroush
        </Typography>
      </Flex>

      {/* Nav */}
      <Flex flexDirection="row" alignItems="center" gap={3}>
        {NAV_LINKS.map((label, i) => (
          <Link
            key={label}
            underline="hover"
            color={i === 0 ? 'secondary' : 'initial'}
            m={0}
            fontFamily="monospace"
          >
            {label}
          </Link>
        ))}
      </Flex>

      {/* Actions */}
      <Flex flexDirection="row" alignItems="center" gap={1}>
        <View height="32px" mx={2} width="2px" bg="grid" />
        <Flex flexDirection="column" alignItems="flex-end">
          <Typography
            variant="caption"
            color="secondary"
            m={0}
            style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}
          >
            Status
          </Typography>
          <Typography
            variant="caption"
            color="primary"
            m={0}
            style={{ fontFamily: 'monospace', fontSize: '12px' }}
          >
            OPTIMIZED
          </Typography>
        </Flex>
      </Flex>
    </AppBar>
  ),
}

export const DarkMode: Story = {
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
  render: () => {
    const [isDark, setIsDark] = useState(false)
    return (
      <ThemeProvider theme={isDark ? dark : light}>
        <AppBar
          color="secondary"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          px={3}
          elevation={4}
          minHeight={64}
        >
          <Flex flexDirection="row" alignItems="center" gap={2}>
            <Avatar variant="square" size="sm" src={Logo} alt="Masoud Soroush">
              <Typography variant="caption" color="primary" m={0}>
                M
              </Typography>
            </Avatar>
            <Typography variant="h6" color="secondary" m={0} fontFamily="monospace">
              Masoud Soroush
            </Typography>
          </Flex>

          <Flex flexDirection="row" alignItems="center" gap={3}>
            {NAV_LINKS.map((label, i) => (
              <Link
                key={label}
                underline="hover"
                color={i === 0 ? 'secondary' : 'initial'}
                m={0}
                fontFamily="monospace"
              >
                {label}
              </Link>
            ))}
          </Flex>

          <Switch
            checked={isDark}
            color="default"
            onChange={(e) => setIsDark(e.target.checked)}
            icon={<SunIcon />}
            checkedIcon={<MoonIcon />}
            aria-label="Toggle dark mode"
          />
        </AppBar>
      </ThemeProvider>
    )
  },
}
