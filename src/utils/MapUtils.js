import { Fill, Stroke, Style, Text, Icon } from 'ol/style'

/**
 * 面-Vector图层样式
 * @param {*} _feature
 * @returns
 */
export const polygonStyle = function(_feature) {
  return new Style({
    fill: new Fill({
      color: [255, 255, 255, 0.2]
    }),
    stroke: new Stroke({
      // color: [0, 253, 255, 0.3],
      lineDash: [1, 2, 3, 4, 5, 6],
      lineDashOffset: 1,
      color: '#ffffff',
      width: 1.5
    }),
    text: new Text({
      font: '14px sans-serif',
      text: _feature.get('name'),
      textAlign: 'center',
      fill: new Fill({
        color: [255, 255, 255]
      }),
      stroke: new Stroke({
        color: [0, 255, 0, 0.3],
        width: 1
      })
    })
  })
}
/**
 * 选中后面-Vector图层样式
 * @param {*} _feature
 * @returns
 */
export const SelectedpolygonStyle = function(_feature) {
  return new Style({
    fill: new Fill({
      color: [0, 125, 255, 0.3]
    }),
    stroke: new Stroke({
      // color: [0, 253, 255, 0.3],
      color: '#319FD3',
      width: 1.5
    }),
    text: new Text({
      font: '14px sans-serif',
      text: _feature.get('name'),
      textAlign: 'center',
      fill: new Fill({
        color: [255, 255, 255]
      }),
      stroke: new Stroke({
        color: [0, 255, 0, 0.3],
        width: 1
      })
    })
  })
}

/**
 * 点-Vector图层样式
 * @param {*} _feature
 * @returns
 */
export const pointStyle = function(_feature) {
  return new Style({
    fill: new Fill({
      color: [255, 255, 255, 0.3]
    }),
    image: new Icon({
      src: require('/src/assets/icons/point.png'),
      size: [200, 200],
      scale: 0.3
    }),
    text: new Text({
      font: '12px sans-serif',
      text: _feature.get('name'),
      textAlign: 'center',
      offsetX: 0,
      offsetY: 26,
      fill: new Fill({
        color: [255, 255, 255]
      }),
      stroke: new Stroke({
        color: [0, 255, 0, 0.3],
        width: 1
      })
    })
  })
}

export const clusterStyle = function(_feature) {
  const size = _feature.get('features').length
  if (size === 1) {
    return new Style({
      image: new Icon({
        src: require('/src/assets/icons/point.png'),
        size: [200, 200],
        scale: 0.2
      })
    })
  } else {
    return new Style({
      image: new Icon({
        src: require('/src/assets/icons/point.png'),
        size: [200, 200],
        scale: 0.3
      }),
      text: new Text({
        text: size.toString(),
        font: 'normal 18px 黑体',
        fill: new Fill({
          color: 'black'
        })
      })
    })
  }
}
export const selectClusterStyle = function(_feature) {
  const size = _feature.get('features').length
  if (size === 1) {
    return new Style({
      image: new Icon({
        src: require('/src/assets/icons/point3.png'),
        size: [200, 200],
        scale: 0.2
      })
    })
  } else {
    return new Style({
      image: new Icon({
        src: require('/src/assets/icons/point3.png'),
        size: [200, 200],
        scale: 0.3
      }),
      text: new Text({
        text: size.toString(),
        font: 'normal 18px 黑体',
        fill: new Fill({
          color: 'black'
        })
      })
    })
  }
}

/**
 * 高亮显示样式
 * @returns
 */
export const heightLightStyle = function() {
  return new Style({
    stroke: new Stroke({
      color: 'rgba(255, 255, 255, 0.7)',
      width: 5
    }),
    fill: new Fill({
      color: 'rgba(99,206,255,0.5)'
    })
  })
}

// /**
//  * 创建弹出窗口
//  * @param {*} _coordinate
//  * @param {*} _properties
//  */
// export const createPopUpWindowForMap = function() {
//   // 创建容器
//   const popupContainer = document.createElement('div')
//   // 设置ID+样式
//   popupContainer.id = 'WindowPopup'
//   popupContainer.style.position = 'absolute'
//   popupContainer.style.backgroundColor = 'white'
//   popupContainer.style.boxShadow = '0 1px 4px rgba(0,0,0,0.2)'
//   popupContainer.style.padding = '15px'
//   popupContainer.style.borderRadius = '10px'
//   popupContainer.style.border = '1px solid #cccccc'
//   popupContainer.style.bottom = '12px'
//   popupContainer.style.left = '-50px'
//   popupContainer.style.minWidth = '280px'
//   // 创建关闭按钮
//   const closeButton = document.createElement('a')
//   // 设置ID+样式
//   closeButton.innerHTML = '×'
//   closeButton.id = 'WindowPopup-closer'
//   closeButton.style.position = 'absolute'
//   closeButton.style.textDecoration = 'none'
//   closeButton.style.top = '2px'
//   closeButton.style.right = '8px'
//   closeButton.style.cursor = 'pointer'
//   popupContainer.appendChild(closeButton)
//   // 创建内容面板
//   const popipContent = document.createElement('div')
//   popipContent.id = 'WindowPopupContent'
//   // popipContent.style.minHeight = '50px'
//   popupContainer.appendChild(popipContent)
//   // 添加容器到body中
//   document.body.appendChild(popupContainer)
//   // 返回弹出窗口容器
//   return popupContainer
// }
