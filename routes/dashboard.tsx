import type { Handlers, PageProps } from '$fresh/server.ts'
import { Only } from '$civility/components/mod.ts'

import Login from '@/components/login.tsx'
import Page from '@/components/page.tsx'
import { isAuthorized } from '@/utilities/session.ts'

export const handler: Handlers<Data> = {
  GET(req, ctx) {
    return ctx.render!({ isAuthorized: isAuthorized(req) })
  },
}

interface Data {
  isAuthorized: boolean
}

export default function Home({ data }: PageProps<Data>) {
  return (
    <Page isAuthorized={data.isAuthorized}>
      <Only if={!data.isAuthorized}>
        <Login />
      </Only>
    </Page>
  )
}
