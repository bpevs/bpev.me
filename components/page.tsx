import { PageProps } from '$fresh/server.ts'
import { Only } from '$civility/components/mod.ts'

export default function Page(
  { children, isAuthorized = false, navItems = null }: {
    children?: any
    isAuthorized?: boolean
    navItems?: any
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
            <a href='/'>Home</a>
          </li>
          <Only if={isAuthorized === true}>
            {navItems ? navItems : ''}
            <li>
              <a href='/note/new'>bpev.me</a>
            </li>
            <li>
              <a href='/api/logout'>Logout</a>
            </li>
          </Only>
        </ul>
      </nav>
      {children}
    </body>
  )
}
