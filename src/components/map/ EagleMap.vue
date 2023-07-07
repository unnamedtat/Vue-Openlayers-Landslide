<template>
  <div id="eagleMap" class="eagleMap"/>
</template>
<script>
// 导入全局配置
// import { ARCGIS_MAP_URL } from '../../global'
// 导入地图工具
import MapClass from '../../utils/MapClass'
export default {
  props: ['mapView'],
  data() {
    return {
      eagleMap: undefined
    }
  },
  mounted() {
    console.log(`eagleMap初始化`)
    this.eagleMap = new MapClass('eagleMap')
    // 添加底图
    // this.eagleMap.addArcGISTileLayer(ARCGIS_MAP_URL, 0, {
    //   layerName: 'sh_tileLayer',
    //   desc: '蓝黑底图'
    // })

    this.eagleMap.addOSMTileLayer(0)
    this.eagleMap.addImageryLayer()
  },
  methods: {}
}
</script>
<style scoped>
.eagleMap {
  position: absolute;
  left: 1.5em;
  bottom: 5em;
  width: 300px;
  height: 300px;
  border: 5px solid rgba(255, 255, 255, 0.51);
  border-radius: 5px;
  z-index: 2;
}
</style>
