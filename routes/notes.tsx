import { Handlers, PageProps } from '$fresh/server.ts'
import { isAuthorized } from '@/utilities/session.ts'
import { getNotes, Note } from '@/utilities/notes.ts'
import Page from '@/components/page.tsx'

interface Props {
  isAuthorized: boolean
  notes: Note[]
}

export const handler: Handlers<Props> = {
  async GET(req, ctx) {
    const notes = await getNotes()
    return ctx.render!({ isAuthorized: await isAuthorized(req), notes })
  },
}

export default function NotesIndexPage(props: PageProps<Props>) {
  const { notes, isAuthorized } = props.data
  return (
    <Page isAuthorized={isAuthorized}>
      <main>
        <p class='intro'>
          Hi I'm Ben! 👋 Welcome to my blog! <br /> Also feel free to check{' '}
          <a href='/projects'>stuff I've made</a>
        </p>
        <ul class='notes-list'>
          {notes
            .filter((note: Note) => {
              return Boolean(note.published != 'Invalid Date')
            })
            .map((note: Note) => <NoteCard note={note} />)}
        </ul>
      </main>
    </Page>
  )
}

function NoteCard({ note }: { note: Note }) {
  return (
    <li>
      <a href={`/notes/${note.slug}`}>
        <strong>{note.title} –</strong>
        <time style={{ opacity: 0.8, fontSize: '0.8em' }}>
          {new Date(note.published || '').toLocaleDateString('en-us', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </a>
    </li>
  )
}
