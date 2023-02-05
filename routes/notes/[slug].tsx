import { FunctionalComponent, VNode } from 'preact'
import { useMemo } from 'preact/hooks'
import { Handlers, PageProps } from '$fresh/server.ts'
import { Only } from '$civility/components/mod.ts'

import Page from '@/components/page.tsx'
import Playlist from '@/islands/playlist.tsx'
import { getNote, Note } from '@/utilities/notes.ts'
import markupToVdom, {
  ComponentsMap,
  createComponentMap,
} from '@/utilities/markup_to_vdom.ts'
import { isAuthorized } from '@/utilities/session.ts'

const components: ComponentsMap = createComponentMap({
  playlist: ({ ...props }) => (
    <div class='md-island' children={<Playlist src={props.src} />} />
  ),
})

interface Props {
  note: Note
  isAuthorized: boolean
}

export const handler: Handlers<Props> = {
  async GET(req, ctx) {
    if (/\.txt$/.test(ctx.params.slug)) {
      const note = await getNote(ctx.params.slug.split('.txt')[0])
      if (!note) return ctx.renderNotFound()
      return new Response(note.content.text, { status: 200 })
    } else if (/\.json$/.test(ctx.params.slug)) {
      const note = await getNote(ctx.params.slug.split('.json')[0])
      if (!note) return ctx.renderNotFound()
      return new Response(JSON.stringify(note), { status: 200 })
    }
    const note = await getNote(ctx.params.slug)
    if (!note) return ctx.renderNotFound()
    return ctx.render!({ note, isAuthorized: isAuthorized(req) })
  },
}

export default function NotePage(props: PageProps<Props>) {
  const { isAuthorized, note } = props.data

  const vdom = useMemo(() => {
    if (note.content.html == null) return null
    return markupToVdom(note.content.html, components) || null
  }, [note])

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
        <div class='markup'>{vdom}</div>
      </main>
    </Page>
  )
}