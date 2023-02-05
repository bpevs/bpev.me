import { ComponentConstructor, FunctionalComponent, VNode } from 'preact'
import { useMemo } from 'preact/hooks'
import { Handlers, PageProps } from '$fresh/server.ts'
import { Only } from '$civility/components/mod.ts'
import markupToVdom from '@/utilities/markdown/markup_to_vdom.ts'
import Page from '@/components/Page.tsx'
import Playlist from '@/islands/Playlist.tsx'
import { getNote, Note } from '@/utilities/notes.ts'
import { isAuthorized } from '@/utilities/session.ts'

const components = {
  playlist: ({ ...props }) => (
    <div>
      <Playlist {...props} />
    </div>
  ),
}
const componentsMap: {
  [name: string]: ComponentConstructor<any, any> | FunctionalComponent<any>
} = {}
for (const i in components) {
  if (components.hasOwnProperty(i)) {
    const name = i.replace(
      /([A-Z]+)([A-Z][a-z0-9])|([a-z0-9]+)([A-Z])/g,
      '$1$3-$2$4',
    ).toLowerCase()
    componentsMap[name] = components[i]
  }
}

interface Props {
  note: Note
  isAuthorized: boolean
}

export const handler: Handlers<Props> = {
  async GET(req, ctx) {
    if (/\.txt$/.test(ctx.params.slug)) {
      const note = await getNote(ctx.params.slug.split('.txt')[0])
      return new Response(note.content.text, { status: 200 })
    } else if (/\.json$/.test(ctx.params.slug)) {
      const note = await getNote(ctx.params.slug.split('.json')[0])
      return new Response(JSON.stringify(note), { status: 200 })
    }
    const note = await getNote(ctx.params.slug)
    if (!note) return ctx.renderNotFound()
    return ctx.render!({ note, isAuthorized: isAuthorized(req) })
  },
}

export default function NotePage(props: PageProps<Props>) {
  const { isAuthorized, note } = props.data
  const html = note.content.html
  const vdom = useMemo(() => markupToVdom(html, componentsMap), [html])
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
        <div {...props} class='markup'>{vdom || null}</div>
      </main>
    </Page>
  )
}
