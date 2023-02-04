import { Handlers } from '$fresh/server.ts'
import { Note, postNote } from '@/utilities/notes.ts'

export const handler: Handlers = {
  async POST(req, ctx) {
    await postNote(await req.json())
    return new Response(null, { status: 200 })
  },
}
