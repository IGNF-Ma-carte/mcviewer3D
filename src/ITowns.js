import 'ol-ext/dist/ol-ext.css'

import * as itowns from 'itowns'

import configElevation from './config/elevation.js'
import ol_ext_element from 'ol-ext/util/element'
import Slider from 'ol-ext/util/input/Slider'

import loadFonts from 'mcutils/font/loadFonts.js'
import 'font-ign/font-ign.css'

loadFonts();

/** Create a globe view
 * @constructor
 * @param {Object} options
 *  @param {Array<number>} center
 * 
 */
class ITowns {
  constructor(options) {
    const placement = {
      coord: new itowns.Coordinates('EPSG:4326', options.center[0] || 0, options.center[1] || 0),
      range: 25000000,
    }
    let target = options.target
    if (!(target instanceof Element)) {
      target = document.getElementById(options.target)
    }
    // New itowns view
    this._view = new itowns.GlobeView(target, placement);

    // Add default elevation layers
    this._elevation = [];
    this.addElevation(configElevation.WORLD_SRTM3)
    this.addElevation(configElevation.IGN_HIGHRES)

    // Set widget
    this.setWidget();
    this.setLayerSwitcher()
  }
  /** Add Layer switcher
   * @private
   */
  setLayerSwitcher() {
    const ul = this.switcherElt = ol_ext_element.create('UL', {
      parent: ol_ext_element.create('DIV', {
        className: 'itowns-widget layerswitcher collapsed',
        html: ol_ext_element.create('BUTTON', {
          click: () => {
            ul.parentNode.classList.toggle('collapsed')
          }
        }),
        parent: document.body
      })
    })
    // Elevation
    const li = ol_ext_element.create('LI', {
      className: 'elevation',
      html: 'Elévation :',
      parent: ul
    })
    const elev = new Slider({
      min: 0,
      max: 5,
      step: .1,
      parent: li
    })
    setTimeout(() => {
      elev.setValue(this.getElevationScale())
    })
    elev.on('change:value', () => {
      this.setElevationScale(elev.getValue())
    })
  }
  /** Set map widget
   * @private
   */
  setWidget() {
    const speed = 500;
    const nav = ol_ext_element.create('DIV', {
      className: 'itowns-widget navigation',
      parent: document.body
    })
    ol_ext_element.create('DIV', {
      className: 'itowns-zoomin',
      click: () => {
        this.zoomTo(this.getZoom() + 1, speed)
      },
      parent: nav
    })
    ol_ext_element.create('DIV', {
      className: 'itowns-zoomout',
      click: () => {
        this.zoomTo(this.getZoom() - 1, speed)
      },
      parent: nav
    })
    const tilt = ol_ext_element.create('DIV', {
      className: 'itowns-tilt',
      click: () => {
        if (globe.getView().controls.getTilt() < 89) {
          this.getView().controls.lookAtCoordinate({ tilt: 90, time: speed }, true)
        } else {
          this.getView().controls.lookAtCoordinate({ tilt: 45, time: speed }, true)
        }
      },
      parent: nav
    })
    const arrow = ol_ext_element.create('DIV', {
      className: 'itowns-north',
      click: () => {
        this.getView().controls.lookAtCoordinate({ heading: 0, time: speed }, true)
      },
      parent: nav
    })
    this.getView().addEventListener(itowns.VIEW_EVENTS.CAMERA_MOVED, e => {
      arrow.style.transform = 'rotate(' + (-e.heading).toFixed(2) + 'deg)';
      if (e.tilt > 89) tilt.className = 'itowns-tilt tilt3D'
      else tilt.className = 'itowns-tilt tilt2D'
    })
    // new itowns_widgets.Navigation(this.getView()); 
  }
  /** Add elevation layers
   */
  addElevation(config) {
    config = Object.assign({}, config)
    config.source = new itowns.WMTSSource(config.source);
    const elev = new itowns.ElevationLayer(config.id, config)
    this._elevation.push(elev)
    return this.getView().addLayer(elev)
  }
  /** Change scale elevation
   * @param {number} sc
   */
  setElevationScale(sc) {
    this._elevation.forEach(elv => elv.scale = sc)
    this.getView().notifyChange()
  }
  /** Get scale elevation
   * @returns {number}
   */
  getElevationScale() {
    return this._elevation[0].scale
  }
  /** Set map center
   * @param {Array<number>} coord coordinates as lon, lat
   * @param {number} [zoom]
   * @param {Object} [options]
   *  @param {number} [options.tilt]
   *  @param {boolean} [options.anim=false]
   */
  setCenter(coord, zoom, options) {
    options = options || {}
    zoom = zoom || this.getView().controls.getZoom()
    const position = { longitude: coord[0], latitude: coord[1] };
    const coords = new itowns.Coordinates('EPSG:4326', position.longitude, position.latitude, position.altitude); // Geographic system
    this.getView().controls.lookAtCoordinate({ coord: coords, zoom: zoom, tilt: options.tilt }, options.anim !== false)
  }
  /** Get current center
   * @returns {Array<number>} [lon, lat]
   */
  getCenter() {
    const coords = this.getView().controls.getLookAtCoordinate()
    return [ coords.x, coords.y, coords.z]
  }
  /** Get current zoom
   * @returns {number}
   */
  getZoom() {
    return this.getView().controls.getZoom()
  }
  /** Set map zoom
   * @param {number} zoom
   * @param {Number|boolean} [anim=true] time for animation 
   */
  zoomTo(zoom, anim) {
    const time = parseInt(anim) || undefined;
    this.getView().controls.lookAtCoordinate({ zoom: zoom, time: time }, anim !== false)
  }
  /** Add a layer
   * @param {Layer} layer
   */
  addLayer(layer) {
    this.getView().addLayer(layer);
    if (layer.info.title) {
      const li = ol_ext_element.create('LI', {
        click: () => {
          layer.visible = !layer.visible;
          if (layer.visible) {
            icon.classList.remove('fi-unvisible')
          } else {
            icon.classList.add('fi-unvisible')
          }
          this.getView().notifyChange()
        }
      })
      this.switcherElt.prepend(li)
      const icon = ol_ext_element.create('I', {
        className: 'fi-visible' + (layer.visible ? '' : ' fi-unvisible'),
        parent: li
      })
      ol_ext_element.create('SPAN', {
        html: layer.info.title,
        parent: li
      })
    }
  }
  /** Remove a layer
   * @param {string} layerId
   */
  removeLayer(layerId) {
    this.getView().removeLayer(layerId);
  }
  /** Get the globe view
   * @returns {GlobeView}
   */
  getView() {
    return this._view
  }
}

export default ITowns