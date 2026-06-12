import ReactMarkdown, { type Components } from 'react-markdown'
import { Image } from 'src/theme/Image'
import { Link } from 'src/theme/Link'
import { Typography } from 'src/theme/Typography'
import { View } from 'src/theme/View'
import { Blockquote } from 'src/common/Blockquote'

const components: Components = {
  h1: ({ children }) => (
    <Typography variant="h1" color="primary" gutterBottom>
      {children}
    </Typography>
  ),
  h2: ({ children }) => (
    <Typography variant="h2" color="primary" gutterBottom>
      {children}
    </Typography>
  ),
  h3: ({ children }) => (
    <Typography variant="h3" gutterBottom>
      {children}
    </Typography>
  ),
  h4: ({ children }) => (
    <Typography variant="h4" gutterBottom>
      {children}
    </Typography>
  ),
  h5: ({ children }) => (
    <Typography variant="h5" gutterBottom>
      {children}
    </Typography>
  ),
  h6: ({ children }) => (
    <Typography variant="h6" gutterBottom>
      {children}
    </Typography>
  ),
  p: ({ children }) => (
    <Typography variant="body1" color="secondary" gutterBottom>
      {children}
    </Typography>
  ),
  a: ({ href, children }) => (
    <Link href={href} underline="hover">
      {children}
    </Link>
  ),
  strong: ({ children }) => (
    <Typography as="strong" variant="inherit" fontWeight="bold">
      {children}
    </Typography>
  ),
  em: ({ children }) => (
    <Typography as="em" variant="inherit" fontStyle="italic">
      {children}
    </Typography>
  ),
  ul: ({ children }) => (
    <View as="ul" pl={3} mb={2}>
      {children}
    </View>
  ),
  ol: ({ children }) => (
    <View as="ol" pl={3} mb={2}>
      {children}
    </View>
  ),
  li: ({ children }) => (
    <Typography as="li" color="secondary" variant="body1">
      {children}
    </Typography>
  ),
  blockquote: ({ children }) => (
    <Blockquote as="blockquote" pl={3} py={1} my={2}>
      {children}
    </Blockquote>
  ),
  code: ({ className, children }) => {
    const isBlock = (className ?? '').includes('language-')
    return (
      <Typography
        as="code"
        variant="inherit"
        fontFamily="mono"
        display={isBlock ? 'block' : 'inline'}
        bg={isBlock ? 'transparent' : 'default'}
        px={isBlock ? 0 : 1}
        borderRadius="sm"
      >
        {children}
      </Typography>
    )
  },
  pre: ({ children }) => (
    <View
      as="pre"
      bg="default"
      p={3}
      my={2}
      borderRadius="md"
      borderColor="light"
      borderWidth="thin"
      overflow="auto"
    >
      {children}
    </View>
  ),
  hr: () => <View as="hr" my={4} height="1px" bg="grid" border="none" />,
  img: ({ src, alt }) => <Image src={src} alt={alt} maxWidth="100%" />,
}

export interface MarkdownProps {
  children: string
}

/** Renders a markdown string with every element mapped to a design-system primitive. */
export function Markdown({ children }: MarkdownProps) {
  return <ReactMarkdown components={components}>{children}</ReactMarkdown>
}
