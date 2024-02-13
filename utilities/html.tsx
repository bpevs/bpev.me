/** @jsx jsx **/
import { jsx } from 'hono/middleware.ts'
import { html } from 'hono/helper.ts'

export default function Html({ children, hideFooter = false }: {
  // deno-lint-ignore no-explicit-any
  children?: any
  hideFooter?: boolean
}) {
  return (html`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <link rel="stylesheet" href="/static/index.css" />
    </head>
    <body
      data-color-mode='auto'
      data-light-theme='light'
      data-dark-theme='dark'
    >
      <nav><ul><li><a href='/'>bpev.me</a></li></ul></nav>
      ${children}
      ${
    hideFooter ? '' : (
      <footer style={{ textAlign: 'center' }}>
        <p>
          Made with ☕️ by Ben. Read the{' '}
          <a href='https://github.com/bpevs/bpev.me'>code</a>.
        </p>
      </footer>
    )
  }
    </body>
    </html>
  `)
}
