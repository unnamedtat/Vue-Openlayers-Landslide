// 导入ol开发资源
import Map from 'ol/Map'
import View from 'ol/View'
import OSM from 'ol/source/OSM'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import TileArcGISRest from 'ol/source/TileArcGISRest'
// import { transform } from 'ol/proj'
import { Cluster as ClusterSource, Vector as VectorSource, XYZ } from 'ol/source'
import { FullScreen, Zoom } from 'ol/control'
import Select from 'ol/interaction/Select.js'
import { pointerMove, singleClick } from 'ol/events/condition.js'
import {
  clusterStyle, heightLightStyle,
  selectClusterStyle
} from '@/utils/MapUtils'
import Overlay from 'ol/Overlay'
// import { toStringHDMS } from 'ol/coordinate.js'
// import { toLonLat } from 'ol/proj.js'
import { WindLayer } from 'ol-wind'
// import proj4 from 'proj4'

// proj4.defs('EPSG:10000', '+proj=aea +lat_1=25 +lat_2=47 +lat_0=0 +lon_0=110 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs')
// const projection = proj.get('EPSG:3395')
// projection.setExtent([8374565.292377971, 1866182.1613285837, 1.4947981223720774E7, 7070412.849097984])
/**
 * 仅提供一个ol.View实例-保持多个View视图同步
 */
const viewDefault = new View({
  projection: 'EPSG:4326', // 使用这个坐标系
  // projection: projection, // 使用这个坐标系
  // center: transform(_center, 'EPSG:4326', 'EPSG:3857'), //深圳
  minZoom: 5,
  maxZoom: 30,
  enableRotation: false
})
export default class MapClass {
  /**
   * 构造器
   * @param {*} _targetId
   // * @param {*} _center
   * @param {*} _projection
   * @param {*} _zoom
   */
  constructor(
    _targetId = 'map',
    // _center = [121.4, 31.230416],
    _projection = 'EPSG:10000',
    _zoom = 5
  ) {
    this.views = [] // 视图容器
    this.layers = [] // 图层容器
    this.overlays = [] // overlay容器
    this.popup = undefined // 弹出窗实例
    this.controls = []

    if (_targetId === 'map') {
      // const source = new OSM()
      // const overviewMapControl = new OverviewMap({
      //   layers: [
      //     new TileLayer({
      //       source: source
      //     })
      //   ],
      //   collapsed: false,
      //   projection: 'EPSG:4326',
      //   className: 'ol-overviewmap ol-custom-overviewmap'
      // })
      this.controls.push(new Zoom({ className: 'my-zoom' }))
      this.controls.push(new FullScreen({ className: 'my-full-screen' }))
      // this.controls.push(layerSwitcher)
    }
    // 配置View属性，可以动态算出
    // viewDefault.setCenter(_center)
    this.views.push(viewDefault)
    // 地图实例
    this.map = new Map({
      view: viewDefault,
      layers: [],
      target: _targetId,
      controls: this.controls
    })
  }
  /**
   * 获取当前MapClass工具的ol.map对象
   * @returns ol.map对象
   */
  getOlMap() {
    return this.map
  }

