import { VNode } from 'preact'
import { PageProps } from '$fresh/server.ts'
import { Only } from '$civility/components/mod.ts'

export default function Page(
  { children, isAuthorized = false, navItems = null }: {
    children?: VNode<unknown> | null
    isAuthorized?: boolean
    navItems?: VNode<unknown> | null
  },
) {
  return (
    <body
      data-color-mode='auto'
      data-light-theme='light'
      data-dark-theme='dark'
    >
      <nav>
        <ul>
          <li>
            <a href='/'>bpev.me</a>
          </li>
          <Only if={isAuthorized === true}>
            {navItems ? navItems : ''}
            <li>
              <a href='/note/new'>New Note</a>
            </li>
            <li>
              <a href='/api/logout'>Logout</a>
            </li>
          </Only>
        </ul>
      </nav>
      {children}
      <footer style={{ textAlign: 'center' }}>
        <p>
          Made with ☕️ by Ben. Read the{' '}
          <a href='https://github.com/bpevs/bpev.me'>code</a>.
        </p>
      </footer>
    </body>
  )
}
