import * as itowns from 'itowns'

/** Create a new MVT source 
 * @param {Object} source
 * @param {Object} options
 * @returns {VectorTilesSource}
 */
function MVTFormat(source, options) {
  return new itowns.VectorTilesSource({
    style: source.url
  })
}

export default MVTFormat