import * as itowns from 'itowns'

/** Create a new iTowns layer
 * @param {Object} source
 * @param {Object} options
 */
function layerFormat(source, layer, options) {
  layer = layer || { visibility: true }
  options = options || {}
  const config = {
    visible: layer.visibility !== false,
    opacity: layer.opacity,
    source: source,
  }
  Object.keys(options) .forEach(k => config[k] = options[k])
  if (layer.extent) {
    config.extent = new itowns.Extent('EPSG:3857', layer.extent[0], layer.extent[2], layer.extent[1], layer.extent[3])
  }
  
/** /
  // FeatureGeometryLayer? 
  if (source instanceof itowns.FileSource) {
    config.transparent = true,
    config.style = new itowns.Style({
      fill: {
        color: 'rgba(0,0,255,.5)',
        extrusion_height: 200,
      }
    })
  
    return new itowns.FeatureGeometryLayer('LAYER_' + layer.id, config);
  }
/**/
  const itLayer = new itowns.ColorLayer('LAYER_' + (layer.id || ''), config)
  itLayer.info.title = layer.title
  itLayer.info.description = layer.description
  return itLayer
}

export default layerFormat