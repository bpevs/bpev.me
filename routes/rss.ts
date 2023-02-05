import { Handlers } from '$fresh/server.ts'
import { getNotes } from '@/utilities/notes.ts'
import notesToRSS from '@/utilities/notes_to_rss.ts'

export const handler: Handlers = {
  async GET() {
    const notes = await getNotes()
    return new Response(notesToRSS(notes), {
      status: 200,
      headers: new Headers({
        'Content-Type': 'application/rss+xml; charset=utf-8',
      }),
    })
  },
}
