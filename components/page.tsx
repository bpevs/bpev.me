import { PageProps } from "$fresh/server.ts";
import Only from "@/components/only.tsx";

export default function Page(
  { children, isAuthorized = false, navItems = null }: {
    children?: any;
    isAuthorized?: boolean;
    navItems?: any;
  },
) {
  return (
    <body
      data-color-mode="auto"
      data-light-theme="light"
      data-dark-theme="dark"
    >
      <Only if={isAuthorized === true}>
        <nav>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            {navItems ? navItems : ""}
            <li>
              <a href="/note/new">New Note</a>
            </li>
            <li>
              <a href="/api/logout">Logout</a>
            </li>
          </ul>
        </nav>
      </Only>
      {children}
    </body>
  );
}
