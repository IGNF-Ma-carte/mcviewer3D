import * as itowns from 'itowns'

/** Create a new TMS source XYZ
 * @param {Object} l
 * @param {Object} options
 */
function XYZFormat(l, options) {
  var extent
  if (l.extent) {
    extent = new itowns.Extent('EPSG:3857', l.extent[0], l.extent[2], l.extent[1], l.extent[3])
  } else {
    extent = new itowns.Extent('EPSG:3857', -20026376.39, 20026376.39, -20048966.10, 20048966.10);
  }
  return new itowns.TMSSource({
    isInverted: true,
    url: l.url.replace(/{([x|y|z])}/g, '${$1}'),
    networkOptions: { crossOrigin: 'anonymous' },
    extent,
    zoom: {
      min: l.sourceMinZoom || 0,
      max: l.sourceMaxZoom || 20
    },
    crs: 'EPSG:3857',
    attribution: {
      name: l.copyright,
      // url: 'http://www.openstreetmap.org/',
    },
  });
}

export default XYZFormat