// `.sql` files are imported as their raw text: bundled by wrangler via its default `Text` module
// rule (which covers *.sql), and by vitest via a loader plugin (vitest.config.ts).
declare module '*.sql' {
  const content: string
  export default content
}
