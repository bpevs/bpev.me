import { useCallback, useEffect, useRef } from 'preact/hooks'
import { IS_BROWSER } from '$fresh/runtime.ts'
import { parse } from '$std/encoding/yaml.ts'

export default function () {
  const geomap = useRef(null)

  useEffect(() => {
    if (IS_BROWSER) {
      Promise.all([
        import('https://esm.sh/leaflet'),
        import('https://esm.sh/protomaps'),
        fetch('https://static.bpev.me/recs/sf.yaml').then((resp) =>
          resp.text()
        ),
      ]).then(([L, protomaps, sfRecsYaml]) => {
        const { coffee, drink, food, other } = parse(sfRecsYaml)

        const southWest = L.latLng(37.64305348359734, -122.18857235064957)
        const northEast = L.latLng(37.88840230008824, -122.55896347350851)

        geomap.current = L.map('geomap', {
          maxBounds: L.latLngBounds(southWest, northEast),
          minZoom: 12,
        })

        geomap.current.setView(new L.LatLng(37.774, -122.419), 13)
        drawMarkers(geomap.current, L, coffee, '☕️')
        drawMarkers(geomap.current, L, food, '🍖')
        drawMarkers(geomap.current, L, drink, '🍻')

        protomaps
          .leafletLayer({ url: 'https://static.bpev.me/tiles/sf.pmtiles' })
          .addTo(geomap.current)
      })
    }
  }, [])
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'absolute',
      }}
    >
      <div
        id='geomap'
        style={{
          width: '100%',
          height: '100%',
          overflow: 'scroll',
          border: '1px solid white',
          margin: 'auto',
        }}
      >
      </div>
    </div>
  )
}

function drawMarkers(geomap, L, list = [], icon) {
  list.forEach(({ name, tags, locations = [], about }) => {
    locations.forEach(({ name: locationName, coords = [], address, about }) => {
      if (coords.length) {
        L.marker(coords, {
          icon: L.divIcon({
            className: 'marker',
            html: icon,
            size: [20, 20],
          }),
        }).addTo(geomap)
          .bindPopup(`
            <strong>
              ${name}
              ${locationName ? '– ' + locationName : ''}
            </strong>
            <br>
            ${address}
            <br>
            ${about ? about : ''}
        `)
      }
    })
  })
}
