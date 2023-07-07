<template>
  <div id="map" class="mapContainer">
    <button id="buttonToggle" class="buttonToggle" @click="toggle">{{ buttonText }}</button>
    <button id="buttonToggleLS" class="buttonToggle" @click="toggleLayerSwitcher">{{ buttonTextLS }}</button>
    <button id="buttonToggleChart" class="buttonToggle" @click="toggleChart">{{ buttonTextChart }}</button>
    <transition name="slide">
      <EagleMap v-show="eagleMap_visible" />
    </transition>
    <transition name="slide">
      <div v-show="layerSwitcher_visible" id="layerSwitcher" />
    </transition>
    <div id="popup" class="ol-popup">
      <div id="popup-content" />
    </div>
    <transition name="slideX">
      <Charts v-show="chart_visible" />
    </transition>
  </div>
</template>

<script>
// 导入全局配置
import { CHINA_VECTOR_SOURCE, wfsVectorSource, WIND_JSON } from '../../global'
// 导入子组件
import EagleMap from './ EagleMap.vue'
// 导入地图工具
import MapClass from '../../utils/MapClass'
import '../../styles/map.scss'
import Charts from './Chats.vue'

import {
  polygonStyle,
  // pointStyle,
  clusterStyle
  // heightLightStyle
} from '../../utils/MapUtils'

import { Vector as VectorSource } from 'ol/source'
import { GeoJSON } from 'ol/format'
import { all } from 'ol/loadingstrategy'

export default {
  name: 'Map',
  components: {
    EagleMap,
    Charts
  },
  data() {
    return {
      buttonText: '<', // a variable to store the button's text
      eagleMap_visible: true,
      buttonTextLS: '<',
      layerSwitcher_visible: true,
      buttonTextChart: '>',
      chart_visible: true,
      mapClass: undefined,
      overlayLayer: undefined,
      heightLightFeature: undefined,
      curFeatures: []
    }
  },
  mounted() {
    this.mapClass = new MapClass('map', 'EPSG:4326', 5)
    this.addEventListenerForLoadData() // 注册监听事件
    this.mapClass.addOSMTileLayer()
    // 添加基础底图
    this.mapClass.addImageryLayer()
    // this.mapClass.addArcGISTileLayer(ARCGIS_MAP_URL, 0, {
    //   layerName: 'sh_tileLayer',
    //   desc: '蓝黑底图'
    // })
    // 创建wfs资源（灾害点），记得看ip对不对··

    const ChinaVectorSource = new VectorSource({
      format: new GeoJSON(),
      projection: 'EPSG:4326',
      url: CHINA_VECTOR_SOURCE,
      strategy: all
    })
    // 添加底图
    this.mapClass.addVectorLayer(0, ChinaVectorSource, polygonStyle, {
      layerName: 'ch_borderLayer',
      desc: '边界'
    })
    // 添加聚合图层
    this.mapClass.addClusterVectorLayer(0, wfsVectorSource, clusterStyle, {
      layerName: 'landslide_pointLayer',
      desc: '滑坡点'
    })
    // 添加地图互动
    this.mapClass.addSelectInteraction()

    const container = document.getElementById('popup')
    const content = document.getElementById('popup-content')
    this.mapClass.addOverlayLayer(container, content)
    // 关闭
    const mapContainer = document.getElementById('map')
    const layerSwitcher = document.getElementById('layerSwitcher')
    this.mapClass.addWindLayer(WIND_JSON, mapContainer, layerSwitcher)

    // this.mapClass.addLayerSwitcher(layerSwitcher)
    this.SuitToScreen()
    window.addEventListener('resize', (event) => {
      this.SuitToScreen()
    })
  },
  methods: {
    SuitToScreen: function() {
      const width = screen.width
      if (width < 500) {
        if (this.eagleMap_visible === true) this.toggle()
        if (this.layerSwitcher_visible === true) this.toggleLayerSwitcher()
        if (this.chart_visible === true) this.toggleChart()
      }
    },
    toggle() {
      this.eagleMap_visible = !this.eagleMap_visible
      this.buttonText = this.eagleMap_visible ? '<' : '>'
      // console.log(this.buttonText)
    },
    toggleLayerSwitcher() {
      this.layerSwitcher_visible = !this.layerSwitcher_visible
      this.buttonTextLS = this.layerSwitcher_visible ? '<' : '>'
      // console.log(this.buttonTextLS)
    },
    toggleChart() {
      this.chart_visible = !this.chart_visible
      this.buttonTextChart = this.chart_visible ? '>' : '<'
      // console.log(this.buttonTextLS)
    },
    addEventListenerForLoadData() {
      this.mapClass.getOlMap().on('postrender', function(e) {
        console.log('load data ending')
      })
    }
  }
}
</script>
<style scoped>
.mapContainer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.ol-popup {
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 280px;
}
.ol-popup:after, .ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.buttonToggle {
  position: absolute;
  //left: 0.5em;
  width: 30px;
  height: 30px;
  border: 2px solid #fff; /* add some white border */
  border-radius: 5px;
  z-index: 999; /* set a high z-index */
  background-color: rgba(0, 101, 178, 0.71); /* add some semi-transparent black color */
  color: white;
  transition: all 0.3s ease; /* add some transition effect */
}

.buttonToggle:hover {
  transform: scale(1.2); /* add some scale effect on hover */
  background-color: rgba(255,255,255,0.5); /* add some semi-transparent white color on hover */
}
.slide-enter-active,.slideX-enter-active,
.slide-leave-active,.slideX-leave-active {
  transition: all 0.5s ease;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(-100%);
}
.slideX-enter,
.slideX-leave-to {
  transform: translateX(100%);
}
</style>
