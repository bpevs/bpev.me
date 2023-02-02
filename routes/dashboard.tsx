import type { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import Login from "@/components/login.tsx";
import Only from "@/components/only.tsx";
import Page from "@/components/page.tsx";

export const handler: Handlers<Data> = {
  GET(req, ctx) {
    const isAuthorized = getCookies(req.headers).auth === "bar";
    return ctx.render!({ isAuthorized });
  },
};

interface Data {
  isAuthorized: boolean;
}

export default function Home({ data }: PageProps<Data>) {
  return (
    <Page isAuthorized={data.isAuthorized}>
      <Only if={!data.isAuthorized}>
        <Login />
      </Only>
    </Page>
  );
}
