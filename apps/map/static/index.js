navigator.geolocation.getCurrentPosition(showMap, (...args) => {
  console.log(...args)
})

class GeocodeControl {
  onAdd(map) {
    const template = document.createElement('template')
    template.innerHTML = `
      <div id="geocode-container">
        <input id="geocode-input" class="maplibregl-ctrl" type="text" placeholder="Enter an address or place e.g. 1 York St" size="50" />
        <button id="geocode-button" class="maplibregl-ctrl">Geocode</button>
      </div>
    `

    return template.content
  }
}

function showMap(position) {
  const { latitude, longitude } = position.coords

  var map = new maplibregl.Map({
    container: 'map',
    style: '/api/map-style',
    zoom: 12,
    center: [longitude, latitude],
    attributionControl: false,
  })

  map.on('load', function () {
    // Add an image to use as a custom marker
    map.loadImage(
      'https://maplibre.org/maplibre-gl-js-docs/assets/custom_marker.png',
      function (error, image) {
        if (error) throw error
        map.addImage('custom-marker', image)
        // Add a GeoJSON source with 3 points.
        map.addSource('points', {
          'type': 'geojson',
          'data': {
            'type': 'FeatureCollection',
            'features': [
              {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                  'type': 'Point',
                  'coordinates': [
                    -91.395263671875,
                    -0.9145729757782163,
                  ],
                },
              },
              {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                  'type': 'Point',
                  'coordinates': [
                    -90.32958984375,
                    -0.6344474832838974,
                  ],
                },
              },
              {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                  'type': 'Point',
                  'coordinates': [
                    -91.34033203125,
                    0.01647949196029245,
                  ],
                },
              },
            ],
          },
        })

        // Add a symbol layer
        map.addLayer({
          'id': 'symbols',
          'type': 'symbol',
          'source': 'points',
          'layout': {
            'icon-image': 'custom-marker',
          },
        })
      },
    )

    // Center the map on the coordinates of any clicked symbol from the 'symbols' layer.
    map.on('click', 'symbols', function (e) {
      map.flyTo({
        center: e.features[0].geometry.coordinates,
      })
    })

    // Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
    map.on('mouseenter', 'symbols', function () {
      map.getCanvas().style.cursor = 'pointer'
    })

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'symbols', function () {
      map.getCanvas().style.cursor = ''
    })
  })
  map.addControl(new maplibregl.GeolocateControl({ trackUserLocation: true }))
  map.addControl(new maplibregl.NavigationControl())
  const geocodeControl = new GeocodeControl()
  map.addControl(geocodeControl, 'top-left')

  document.getElementById('geocode-button').addEventListener('click', () => {
    const query = document.getElementById('geocode-input').value

    fetch(`/api/search/${query}`)
      .then((response) => response.json())
      .then((response) => {
        console.log(response.features.map((feature) => feature.place_name))
        const result = response.features[0]
        if (!result) {
          alert('That query didn\'t match any geocoding results.')
          return
        }
        console.log(result)
        new maplibregl
          .Popup()
          .setLngLat(result.center)
          .addTo(map)
        map.panTo(result.center)
      })
  })
}
