import * as itowns from '../itowns/itowns'

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
  
/**/
  // FeatureGeometryLayer? 
  if (source instanceof itowns.FileSource) {
    config.transparent = true,
    config.style = {
      point: {
        color: f => f._style.point.color,
        radius: f => f._style.point.radius,
        line: f => f._style.point.line,
        width: f => f._style.point.width,
      },
      stroke: {
        color: f => f._style.stroke.color,
        width: f => f._style.stroke.width
      },
      fill: {
        color: f => f._style.fill.color,
        pattern: f => f._style.fill.pattern
      }
    }
  
//    return new itowns.FeatureGeometryLayer('LAYER_' + layer.id, config);
  }
/**/
  const itLayer = new itowns.ColorLayer('LAYER_' + (layer.id || ''), config)
  itLayer.info.title = layer.title
  itLayer.info.description = layer.description
  return itLayer
}

export default layerFormat