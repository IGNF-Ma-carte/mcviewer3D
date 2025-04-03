import layerFormat from './layer'
import MVTFormat from './source/MVT'
import XYZFormat from './source/XYZ'
import WMSFormat from './source/WMS'
import WMTSFormat from './source/WMTS'
import geoportailFormat from './source/geoportail'
import vectorFormat from './source/vector'

import statFormat from 'mcutils/format/layer/Statistic'
import Statistic from 'mcutils/layer/Statistic'
import VectorStyle from 'mcutils/format/layer/VectorStyle'

/** Read a new carte 
 * @param {Object} globe
 * @param {Object} carte
 */
 function carteFormat(globe, carte) {
  globe.setCenter([carte.param.lon, carte.param.lat], carte.param.zoom)
  carte.layers.forEach(l => {
    switch(l.type) {
      case 'Statistique': {
        // Convert statistic to Vector
        let stat = (new statFormat).read(l)
        stat = stat.getVectorStyle();
        if (stat) {
          const opt = (new VectorStyle).write(stat, true)
          // console.log(opt)
          // opt.features = opt.features.slice(0,5000)
          const source = vectorFormat(opt)
          globe.addLayer(layerFormat(source, opt))
        }
        break;
      }
      case 'Vector': {
        const source = vectorFormat(l)
        globe.addLayer(layerFormat(source, l))
        break
      }
      case 'Geoportail': {
        globe.addLayer(layerFormat(geoportailFormat(l), l))
        break;
      }
      case 'MVT': {
        globe.addLayer(layerFormat(MVTFormat(l), l, { addLabelLayer: true }))
        break;
      }
      case 'WMS': {
        globe.addLayer(layerFormat(WMSFormat(l), l))
        break;
      }
      case 'WMTS': {
        globe.addLayer(layerFormat(WMTSFormat(l), l))
        break;
      }
      case 'XYZ': {
        globe.addLayer(layerFormat(XYZFormat(l), l, {
          /*
          updateStrategy: {
            type: itowns.STRATEGY_DICHOTOMY,
          },
          */
        }));
        break;
      }
      default: {
        console.log(l.type, 'non pris en compte...')
        break;
      }
    }
  })
}

 export default carteFormat