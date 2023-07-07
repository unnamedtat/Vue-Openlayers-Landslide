<template>
  <div>
    <download-excel
      class="export-excel-wrapper"
      :data="tableData"
      :fields="json_fields"
      name="filename.xls"
    >
      <el-button class="button"> Download </el-button>
    </download-excel>
    <el-carousel :interval="4000" type="card" height="200px">
      <el-carousel-item v-for="item in images" :key="item">
        <img :src="item" alt="image">
        <!--      <h3 class="medium">{{ item }}</h3>-->
      </el-carousel-item>
    </el-carousel>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        v-for="(item, index) in tableHeader"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        sortable
        :sort-method="compare(item.prop)"
      />
    </el-table>
  </div>
</template>

<script>
import moment from 'moment'
import { wfsVectorSource } from '@/global'
const form = []
const imageSrc = []
// 获取数据源中的所有要素
const features = wfsVectorSource.getFeatures()
if (!sessionStorage.getItem('form')) {
  // console.log(sessionStorage.getItem('form'))
  // 遍历要素，打印出属性
  if (features.length > 1) {
    for (let i = 0; i < features.length; i++) {
      // console.log(features[i])
      // console.log(features[i].getProperties())
      form.push({
        title: features[i].get('ev_title'),
        date: (moment(features[i].get('ev_date')).format('YYYY-MM-DD')),
        category: features[i].get('ls_cat'),
        county: features[i].get('ctry_name'),
        injuries: features[i].get('injuries'),
        desc: features[i].get('ev_desc')
      }
      )
    }
    sessionStorage.setItem('form', JSON.stringify(form))
  }
}
// 配合后端服务器能动态随机获取展示的滑坡图集,但是这里有些图片404了...
if (!sessionStorage.getItem('images')) {
  while (imageSrc.length < 6) { // 当数组的长度小于6时，继续循环
    const randomNumber = Math.floor(Math.random() * 1999) // 生成一个随机数
    const src = features[randomNumber].get('photo_link')
    if (!imageSrc.includes(src) && src !== '' && src.endsWith('.jpg')) { // 如果数组中不包含这个随机数
      imageSrc.push(features[randomNumber].get('photo_link')) // 就添加到数组中
    }
  }
  sessionStorage.setItem('images', JSON.stringify(imageSrc))
  // console.log(imageSrc)
}
export default {
  name: 'Carousel',
  data() {
    return { imagSrc: '',
      tableHeader: [
        { prop: 'date', label: '日期', width: 140 },
        { prop: 'title', label: '标题', width: 180 },
        { prop: 'category', label: '种类', width: 120 },
        { prop: 'county', label: '国家', width: 140 },
        { prop: 'injuries', label: '伤亡', width: 120 },
        { prop: 'desc', label: '详情' }
      ],
      json_fields: {
        日期: 'date',
        标题: 'title',
        种类: 'category',
        国家: 'county',
        伤亡: 'injuries',
        详情: 'desc'
      }
      // 爬取了一些图片作展示
      // images: [
      //   '/landslides/1.jpg',
      //   '/landslides/2.jpg',
      //   '/landslides/3.jpg',
      //   '/landslides/4.jpg',
      //   '/landslides/5.jpg',
      //   '/landslides/6.jpg'
      // ]
    }
  },
  computed: {
    tableData: () => {
      // console.log(JSON.parse(sessionStorage.getItem('form')))
      return JSON.parse(sessionStorage.getItem('form'))
    },
    // 配合后端服务器能动态随机获取展示的滑坡图集
    images: () => {
      // console.log(JSON.parse(sessionStorage.getItem('images')))
      return JSON.parse(sessionStorage.getItem('images'))
    }
  }, methods: {
    compare(propertyName) {
      return function(obj1, obj2) {
        const value1 = obj1[propertyName]
        const value2 = obj2[propertyName]
        if (typeof value1 === 'string' && typeof value2 === 'string') {
          const res = value1.localeCompare(value2, 'zh')
          return res
        } else { return value1 - value2 }
      }
    }
  }
}
</script>

<style>

.el-carousel__item:nth-child(2n) {
  background-color: rgba(153, 169, 191, 0.5);
}

.el-carousel__item:nth-child(2n+1) {
  background-color: rgba(211, 220, 230, 0.58);
}

.el-carousel__item {
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

img {
  //border: 5px solid white;
  //box-shadow: 0 0 10px rgba(0,0,0,0.3);
  transition: transform 0.3s;
}

img:hover {
  transform: scale(1.1);
}
.button {
  margin: 10px;
  //font-size: 18px;
  animation: jump 1s;
}

@keyframes jump {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}
.button:hover {
  transform: scale(1.2);
}

</style>
