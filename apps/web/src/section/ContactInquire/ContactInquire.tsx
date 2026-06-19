import { useRef, type SyntheticEvent } from 'react'
import { View } from 'src/theme/View'
import { Flex } from 'src/theme/Flex'
import { Grid } from 'src/theme/Grid'
import { Typography } from 'src/theme/Typography'
import { TextInput } from 'src/theme/TextInput'
import { Button } from 'src/theme/Button'
import { Icon } from 'src/theme/Icon'
import { Form } from 'src/theme/Form'
import { Field } from 'src/theme/Field'
import { Checkbox } from 'src/theme/Checkbox'
import { Paper } from 'src/theme/Paper'
import { contact } from '@soroush.tech/schema'
import { fields, type ContactField } from './ContactInquire.data'
import { useContactInquire } from 'src/hooks/useContactInquire'
import { useContactSubmit } from 'src/hooks/useContactSubmit'
import { useTurnstile } from 'src/hooks/useTurnstile'

export function ContactInquire() {
  // Hidden honeypot field name — read from env so it stays out of the public repo. When unset
  // (e.g. local/dev), the honeypot isn't rendered; the Worker still enforces its own.
  const honeypotName = import.meta.env.VITE_CONTACT_HONEYPOT
  // Turnstile sitekey — read from env like the honeypot. When unset (local/dev) the widget
  // isn't rendered and submission proceeds tokenless; the Worker skips verification in turn.
  const turnstileSitekey = import.meta.env.VITE_TURNSTILE_SITEKEY ?? ''
  const submit = useContactSubmit()
  const honeypotRef = useRef<HTMLInputElement>(null)
  const {
    containerRef,
    token: turnstileToken,
    reset: resetTurnstile,
  } = useTurnstile(turnstileSitekey)

  const form = useContactInquire({
    onSubmit: async (values) => {
      // A filled honeypot means a bot — skip the request entirely.
      if (honeypotRef.current?.value) return
      try {
        await submit.mutateAsync({ ...values, turnstileToken })
      } catch {
        // Surfaced to the user via submit.isError below.
      }
    },
  })

  // When a captcha is configured, hold submission until the widget yields a token.
  const captchaPending = Boolean(turnstileSitekey) && !turnstileToken

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()
    void form.handleSubmit()
  }

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
            CONTACT INQUIRE
          </Typography>
          <Typography variant="overline" as="p" color="secondary">
            Awaiting payload transmission. Authorized communication only.
          </Typography>
        </View>

        {submit.isSuccess ? (
          <View role="status" py={6}>
            <Typography variant="h2" color="success" letterSpacing="tighter" gutterBottom>
              TRANSMISSION RECEIVED
            </Typography>
            <Typography variant="overline" as="p" color="secondary">
              Message secured. I’ll respond to your inquiry shortly.
            </Typography>
          </View>
        ) : (
          <Form onSubmit={handleSubmit} noValidate textColor="initial">
            <Grid gridTemplateColumns={['1fr', '1fr', '1fr 1fr']} gap={3}>
              {gridFields.map(renderField)}
            </Grid>

            <Flex mt={6} gap={3}>
              {fullFields.map(renderField)}
            </Flex>

            {honeypotName && (
              <View
                aria-hidden
                position="absolute"
                left="-9999px"
                width="1px"
                height="1px"
                overflow="hidden"
              >
                <input
                  ref={honeypotRef}
                  type="text"
                  name={honeypotName}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </View>
            )}

            {turnstileSitekey && (
              <View mt={6}>
                <div ref={containerRef} />
              </View>
            )}

            <form.Field name="consent">
              {(field) => (
                <View mt={4}>
                  <Checkbox
                    checked={field.state.value}
                    onChange={(event) => field.handleChange(event.target.checked)}
                    required
                  >
                    <Typography variant="caption" as="span" color="secondary">
                      {contact.consentText}
                    </Typography>
                  </Checkbox>
                </View>
              )}
            </form.Field>
            {submit.isError && (
              <Typography variant="overline" as="p" color="error" mt={4}>
                Transmission failed. Check your connection and retry.
              </Typography>
            )}
            <View mt={4}>
              <View>
                <form.Subscribe selector={(state) => [state.values, state.isSubmitting] as const}>
                  {([values, isSubmitting]) => (
                    <Button
                      type="submit"
                      variant="contained"
                      size="lg"
                      disabled={
                        !contact.schema.safeParse(values).success || isSubmitting || captchaPending
                      }
                      loading={isSubmitting}
                      loadingPosition="end"
                    >
                      {submit.isError ? 'Retry' : 'Send'}
                    </Button>
                  )}
                </form.Subscribe>
                {submit.isError && (
                  <Button
                    variant="contained"
                    size="lg"
                    color="default"
                    ml={2}
                    onClick={() => {
                      submit.reset()
                      resetTurnstile()
                    }}
                  >
                    Reset
                  </Button>
                )}
              </View>
            </View>
          </Form>
        )}
      </Paper>
    </View>
  )
}
