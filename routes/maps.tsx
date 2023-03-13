import { Handlers, PageProps } from '$fresh/server.ts'
import { asset } from '$fresh/runtime.ts'
import Page from '@/components/page.tsx'
import GeoMap from '@/islands/geomap.tsx'

export const handler: Handlers<{ names: string[] }> = {
  async GET(req, ctx) {
    const mapsData = await (await fetch('https://static.bpev.me/maps.json'))
      .json()
    if (!mapsData) return ctx.renderNotFound()
    console.log(Object.keys(mapsData))
    return ctx.render({ names: Object.keys(mapsData) })
  },
}

export default function GeomapRoute({ data }) {
  return (
    <Page hideFooter>
      <ul>
        {(data.names).map((name) => (
          <li>
            <a href={`/maps/${name}`}>{name}</a>
          </li>
        ))}
      </ul>
    </Page>
  )
}
