// Augments Vike's config with the custom `robots` setting (see src/renderer/+config.ts).
declare global {
  namespace Vike {
    interface Config {
      /** `<meta name="robots">` value, e.g. 'index,follow' (default) or 'noindex,nofollow'. */
      robots?: string
      /** Run `data()` in the browser on client-side navigation too, not just on the server. */
      dataIsomorph?: boolean
    }
  }
}

export {}
