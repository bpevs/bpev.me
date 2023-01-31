import type { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import Login from "@/components/login.tsx";

export const handler: Handlers<Data> = {
  GET(req, ctx) {
    const cookies = getCookies(req.headers);
    return ctx.render!({ isAllowed: cookies.auth === "bar" });
  },
};

interface Data {
  isAllowed: boolean;
}

export default function Home({ data }: PageProps<Data>) {
  return (
    <div>
      {!data.isAllowed ? <Login /> : <a href="/api/logout">Logout</a>}
      {data.isAllowed ? "Here is some secret" : "You are not allowed here"}
    </div>
  );
}
