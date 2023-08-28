import * as itowns from 'itowns'

/** Create a new WMS
 * @param {Object} l
 * @param {Object} options
 */
function WMSFormat(l, options) {
  var extent
  if (l.extent) {
    extent = new itowns.Extent('EPSG:3857', l.extent[0], l.extent[2], l.extent[1], l.extent[3])
  } else {
    extent = new itowns.Extent('EPSG:3857', -20026376.39, 20026376.39, -20048966.10, 20048966.10);
  }
  const source = l.wmsparam.source;
  return new itowns.WMSSource({
    url: source.url,
    version: source.params.VERSION,
    name: source.params.LAYERS,
    format: source.params.FORMAT,
    style: '',
    crs: 'EPSG:3857',
    extent,
    transparent: true,
    attribution: {
      name: l.wmsparam.source.attribution || l.copyright,
      // url: 'http://www.openstreetmap.org/',
    },
  });
}

export default WMSFormat