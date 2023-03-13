import { Handlers, PageProps } from '$fresh/server.ts'
import Page from '@/components/page.tsx'
import GeoMap from '@/islands/geomap.tsx'

interface Props {
  tilesURL: string
  recsURL: string
  center: [number, number]
  bounds: {
    N: number
    E: number
    S: number
    W: number
  }
}

export const handler: Handlers<Props> = {
  async GET(_req, ctx) {
    const mapsData = await (await fetch('https://static.bpev.me/maps.json'))
      .json()
    const mapData = mapsData[ctx.params.slug]
    if (!mapData) return ctx.renderNotFound()
    return ctx.render(mapData)
  },
}

export default function GeomapRoute(props: Props) {
  return (
    <Page hideFooter>
      <GeoMap {...props.data} />
    </Page>
  )
}
