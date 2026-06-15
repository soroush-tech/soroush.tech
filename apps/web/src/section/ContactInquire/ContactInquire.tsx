import { type SyntheticEvent } from 'react'
import { View } from 'src/theme/View'
import { Flex } from 'src/theme/Flex'
import { Grid } from 'src/theme/Grid'
import { Typography } from 'src/theme/Typography'
import { TextInput } from 'src/theme/TextInput'
import { Button } from 'src/theme/Button'
import { Icon } from 'src/theme/Icon'
import { Form } from 'src/theme/Form'
import { Field } from 'src/theme/Field'
import { fields, type ContactField, type ContactFormValues } from './ContactInquire.data'
import { useContactInquire } from './hooks/useContactInquire'
import { Paper } from 'src/theme/Paper'

export interface ContactInquireProps {
  /** Submission seam — wired to the backend endpoint separately. */
  onSubmit?: (values: ContactFormValues) => void | Promise<void>
}

export function ContactInquire({ onSubmit }: ContactInquireProps) {
  const form = useContactInquire({ onSubmit })

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()
    void form.handleSubmit()
  }

  // Field owns the label / error wiring; FormControl context links id / htmlFor /
  // aria-describedby. labelProps preserves the terminal-style label look.
  const renderField = (field: ContactField) => (
    <Field
      key={field.name}
      form={form}
      name={field.name}
      required={field.required}
      fullWidth
      label={field.label}
      labelProps={{
        variant: 'caption',
        color: 'primary',
        textTransform: 'uppercase',
        letterSpacing: 'widest',
      }}
    >
      <TextInput
        type={field.type}
        variant="underline"
        autoComplete={field.autoComplete}
        placeholder={field.placeholder}
        resize={field.multiline}
        rows={field.multiline ? 4 : undefined}
      />
    </Field>
  )

  const gridFields = fields.filter((field) => !field.fullwidth)
  const fullFields = fields.filter((field) => field.fullwidth)

  return (
    <View as="section" py={6} px={4}>
      <Paper
        maxWidth="1280px"
        mx="auto"
        id="contact"
        position="relative"
        overflow="hidden"
        p={[6, 8, 10]}
      >
        <View aria-hidden position="absolute" top={0} right={0} p={4} opacity={0.2}>
          <Icon name="lock" color="primary" size="3.5rem" />
        </View>

        <View mb={8} maxWidth="36rem">
          <Typography variant="h2" color="primary" letterSpacing="tighter" gutterBottom>
            SECURE INQUIRE
          </Typography>
          <Typography variant="overline" as="p" color="secondary">
            Awaiting payload transmission. Authorized communication only.
          </Typography>
        </View>

        <Form onSubmit={handleSubmit} noValidate textColor="initial">
          <Grid gridTemplateColumns={['1fr', '1fr', '1fr 1fr']} gap={3}>
            {gridFields.map(renderField)}
          </Grid>

          <Flex mt={6} gap={3}>
            {fullFields.map(renderField)}
          </Flex>
          <Typography variant="caption" as="p" color="secondary" mt={2}>
            By submitting this form, your information will only be used to respond to your inquiry
            and will not be shared with third parties.
          </Typography>
          <View mt={4}>
            <View>
              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
                {([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    variant="contained"
                    size="lg"
                    disabled={!canSubmit}
                    loading={isSubmitting}
                    loadingPosition="end"
                    endIcon={<Icon name="arrow_forward" color="inherit" size="1rem" />}
                  >
                    EXECUTE TRANSMISSION
                  </Button>
                )}
              </form.Subscribe>
            </View>
          </View>
        </Form>
      </Paper>
    </View>
  )
}
