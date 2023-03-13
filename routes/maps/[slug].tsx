import Page from '@/components/page.tsx'
import GeoMap from '@/islands/geomap.tsx'

export default function GeomapRoute() {
  return (
    <Page hideFooter>
      <GeoMap />
    </Page>
  )
}