  addLayerSwitcher(_layerSwitcher) {
    // 创建一个div元素

    // // layerSwitcher.id = 'layerSwitcher'
    // _layerSwitcher.style.position = 'absolute'
    // _layerSwitcher.style.top = '10px'
    // _layerSwitcher.style.right = '10px'
    // _layerSwitcher.style.width = '300px'
    // _layerSwitcher.style.height = '300px'
    // _layerSwitcher.style.backgroundColor = 'white'
    // _layerSwitcher.style.zIndex = '999'

    // 在div元素中添加input元素
    // const layers = this.map.getLayers().getArray()
    const layers = this.layers
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i]
      const layerId = layer.getProperties().layerName
      const input = document.createElement('input')
      input.type = 'checkbox'
      input.id = layerId
      input.checked = layer.getVisible()
      input.addEventListener('change', (e) => {
        // 切换图层的可见性
        const layerName = e.target.id
        const layer = this.getLayerByName(layerName)
        if (layer) { // 判断layer是否存在
          layer.setVisible(e.target.checked)
        }
      })
      const label = document.createElement('label')
      label.htmlFor = layerId
      label.textContent = layerId
      _layerSwitcher.appendChild(input)
      _layerSwitcher.appendChild(label)
    }
  }
  /**
   * 获取View视图对象
   * @returns ol.View实例
   */
  getDefaultMapView() {
    return viewDefault
  }
  // 添加瓦片图层
  addArcGISTileLayer(
    _url,
    _zIndex,
    _properties = { layerName: undefined, desc: undefined }
  ) {
    const tileLayer = new TileLayer({
      properties: _properties,
      zIndex: _zIndex || 0,
      visible: true,
      source: new TileArcGISRest({
        url: _url
      })
    })
    this.layers.push(tileLayer)
    this.map.addLayer(tileLayer)
    return tileLayer
  }

  /**
   * 添加Open Street Map底图
   * 经度范围为:73°33′E-135°05′E,纬度范围为:3°51′N-53°33′N。
   * @param {*} _zinde
   * @param {*} _extent 限定图层显示边界
   * @param {*} _minZoom
   * @param {*} _maxZoom
   * @param {*} _properties
   * @returns
   */
  addOSMTileLayer(
    _zinde = undefined,
    _extent = undefined,
    _minZoom = undefined,
    _maxZoom = undefined,
    _properties = { layerName: 'OSM Map', desc: undefined }
  ) {
    const tileLayer = new TileLayer({
      properties: _properties,
      extent: _extent,
      minZoom: _minZoom,
      maxZoom: _maxZoom,
      zIndex: _zinde,
      visible: true,
      source: new OSM()
    })
    this.layers.push(tileLayer)
    this.map.addLayer(tileLayer)
    return tileLayer
  }

  addImageryLayer() {
    // const attributions =
    //   '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
    //   '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    const imagery = new TileLayer({
      source: new XYZ({
        url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + 'wsx0iCqhZOJF35Vpj2PN'
        // maxZoom: 20
      }),
      // minZoom: 10, // 设置最小缩放级别为10
      maxZoom: 9, // 设置最大缩放级别为15
      properties: {
        layerName: 'Imagery Layer'
      }
    })
    this.layers.push(imagery)
    this.map.addLayer(imagery)
  }
  /**
   * 添加聚合图层
   * @param {*} _zIndex
   * @param {*} _styleFunction
   * @param {*} _properties
   * @returns
   */
  addClusterVectorLayer(
    _zIndex,
    _source,
    _styleFunction,
    _properties = { layerName: undefined, desc: undefined }
  ) {
    const clusterVectorLayer = new VectorLayer({
      zIndex: _zIndex,
      properties: _properties,
      style: _styleFunction,
      source: new ClusterSource({
        distance: 100,
        minDistance: 50,
        source: _source || new VectorSource()
      })
    })
    this.layers.push(clusterVectorLayer)
    this.map.addLayer(clusterVectorLayer)
    // 第一次，缩放到中国区域
    this.zoomToExtent(clusterVectorLayer, [73, 20, 135, 53])
    return clusterVectorLayer
  }
  /**
   * 添加Vetor矢量图层图层
   * @param {*} _zIndex
   * @param {*} _source
   * @param {*} _styleFunction
   * @param {*} _properties
   */
  addVectorLayer(_zIndex, _source, _styleFunction, _properties = {}) {
    const wfsVectorLayer = new VectorLayer({
      source: _source,
      style: _styleFunction,
      visible: true,
      properties: _properties
    })
    this.layers.push(wfsVectorLayer)
    this.map.addLayer(wfsVectorLayer)
    return wfsVectorLayer
  }
  /**
   * 添加hover弹窗OverLay图层
   */
  addOverlayLayer(_container, _content) {
    const overlay = new Overlay({
      element: _container,
      zIndex: 100,
      autoPan: {
        animation: {
          duration: 250
        }
      }
    })
    // this.layers.push(overlay)
    this.map.addOverlay(overlay)
    // this.map.addLayer(overl1ayLayer)
    const landslide_pointLayer = this.getLayerByName('landslide_pointLayer')
    const selectHover = new Select({
      layers: [landslide_pointLayer],
      condition: pointerMove })
    this.map.addInteraction(selectHover)
    selectHover.on('select', (event) => {
      if (event.selected.length !== 0) {
        event.selected[0].setStyle(selectClusterStyle)
        // const feature = event.selected[0]
        // console.log(feature)
        // const coordinate = event.coordinate
        const coordinate = event.mapBrowserEvent.coordinate
        const features = event.selected[0].get('features')
        _content.innerHTML = ''
        if (features.length > 1) {
          for (let i = 0; i < features.length; i++) {
            _content.innerHTML += features[i].getProperties().ev_date + ' ' + features[i].getProperties().ls_cat + '\n'
            // console.log(features[i].getProperties())
          }
        } else {
          console.log(features[0].getProperties())
          _content.innerHTML += '<strong>DATE:</strong> ' + features[0].getProperties().ev_date + '<br>'
          _content.innerHTML += '<strong>TYPE:</strong> ' + features[0].getProperties().ls_cat + '<br>'
          _content.innerHTML += '<strong>SOURCE:</strong> ' + features[0].getProperties().src_name + '<br>'
          _content.innerHTML += '<strong>DESCRIPTION:</strong> ' + features[0].getProperties().ev_desc + '<br>'
          _content.innerHTML += '<strong>Click for details.<strong>' + '<br>'
        }
        overlay.setPosition(coordinate)
        // overlay.setPosition(this.map.getView().getCenter())
      } else overlay.setPosition(undefined)
    })
    return overlay
  }
  /**
   * 添加风向图层
   */
  addWindLayer(_WIND_JSON, _mapContainer, _layerSwitcher) {
    const _that = this
    fetch(_WIND_JSON)
      .then(res => res.json()) // 把响应转换成JSON对象
      .then(res => {
        const windLayer = new WindLayer(res, {
          forceRender: true,
          windOptions: {
            globalAlpha: 0.9,
            // colorScale: scale,
            velocityScale: 1 / 270,
            paths: 2500,
            // eslint-disable-next-line no-unused-vars
            // colorScale: () => {
            //   // console.log(m);
            //   return '#ffffff'
            // },
            colorScale: ['rgb(36,104, 180)', 'rgb(60,157, 194)',
              'rgb(128,205,193 )', 'rgb(151,218,168 )',
              'rgb(198,231,181)', 'rgb(238,247,217)',
              'rgb(255,238,159)', 'rgb(252,217,125)',
              'rgb(255,182,100)', 'rgb(252,150,75)',
              'rgb(250,112,52)', 'rgb(245,64,32)',
              'rgb(237,45,28)', 'rgb(220,24,32)',
              'rgb(180,0,35)'],
            lineWidth: 3,
            width: 3,
            // colorScale: scale,
            generateParticleOption: false
          },
          properties: {
            layerName: 'WindLayer'
          }
          // map: map,
          // projection: 'EPSG:4326'
        })
        // console.log(this.map, windLayer)

        _that.map.addLayer(windLayer)
        _that.layers.push(windLayer)
        this.addLayerSwitcher(_layerSwitcher)
        windLayer.on('change:visible', function(e) {
          // e是一个事件对象，包含一些属性和方法
          // e.target是触发事件的图层对象
          // e.target.getVisible()是图层的当前可见性，true或false
          // 你可以在这里写你想要执行的逻辑，比如打印一些信息或者调用其他函数
          console.log('windLayer visibility changed to ' + e.target.getVisible())
          // 刷新windLayer图层的数据源
          // 通知地图视图windLayer图层已经改变
          if (e.target.getVisible() === true) location.reload()
        })
      })
  }
  /**
   * 判断图层是否存在
   * @param {*} _layerName
   */
  hasLayer(_layerName) {
    return !!this.getLayerByName(_layerName)
  }

  /**
   * 根据图层名称获取图层
   * @param {*} _layerName
   */
  getLayerByName(_layerName) {
    let layer = []
    if (_layerName) {
      // 遍历图层
      layer = this.layers.filter((item) => {
        return item.values_['layerName'] === _layerName
      })
    }
    return layer.length > 0 ? layer[0] : undefined
  }
  /**
   * 缩放到图层范围
   * @param {*} _layer
   */
  zoomToExtent(_layer, _extent = []) {
    if (_layer) {
      if (_extent.length === 0) _extent = _layer.getSource().getExtent()
    }
    console.log(_extent)
    this.map.getView().fit(_extent)
  }

  /** ********************事件监听操作******************* */

  /**
   * 添加点击互动
   */
  addSelectInteraction() {
    // 添加一个用于选择Feature的交互方式
    const ch_borderLayer = this.getLayerByName('ch_borderLayer')
    const landslide_pointLayer = this.getLayerByName('landslide_pointLayer')
    const selectPolySingleClick = new Select({
      layers: [ch_borderLayer, landslide_pointLayer],
      // style: null,
      style: clusterStyle,
      condition: singleClick })
    this.map.addInteraction(selectPolySingleClick)
    selectPolySingleClick.on('select', (event) => {
      if (event.selected.length !== 0) {
        if (event.selected[0].getGeometry().getType() === 'MultiPolygon') {
          // const source = ch_borderLayer.getSource()
          // // 获取源的所有 feature
          // const features = source.getFeatures()
          // features.forEach((feature) => {
          //   // if (feature.getProperties().adcode === event.selected[0].get('features').getProperties().adcode) console.log('yes')
          //   feature.setStyle(polygonStyle)
          // })
          const feature = event.selected[0]
          const geo = feature.getGeometry()
          // console.log(features)
          event.selected[0].setStyle(heightLightStyle)
          console.log(event.selected[0].getStyle())
          this.map.getView().fit(geo.getExtent())
          // console.log(feature.getProperties())
        } else {
          const coordinate = event.mapBrowserEvent.coordinate
          viewDefault.setCenter(coordinate)
          if (event.selected[0].get('features').length === 1) {
            const feature = (event.selected[0].get('features'))[0]
            // console.log(feature.getProperties().src_link)
            window.open(feature.getProperties().src_link, '_blank')
            // console.log(event.selected[0].getStyle())
          } else { viewDefault.setZoom(viewDefault.getZoom() + 1) }
        }
      }
    })
  }

  /**
   * 注册地图监听事件
   * @param {*} _eventType
   * @param {*} _callback
   */
  registEventForMap(_eventType, _callback) {
    this.map.on(_eventType, function(event) {
      _callback(event)
    })
  }
}
