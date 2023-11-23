import * as itowns from 'itowns'
import { defaultIgnStyle } from 'mcutils/style/ignStyle'
import GeoJSONXFormat from 'GeoJSONX/geojsonx'

import SymbolLib from 'mcutils/style/SymbolLib';

function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL("image/png");
  return dataURL;
}

function getPointIcon(ignStyle) {
  if (!ignStyle.pointGlyph) {
    return;
  }
  const symb = new SymbolLib({ style: ignStyle, type: 'Point'})
  return symb.getImage();
}

import FillPattern from 'ol-ext/style/FillPattern'
import Fill from 'ol/style/Fill'
function getPatternImage(ignStyle) {
  if (!ignStyle.fillPattern) {
    return;
  }
  const style = new FillPattern({
    pattern: ignStyle.fillPattern,
    color: ignStyle.fillColor,
    fill: new Fill({
      color: ignStyle.fillColorPattern
    }),
    size: ignStyle.sizePattern,
    spacing: ignStyle.spacingPattern,
    offset: ignStyle.offsetPattern,
    angle: ignStyle.anglePattern
  });
  return style.getImage();
};

/** Create a new WMS
 * @param {Object} l
 * @param {Object} options
 */
function vectorFormat(l, options) {
  console.log(l)
  const geojson = {
    type: 'FeatureCollection',
    features: []
  };

  if (l.data) {
    const format = new GeoJSONXFormat()
    const features = geojson.features = format.toGeoJSON(l.data).features;
    l.data.style.forEach((s, i) => {
      const style = {}
      Object.keys(s).forEach(k => style[shortStyle[k]] = s[k])
      features[i].style = style
    })
    l.data.popupContent.forEach((s, i) => features[i].popupContent = s)
    l.features = features
  } else {
    l.features.forEach(f => {
      geojson.features.push({
        type: 'Feature',
        properties: f.attributes,
        geometry: {
          type: f.type,
          coordinates: f.coords
        },
      })
    })
  }

  const result = new itowns.FileSource({
    crs: 'EPSG:3857',
    fetchedData: geojson,
    parser: itowns.GeoJsonParser.parse
  });

  setTimeout(() => {
    // Style features
    l.features.forEach((f, i) => {
      const ignStyle = {};
      // Get IGN style
      Object.keys(defaultIgnStyle).forEach(k => {
        ignStyle[k] = f.style[k] || l.style[k] || defaultIgnStyle[k]
      })
      // iTowns style
      const style = {
        fill: {
          color: ignStyle.fillColor,
        },
        stroke: {
          color: ignStyle.strokeColor,
          width: ignStyle.strokeWidth
        }
      }
      if (ignStyle.fillPattern) {
        const patternImage = getPatternImage(ignStyle);
        style.fill.pattern = patternImage;
        style.fill.color = 'transparent'
      }
      if (ignStyle.pointRadius) {
        style.point = {
          color: ignStyle.symbolColor,
          radius: ignStyle.pointRadius,
          line: ignStyle.pointStrokeColor,
          width: ignStyle.pointStrokeWidth,
        }
      }
      // Set style
      geojson.features[i].properties.style = new itowns.Style(style);
    })
  })
  return result
}

export default vectorFormat
