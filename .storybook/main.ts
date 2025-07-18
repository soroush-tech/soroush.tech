import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    '@storybook/addon-themes',
  ],
  viteFinal: async (config) => {
    config.optimizeDeps = {
      ...(config.optimizeDeps || {}),
      include: ['react', 'react/jsx-dev-runtime'],
    }
    return config
  },
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
}
export default config
