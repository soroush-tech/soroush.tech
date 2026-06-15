import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { TechStack } from './TechStack'
import { languages, frameworks, deploymentTags, qaTags } from './TechStack.data'

describe('TechStack', () => {
  describe('element', () => {
    it('renders as a section element', () => {
      renderWithTheme(<TechStack />)
      expect(document.querySelector('section')).toBeInTheDocument()
    })
  })

  describe('heading', () => {
    it('renders the section heading', () => {
      renderWithTheme(<TechStack />)
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('The Technical Stack')
    })

    it('renders the tagline', () => {
      renderWithTheme(<TechStack />)
      expect(screen.getByText('18 years of JS / 9 years of React')).toBeInTheDocument()
    })
  })

  describe('languages', () => {
    it.each(languages.map(({ name }) => name))('renders the %s language', (name) => {
      renderWithTheme(<TechStack />)
      expect(screen.getAllByText(name).length).toBeGreaterThan(0)
    })
  })

  describe('frameworks', () => {
    it.each(frameworks)('renders the %s framework', (name) => {
      renderWithTheme(<TechStack />)
      expect(screen.getAllByText(name).length).toBeGreaterThan(0)
    })
  })

  describe('deployment', () => {
    it.each(deploymentTags)('renders the %s tag', (tag) => {
      renderWithTheme(<TechStack />)
      expect(screen.getAllByText(tag).length).toBeGreaterThan(0)
    })
  })

  describe('quality assurance', () => {
    it.each(qaTags)('renders the %s tag', (tag) => {
      renderWithTheme(<TechStack />)
      expect(screen.getAllByText(tag).length).toBeGreaterThan(0)
    })
  })

  describe('AI highlight', () => {
    it('renders the AI section heading', () => {
      renderWithTheme(<TechStack />)
      expect(
        screen.getByRole('heading', { name: /AI.*Semantic Architecture/i })
      ).toBeInTheDocument()
    })

    it('renders the AI description', () => {
      renderWithTheme(<TechStack />)
      expect(screen.getByText(/Model Context Protocol/)).toBeInTheDocument()
    })

    it('renders the AI link', () => {
      renderWithTheme(<TechStack />)
      expect(screen.getByRole('link', { name: /ACCESS_AI_PROTOCOLS/i })).toBeInTheDocument()
    })
  })
})
