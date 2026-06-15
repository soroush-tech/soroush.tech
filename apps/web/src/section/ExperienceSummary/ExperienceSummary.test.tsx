import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { ExperienceSummary } from './ExperienceSummary'
import { stats, skills } from './ExperienceSummary.data'

describe('ExperienceSummary', () => {
  describe('element', () => {
    it('renders as a section element', () => {
      renderWithTheme(<ExperienceSummary />)
      expect(document.querySelector('section')).toBeInTheDocument()
    })
  })

  describe('summary', () => {
    it('renders the heading', () => {
      renderWithTheme(<ExperienceSummary />)
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Professional Summary')
    })

    it('renders the open-source contribution handle', () => {
      renderWithTheme(<ExperienceSummary />)
      expect(screen.getByText('@material-native-ui/theme-provider')).toBeInTheDocument()
    })

    it.each(stats)('renders the $value stat ($label)', ({ value, label }) => {
      renderWithTheme(<ExperienceSummary />)
      expect(screen.getByText(value)).toBeInTheDocument()
      expect(screen.getByText(label)).toBeInTheDocument()
    })
  })

  describe('stack matrix', () => {
    it('renders the matrix heading', () => {
      renderWithTheme(<ExperienceSummary />)
      expect(
        screen.getByRole('heading', { level: 3, name: 'Technical_Stack_Matrix' })
      ).toBeInTheDocument()
    })

    it('renders a labelled progressbar per skill group', () => {
      renderWithTheme(<ExperienceSummary />)
      const bars = screen.getAllByRole('progressbar')
      expect(bars).toHaveLength(skills.length)
      const [firstSkill] = skills
      expect(
        screen.getByRole('progressbar', {
          name: `${firstSkill.label} proficiency: ${firstSkill.level}`,
        })
      ).toHaveAttribute('aria-valuenow', String(firstSkill.value))
    })

    it.each(skills.flatMap(({ tags }) => tags))('renders the %s tag', (tag) => {
      renderWithTheme(<ExperienceSummary />)
      expect(screen.getAllByText(tag).length).toBeGreaterThan(0)
    })
  })
})
