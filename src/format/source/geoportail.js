import * as itowns from 'itowns'
import Geoportail from 'mcutils/layer/Geoportail'
import configGPP from '../../config/geoportail.js'

const limits = configGPP.source.tileMatrixSetLimits;

/** Create a new Geoportail source 
 * @param {Object} source
 * @param {Object} options
 * @returns {WMTSSource}
 */
function geoportailFormat(source, options) {
  // Get capabilities
  const cap = Geoportail.capabilities[source.layer]
  // Default config
  const config = Object.assign({}, configGPP.source)
  // Options
  config.url = cap.server.replace(/^(https?:\/\/[^/]*)(.*)$/, "$1/" + cap.key + "$2"),
  config.name = cap.layer,
  config.format = cap.format || 'image/jpeg',
  config.style = cap.style || 'normal',
  // Tilematix
  config.tileMatrixSetLimits = {}
  for (let z = cap.minZoom; z < (cap.maxZoom || 20); z++) {
    if (limits[z]) {
      config.tileMatrixSetLimits[z] = limits[z]
    }
  }
  config.attribution = {
    name: 'IGN - Géoservices',
    url: 'https://geoservices.ign.fr/',
  }
  return new itowns.WMTSSource(config);
}

export default geoportailFormat