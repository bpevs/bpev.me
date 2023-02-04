import { Handlers, PageProps } from '$fresh/server.ts'
import { Only } from '$civility/components/mod.ts'

import Markup from '@/components/markup/index.ts'
import Page from '@/components/page.tsx'
import { getNote, Note } from '@/utilities/notes.ts'
import { isAuthorized } from '@/utilities/session.ts'

interface Props {
  note: Note
  isAuthorized: boolean
}

export const handler: Handlers<Props> = {
  async GET(req, ctx) {
    const note = await getNote(ctx.params.slug)
    if (!note) return ctx.renderNotFound()
    return ctx.render!({ note, isAuthorized: isAuthorized(req) })
  },
}

export default function NotePage(props: PageProps<Props>) {
  const { isAuthorized, note } = props.data
  return (
    <Page
      isAuthorized={isAuthorized}
      navItems={
        <Only if={isAuthorized}>
          <li>
            <a href={`${note.slug}/edit`}>Edit Note</a>
          </li>
        </Only>
      }
    >
      <main style={{ paddingTop: '20px', paddingBottom: '20px' }}>
        <Markup class='markdown-body' markup={note.content} type='html' />
      </main>
    </Page>
  )
}
