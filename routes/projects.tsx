import { createContext } from 'preact'
import { useContext, useMemo } from 'preact/hooks'
import { Handlers, PageProps } from '$fresh/server.ts'
import { markdownToPlaintext } from 'parsedown'

import Page from '@/components/page.tsx'
import Photo from '@/islands/photo.tsx'
import { Note, parseNote } from '@/utilities/notes.ts'
import markupToVdom, {
  ComponentsMap,
  createComponentMap,
} from '@/utilities/markup_to_vdom.ts'

const NoteContext = createContext<Note | null>(null)

const components: ComponentsMap = createComponentMap({
  photo: ({ ...props }) => (
    <div
      class='md-island'
      children={<Photo {...props} note={useContext(NoteContext)} />}
    />
  ),
})

interface Props {
  note: Note
}

export const handler: Handlers<Props> = {
  async GET(req, ctx) {
    const response = await fetch('https://static.bpev.me/pages/projects.md')
    const note = await parseNote('pages/projects/', await response.text())
    if (!note) return ctx.renderNotFound()
    if (/\.txt$/.test(ctx.params.slug)) {
      const txt = await markdownToPlaintext(note.content.commonmark)
      return new Response(txt, { status: 200 })
    } else if (/\.json$/.test(ctx.params.slug)) {
      return new Response(JSON.stringify(note), { status: 200 })
    } else if (/\.md$/.test(ctx.params.slug)) {
      return new Response(note.content.commonmark, { status: 200 })
    } else {
      return ctx.render!({ note })
    }
  },
}

export default function NotePage(props: PageProps<Props>) {
  const { note } = props.data

  const vdom = useMemo(() => {
    if (note.content.html == null) return null
    else return markupToVdom(note.content.html, components) || null
  }, [note])

  return (
    <Page>
      <NoteContext.Provider value={note}>
        <main style={{ paddingTop: '20px', paddingBottom: '20px' }}>
          <div class='markup'>{vdom}</div>
        </main>
      </NoteContext.Provider>
    </Page>
  )
}
