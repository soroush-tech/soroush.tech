import { type ReactNode } from 'react'
import { Paper, type PaperProps } from 'src/theme/Paper'
import { BracketBox } from 'src/theme/BracketBox'
import { Typography, type TypographyProps } from 'src/theme/Typography'

export type CardVariant = 'paper' | 'bracketBox'

export interface CardProps extends Omit<PaperProps, 'title'> {
  variant?: CardVariant
  title?: string | ReactNode
  caption?: string
  titleProps?: Omit<TypographyProps, 'children'>
  captionProps?: Omit<TypographyProps, 'children'>
}

export function Card({
  variant = 'paper',
  title,
  caption,
  titleProps,
  captionProps,
  flexDirection = 'column',
  children,
  ...rest
}: CardProps) {
  const Root = variant === 'bracketBox' ? BracketBox : Paper
  return (
    <Root flexDirection={flexDirection} {...rest}>
      {title !== undefined &&
        (typeof title === 'string' ? (
          <Typography variant="overline" color="primary" fontFamily="mono" mb={1} {...titleProps}>
            {title}
          </Typography>
        ) : (
          title
        ))}
      {caption !== undefined && (
        <Typography variant="caption" color="secondary" mb={5} {...captionProps}>
          {caption}
        </Typography>
      )}
      {children}
    </Root>
  )
}
