import layerFormat from './layer'
import MVTFormat from './source/MVT'
import XYZFormat from './source/XYZ'
import WMSFormat from './source/WMS'
import WMTSFormat from './source/WMTS'
import geoportailFormat from './source/geoportail'
import vectorFormat from './source/vector'

import * as itowns from '../itowns/itowns'

import statFormat from 'mcutils/format/layer/Statistic'
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
        // BDTopo 3D buildings
        if (l.url === "https://data.geopf.fr/annexes/ressources/vectorTiles/styles/BDTOPO/bati.json") {
          // Building data source
          const buildingsSource = new itowns.VectorTilesSource({
            //style: "https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/standard.json",
            style: l.url,
            // We only want to display buildings related data.
            filter: (layer) => {
              return layer['source-layer'].includes('batiment')
                  && layer.paint["fill-color"];
            },
          });
          // FeatureGeometryLayer to support building data.
          const buildingsLayer = new itowns.FeatureGeometryLayer('VTBuilding',{
            source: buildingsSource,
            zoom: { min: 15 },
            accurate: false,
            style: {
              fill: {
                //base_altitude: (p) => p.alti_sol || 0,
                base_altitude: (p) => { return (p.altitude_maximale_sol || p.altitude_minimale_sol || 0) * globe.getElevationScale() },
                extrusion_height: (p) => ((p.hauteur || 0) + 5) * globe.getElevationScale(),
              }
            },
          });
          // info
          buildingsLayer.info.title = l.title
          buildingsLayer.info.description = l.description
          // options
          buildingsLayer.visible = (l.visibility !== false);
          buildingsLayer.opacity = l.opacity
          
          // console.log(buildingsLayer)
          // Add the FeatureGeometryLayer to the scene
          globe.addLayer(buildingsLayer)
        } else {
          globe.addLayer(layerFormat(MVTFormat(l), l, { addLabelLayer: true }))
        }
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