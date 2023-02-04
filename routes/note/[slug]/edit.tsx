import { Handlers, PageProps } from '$fresh/server.ts'
import { getNote, Note } from '@/utilities/notes.ts'

import Login from '@/components/Login.tsx'
import Editor from '@/islands/Editor.tsx'

export const handler: Handlers<{ note: Note }> = {
  async GET(_req, ctx) {
    const note = await getNote(ctx.params.slug)
    if (!note) return ctx.renderNotFound()
    return ctx.render({ note })
  },
}

export default function NewNote({ data }: PageProps<{ note: Note }>) {
  return (
    <body
      data-color-mode='auto'
      data-light-theme='light'
      data-dark-theme='dark'
    >
      <Editor note={data.note} />
    </body>
  )
}
