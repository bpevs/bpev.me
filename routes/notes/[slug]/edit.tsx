import { Handlers, PageProps } from '$fresh/server.ts'
import { getNote, Note } from '@/utilities/notes.ts'

import Page from '@/components/page.tsx'
import Editor from '@/islands/editor.tsx'

export const handler: Handlers<{ note: Note }> = {
  async GET(_req, ctx) {
    const note = await getNote(ctx.params.slug)
    if (!note) return ctx.renderNotFound()
    return ctx.render({ note })
  },
}

export default function NewNote({ data }: PageProps<{ note: Note }>) {
  return (
    <Page>
      <Editor note={data.note} />
    </Page>
  )
}
