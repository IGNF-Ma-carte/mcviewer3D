import api from 'mcutils/api/api'
import ITowns from './ITowns.js'
import carteFormat from './format/carte.js'
import layerFormat from './format/layer'
import geoportailFormat from './format/source/geoportail'

import './index.css'

const globe = new ITowns({
  target: 'viewerDiv',
  center: [2.351323, 48.856712],
  zooom: 10
})
// Exagerate
globe.setElevationScale(1)

// Default background (while loading)
globe.addLayer(layerFormat(geoportailFormat({ layer: 'ORTHOIMAGERY.ORTHOPHOTOS' })))

// Get carte
const search = {}
location.search.replace(/^\?/, '').split('&').forEach(c => { const t = c.split('='); search[t[0]] = t[1] })
if (search.map) {
  api.getMapFile(search.map, carte => {
    if (carte.param && carte.layers) {
      globe.removeLayer('LAYER_')
      carteFormat(globe, carte)
    }
  })
}

/** /
var marne = new itowns.FeatureGeometryLayer('Marne', {
  // Use a FileSource to load a single file once
  source: new itowns.FileSource({
      url: 'https://raw.githubusercontent.com/iTowns/iTowns2-sample-data/master/multipolygon.geojson',
      crs: 'EPSG:4326',
      format: 'application/json',
  }),
  transparent: true,
  opacity: 0.7,
  zoom: { min: 10 },
  style: new itowns.Style({
    fill: {
      color: 'rgba(0,0,255,.5)',
      extrusion_height: 200,
    }
  })
});
globe.addLayer(marne);
/**/

/* DEBUG * /
window.globe = globe
*/