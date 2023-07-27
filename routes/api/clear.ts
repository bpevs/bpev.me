import { Handlers } from '$fresh/server.ts'
import store from '@/utilities/store.ts'

export const handler: Handlers = {
  async GET() {
    try {
      const notesIter = store.list<string>({ prefix: ['notes'] })
      const items = []

      for await (const res of notesIter) items.push(res)

      const sessIter = store.list<string>({ prefix: ['sessions'] })
      for await (const res of sessIter) items.push(res)

      await Promise.all(items.map(({ key }) => {
        console.log('Delete Cache', key)
        return store.delete(key)
      }))
      return new Response('success', { status: 200 })
    } catch (e) {
      return new Response(e, { status: 500 })
    }
  },
}
