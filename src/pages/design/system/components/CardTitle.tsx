import ExternalLinkIcon from 'src/assets/external-link.svg?react'
import { Flex } from 'src/theme/Flex'
import { Link } from 'src/theme/Link'
import { Typography } from 'src/theme/Typography'
import { View } from 'src/theme/View'

export interface CardTitleProps {
  title: string
  storybookHref?: string
}

export function CardTitle({ title, storybookHref }: CardTitleProps) {
  return (
    <View mb={1}>
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <Typography variant="overline" color="primary" fontFamily="mono" m={0}>
          {title}
        </Typography>
        {storybookHref !== undefined && (
          <Link
            href={storybookHref}
            target="_blank"
            variant="caption"
            underline="hover"
            fontFamily="mono"
            display="inline-flex"
            alignItems="center"
            gap={1}
          >
            STORYBOOK
            <ExternalLinkIcon width={12} height={12} />
          </Link>
        )}
      </Flex>
    </View>
  )
}
