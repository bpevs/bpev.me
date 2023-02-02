import type { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import Login from "@/components/login.tsx";
import Only from "@/components/Only.tsx";

export const handler: Handlers<Data> = {
  GET(req, ctx) {
    const isAllowed = getCookies(req.headers).auth === "bar";
    return ctx.render!({ isAllowed });
  },
};

interface Data {
  isAllowed: boolean;
}

export default function Home({ data }: PageProps<Data>) {
  if (!data.isAllowed) return <Login />;
  return (
    <body
      data-color-mode="auto"
      data-light-theme="light"
      data-dark-theme="dark"
    >
      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/note/new">New Note</a>
          </li>
          <li>
            <a href="/api/logout">Logout</a>
          </li>
        </ul>
      </nav>
    </body>
  );
}
