import { Vector as VectorSource } from 'ol/source'
import { GeoJSON } from 'ol/format'
import { all } from 'ol/loadingstrategy'

const ARCGIS_MAP_URL =
  'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
const BASE_DATA_URL = '/data'

const EVENT_TYPES = {
  UPDATE_MAP_VECTORLAYER: 1
}
const WIND_JSON = 'https://blog.sakitam.com/wind-layer/data/wind.json'

const LANDSLIDE_JSON = '您的服务器地址' +
  'geoserver/gishw/ows?service=WFS&version=1.0.0&request=GetFeature&' +
  'typeName=gishw%3Anasa_global_landslide_catalog_point&maxFeatures=2000&outputFormat=application%2Fjson'

const CHINA_VECTOR_SOURCE = '您的服务器地址' +
  '/geoserver/gishw/ows?service=WFS&version=1.0.0&' +
  'request=GetFeature&typeName=gishw%3Achina&maxFeatures=50&outputFormat=application%2Fjson'

const wfsVectorSource = new VectorSource({
  format: new GeoJSON(),
  projection: 'EPSG:4326',
  url: LANDSLIDE_JSON,
  strategy: all
})

export { ARCGIS_MAP_URL, BASE_DATA_URL, EVENT_TYPES, WIND_JSON, LANDSLIDE_JSON, CHINA_VECTOR_SOURCE, wfsVectorSource }
