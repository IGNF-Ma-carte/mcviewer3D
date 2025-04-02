import * as itowns from '../../itowns/itowns'
import configGPP from '../../config/geoportail.js'

const limits = configGPP.source.tileMatrixSetLimits;

/** Create a new Geoportail source 
 * @param {Object} source
 * @param {Object} options
 * @returns {WMTSSource}
 */
function WMTSFormat(source, options) {
  const param = source.wmtsparam.source;
  // Options
  const config = {
    url: param.url.replace(/\?$/,''),
    name: param.layer,
    format: param.format || 'image/jpeg',
    style: param.style || 'normal',
    crs: 'EPSG:3857',
    tileMatrixSet: 'PM'
  }
  // Tilematix
  config.tileMatrixSetLimits = {}
  for (let z = source.minZoom || 0; z < (source.maxZoom || 20); z++) {
    if (limits[z]) {
      config.tileMatrixSetLimits[z] = limits[z]
    }
  }
  config.attribution = {
    name: param.attribution
  }

  return new itowns.WMTSSource(config);
}

export default WMTSFormat