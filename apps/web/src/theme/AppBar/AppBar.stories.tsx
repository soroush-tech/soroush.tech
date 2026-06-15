import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { border, m, p, position } from 'src/theme/utils/test/storiesArgs'
import { appBarSizeTokens, backgroundTokens } from 'src/theme/utils/test/storiesOptions'
import { ThemeProvider } from 'src/theme/ThemeProvider'
import { dark, light } from 'src/theme/themes'
import { Avatar } from 'src/theme/Avatar'
import { Flex } from 'src/theme/Flex'
import { Link } from 'src/theme/Link'
import { Typography } from 'src/theme/Typography'
import { Switch } from 'src/theme/Switch'
import { View } from 'src/theme/View'
import SunIcon from 'src/assets/sun.svg?react'
import MoonIcon from 'src/assets/moon.svg?react'
import { AppBar } from './AppBar'
import Logo from '/soroush.svg'

const meta: Meta<typeof AppBar> = {
  title: 'Theme/AppBar',
  component: AppBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: {
      include: ['children', 'color', 'size', 'elevation', 'position', 'blur', 'border', 'm', 'p'],
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
    blur: {
      control: 'boolean',
      description:
        'Applies `backdrop-filter: blur(theme.blur)` + `-webkit-` prefix. Use with `color="backdrop"` for a frosted-glass effect.',
      table: { category: 'Visual', defaultValue: { summary: 'false' } },
    },
    border,
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

export const Frosted: Story = {
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
  render: () => (
    <AppBar
      color="backdrop"
      blur
      borderBottom="1px solid rgba(0,0,0,0.1)"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      px={3}
      elevation={0}
      minHeight={64}
    >
      <Typography variant="h6" color="secondary" m={0}>
        Frosted Glass Header
      </Typography>
      <Typography variant="caption" color="secondary" m={0}>
        blur + color="backdrop"
      </Typography>
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
            icon={<SunIcon aria-hidden="true" width={14} height={14} />}
            checkedIcon={<MoonIcon aria-hidden="true" width={14} height={14} />}
            aria-label="Toggle dark mode"
          />
        </AppBar>
      </ThemeProvider>
    )
  },
}
