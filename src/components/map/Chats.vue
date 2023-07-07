<template>
  <div id="chat" class="chat" />
</template>
<script>
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent
} from 'echarts/components'
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'
import { wfsVectorSource } from '@/global'
// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LegendComponent
])

wfsVectorSource.on('change', function(evt) {
  const features = wfsVectorSource.getFeatures()
  // console.log(features)
  // 判断数据源是否已经准备好
  if (wfsVectorSource.getState() === 'ready') {
    const counts = {} // 存储各county的各category数目

    features.forEach(item => {
      const county = item.get('ctry_name')
      const category = item.get('ls_cat')
      // 如果对象中没有该county的键，就创建一个
      if (!counts[county]) {
        counts[county] = {}
      }
      // 如果对象中没有该county的该category的键，就创建一个
      if (!counts[county][category]) {
        counts[county][category] = 0
      }
      // 将该county的该category的计数值加一
      counts[county][category]++
    })

    const sums = [] // 存储各county的各category相加之和

    for (const county in counts) {
      let sum = 0 // 计算该county的总和
      for (const category in counts[county]) {
        sum += counts[county][category]
      }
      // 将结果放入数组中，包含county和sum两个属性
      sums.push({ county, sum })
    }
    // console.log(sums)
    // 根据sum属性对数组进行降序排序
    sums.sort((a, b) => b.sum - a.sum)
    // 取出前五个元素
    const topFive = sums.slice(0, 6)
    // 提取出前五个元素中的county属性
    const countries = topFive.map(item => item.county)
    console.log(countries)
    const details = {} // 存储这五个county的各category的数目

    topFive.forEach(item => {
      const county = item.county
      // 将该county的各category的数目从counts对象中复制到details对象中
      details[county] = counts[county]
    })

    const groups = {} // 存储各category的数量
    const allCategories = [
      'mudslide',
      'rock_fall',
      'debris_flow',
      'landslide',
      'complex',
      'other',
      'creep',
      'snow_avalanche',
      'unknown',
      'riverbank_collapse']

    for (const county in details) {
      const categories = details[county]
      for (let i = 0; i < allCategories.length; i++) {
        const category = allCategories[i]
        let count = 0
        if (categories[category]) count = categories[category]
        // 如果对象中没有该category的键，就创建一个
        if (!groups[category]) {
          groups[category] = []
        }
        // 将该county的该category的数量放入数组中
        groups[category].push(count)
      }
    }
    console.log(groups)
    const resultCategory = [] // 存储各category的数量

    for (const category in groups) {
      // 将该category和其counts转换为一个对象
      const item = { name: category, data: groups[category], type: 'bar', stack: 'x' }
      // 将结果放入数组中
      resultCategory.push(item)
    }
    console.log(resultCategory)

    const option = {
      textStyle: {
        fontSize: 12,
        color: '#FFFFFF'
      },
      backgroundColor: 'rgba(255,255,255,0.24)',
      borderRadius: 5,
      xAxis: {
      },
      grid: {
        left: '20',
        bottom: '10',
        containLabel: true
      },
      yAxis: { data: countries },
      series: resultCategory,
      legend: { countries,
        textStyle: {
          color: '#fff'
        }}
      // ...
    }
    // 接下来的使用就跟之前一样，初始化图表，设置配置项
    this.myChart = echarts.init(document.getElementById('chat'))
    this.myChart.setOption(option)
    sessionStorage.setItem('option', JSON.stringify(option))
  }
}

)
// const chartData = []
// console.log(sessionStorage.getItem('form'))
// 遍历要素，打印出属性
// if (features.length > 1) {
//   for (let i = 0; i < features.length; i++) {
//     chartData.push({
//       category: features[i].get('ls_cat'),
//       county: features[i].get('ctry_name'),
//     }
//     )
//   }
// }

export default {
  data() {
    return {
      Charts: undefined
    }
  },
  mounted() {
    if (sessionStorage.getItem('option')) {
      this.myChart = echarts.init(document.getElementById('chat'))
      const option = JSON.parse(sessionStorage.getItem('option'))
      this.myChart.setOption(option)
    }
  }
}

</script>
<style scoped>
.chat{
  margin: 0px;
  //background-color: rgba(255,255,255,0.5);
  width: 550px;
  height:320px;
  position:absolute;
  bottom:2em;right:1.5em;z-index: 10;  border-radius: 10px;
  border: 1px solid #cccccc;
  overflow: hidden;
}
</style>
