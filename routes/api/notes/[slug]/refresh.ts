import { Handlers } from '$fresh/server.ts'
import { deleteCachedNote } from '@/utilities/notes.ts'

export const handler: Handlers = {
  async GET(_req, ctx) {
    try {
      await deleteCachedNote(ctx.params.slug)
      return new Response('success', { status: 200 })
    } catch (e) {
      return new Response(e, { status: 500 })
    }
  },
}
