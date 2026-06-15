import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { Markdown } from './Markdown'

const content = [
  '# Heading 1',
  '## Heading 2',
  '### Heading 3',
  '#### Heading 4',
  '##### Heading 5',
  '###### Heading 6',
  '',
  'A paragraph with **bold**, *italic*, `inline code` and a [link](https://example.com).',
  '',
  '- bullet one',
  '- bullet two',
  '',
  '1. number one',
  '2. number two',
  '',
  '> a quoted line',
  '',
  '```js',
  'const block = true',
  '```',
  '',
  '---',
  '',
  '![alt text](https://example.com/img.png)',
].join('\n')

const renderMarkdown = () => renderWithTheme(<Markdown>{content}</Markdown>)

describe('Markdown', () => {
  it('maps headings to styled Typography elements', () => {
    renderMarkdown()
    for (let level = 1; level <= 6; level++) {
      expect(screen.getByRole('heading', { level, name: `Heading ${level}` })).toBeInTheDocument()
    }
  })

  it('maps inline elements: paragraph, bold, italic and link', () => {
    renderMarkdown()
    expect(screen.getByText('bold').tagName).toBe('STRONG')
    expect(screen.getByText('italic').tagName).toBe('EM')
    const link = screen.getByRole('link', { name: 'link' })
    expect(link).toHaveAttribute('href', 'https://example.com')
  })

  it('maps unordered and ordered lists', () => {
    renderMarkdown()
    expect(screen.getByText('bullet one').closest('ul')).toBeInTheDocument()
    expect(screen.getByText('number one').closest('ol')).toBeInTheDocument()
  })

  it('maps blockquotes', () => {
    renderMarkdown()
    expect(screen.getByText('a quoted line').closest('blockquote')).toBeInTheDocument()
  })

  it('maps inline code and fenced code blocks', () => {
    renderMarkdown()
    expect(screen.getByText('inline code').tagName).toBe('CODE')
    const block = screen.getByText('const block = true')
    expect(block.tagName).toBe('CODE')
    expect(block.closest('pre')).toBeInTheDocument()
  })

  it('maps horizontal rules and images', () => {
    renderMarkdown()
    expect(document.querySelector('hr')).toBeInTheDocument()
    expect(screen.getByAltText('alt text')).toHaveAttribute('src', 'https://example.com/img.png')
  })
})
