import { useCallback, useEffect, useRef } from 'preact/hooks'
import { useSignal } from '@preact/signals'
import { IS_BROWSER } from '$fresh/runtime.ts'
import { parse } from '$std/encoding/yaml.ts'
import { Only } from '$civility/components/mod.ts'

const markers = {}

export default function () {
  const geomap = useRef(null)
  const hovered = useSignal('')
  const selected = useSignal(null)
  const mode = useSignal('MAP')
  const recs = useSignal(null)

  const onClick = useCallback((event) => {
    const next = event?.layer?.properties
    if (next?.name && selected.value?.name != next?.name) {
      selected.value = event.layer.properties
      const coords = next.location.coords
      geomap.current.panTo(new L.LatLng(coords[0], coords[1]), 14)
    }
  }, [selected.value])
  const onClose = useCallback(() => {
    selected.value = null
  }, [selected.value])
  const copyText = useCallback((event) => {
    navigator.clipboard.writeText(event.target.innerText)
  })
  useEffect(() => {
    fetch('https://static.bpev.me/recs/sf.yaml').then(async (resp) =>
      recs.value = parse(await resp.text())
    )
  }, [])

  useEffect(() => {
    if (IS_BROWSER && recs.value && mode.value === 'MAP') {
      Promise.all([
        import('https://esm.sh/leaflet'),
        import('https://esm.sh/protomaps'),
      ]).then(([L, protomaps]) => {
        const { coffee, drink, food, other } = recs.value

        const southWest = L.latLng(37.64305348359734, -122.18857235064957)
        const northEast = L.latLng(37.88840230008824, -122.55896347350851)

        geomap.current = L.map('geomap', {
          maxBounds: L.latLngBounds(southWest, northEast),
          minZoom: 12,
        })

        const markersLayer = L.featureGroup().addTo(geomap.current)
        drawMarkers(markersLayer, L, coffee, '☕️')
        drawMarkers(markersLayer, L, food, '🍖')
        drawMarkers(markersLayer, L, drink, '🍻')
        drawMarkers(markersLayer, L, other, '👓')
        markersLayer.on('click', onClick)
        markersLayer.on('popupclose', onClose)
        markersLayer.on('mouseover', function (event) {
          hovered.value = event.layer.properties.name
        })
        markersLayer.on('mouseout', function (event) {
          hovered.value = ''
        })

        if (selected.value) {
          const coords = selected.value.location.coords
          geomap.current.setView(new L.LatLng(coords[0], coords[1]), 14)
          const marker = markers[coords.join(',')]
          if (marker) marker.openPopup()
        } else {
          geomap.current.setView(new L.LatLng(37.774, -122.419), 13)
        }

        protomaps
          .leafletLayer({ url: 'https://static.bpev.me/tiles/sf.pmtiles' })
          .addTo(geomap.current)
      })
    }
  }, [mode.value, recs.value])
  return (
    <div
      style={{
        width: '100%',
        height: '90%',
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
      }}
    >
      <div>
        <button onClick={() => mode.value = 'MAP'}>Map</button>
        <button onClick={() => mode.value = 'LIST'}>List</button>
      </div>
      <Only if={mode.value === 'MAP'}>
        <Only if={Boolean(hovered.value)}>
          <div
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              zIndex: 1,
              background: 'var(--color-canvas-default)',
            }}
          >
            {hovered.value}
          </div>
        </Only>
        <div
          id='geomap'
          style={{
            width: '100%',
            height: '100%',
            overflow: 'scroll',
            border: '1px solid white',
            margin: 'auto',
            zIndex: 0,
          }}
        >
        </div>
        <Only if={Boolean(selected.value)}>
          <div style={{ padding: '10px' }}>
            <h1 class='hover-copy' onClick={copyText}>
              {selected.value?.name}
            </h1>
            <p>
              <span class='hover-copy' onClick={copyText}>
                {selected.value?.location?.address}
              </span>{'  '}
              <u class='hover-copy' onClick={copyText}>
                ({selected.value?.location?.coords.join(', ')})
              </u>
            </p>
            <p>{selected.value?.about}</p>
            <p>{selected.value?.location?.about}</p>
          </div>
        </Only>
      </Only>
      <Only if={mode.value === 'LIST'}>
        <ul>
          {recs.value?.coffee
            .concat(recs.value?.food)
            .concat(recs.value?.drink)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((rec) => (
              <h2
                style={{ cursor: 'pointer' }}
                onClick={(evt) => {
                  const loc = rec.locations[0]
                  selected.value = { ...rec, location: loc }
                  mode.value = 'MAP'
                }}
              >
                {(rec.tags || []).includes('recommended') ? '⭐️' : ''}
                {rec.name}
              </h2>
            ))}
        </ul>
      </Only>
    </div>
  )
}

function drawMarkers(geomap, L, list = [], emoji) {
  list.forEach(({ locations = [], ...details }) => {
    locations.forEach((geolocation) => {
      if (geolocation?.coords?.length) {
        const tags = []
        const icon = L.divIcon({
          className: 'marker',
          html: (details.tags || []).includes('recommended') ? '⭐️' : emoji,
          size: [20, 20],
        })
        const marker = L.marker(geolocation.coords, { icon })
        marker.properties = { ...marker.properties, ...details }
        marker.properties.location = geolocation
        marker.bindPopup(details.name)
        marker.addTo(geomap)
        markers[geolocation.coords.join(',')] = marker
      }
    })
  })
}
