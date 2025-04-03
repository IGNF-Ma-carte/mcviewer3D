import * as itowns from '../../itowns/itowns'

/** Create a new MVT source 
 * @param {Object} source
 * @param {Object} options
 * @returns {VectorTilesSource}
 */
function MVTFormat(source, options) {
  if (source.mbstyle) {
    return new itowns.VectorTilesSource({
      style: JSON.parse(source.mbstyle)
    })
  } else {
    return new itowns.VectorTilesSource({
      style: source.url
    })
  }
}

export default MVTFormat