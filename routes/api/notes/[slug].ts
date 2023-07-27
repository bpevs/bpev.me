import { Handlers } from '$fresh/server.ts'
import { postNote } from '@/utilities/notes.ts'

export const handler: Handlers = {
  async POST(req) {
    await postNote(await req.json())
    return new Response(null, { status: 200 })
  },
}
