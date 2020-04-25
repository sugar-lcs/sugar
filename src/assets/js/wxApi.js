const defaultInfo = {
  title: '分享标题', // 分享标题
  desc: '分享描述', // 分享描述
  link: location.href, // 分享链接
  imgUrl: location.origin + '/wx_logo.png' // 分享图标
}

const defaultConfig = {
  appId: 'wxf1b95cbaf214d63f',
  debug: true,
  nonceStr: 'Wm3WZYTPz0wzccnW',
  signature: 'ww',
  timestamp: 1414587457
}

function wxhttp (obj) {
  let {
    method,
    url,
    data,
    getTime,
    contentType,
    headers,
    isASync = true
  } = obj
  return new Promise((resolve, reject) => {
    let http = new XMLHttpRequest()
    http.open(method || 'get', url, isASync)
    if (contentType) {
      http.setRequestHeader('Content-Type', contentType)
    }
    if (headers) {
      Object.keys(headers).forEach(key => {
        http.setRequestHeader(key, headers[key])
      })
    }
    http.send(data || {})
    http.onreadystatechange = function () {
      if (http.readyState === 4) {
        let status = http.status
        let res
        if (status === 200) {
          try {
            res = JSON.parse(http.responseText)
            if (getTime) { res.serviceTime = new Date(http.getResponseHeader('Date')).getTime() }
            resolve(res)
          } catch (error) {
            resolve(http.responseText)
          }
        } else {
          reject(JSON.parse(http.responseText))
        }
      } else {
        // reject(http.responseText)
      }
    }
  })
}

function wxStart (obj = defaultInfo) {
  let wx = navigator.userAgent.toLowerCase()
  if (wx.match(/MicroMessenger/i) !== 'micromessenger') {
    // const wxurl = encodeURIComponent(window.location.href.split('#')[0])
    wxApiInit(() => {
      obj.link = obj.link || location.href
      updateAppMessageShareData(obj)
      updateTimelineShareData(obj)
    }, defaultConfig)
    // wxhttp({
    //   url: `/shop/wx/config/jsapi-config?webUrl=${wxurl}`
    // }).then(res => {})
  } else {
    wxApiInit(() => {
      obj.link = obj.link || location.href
      updateAppMessageShareData(obj)
      updateTimelineShareData(obj)
    }, defaultConfig)
  }
}

function wxApiInit (callback, data) {
  let {
    appId,
    nonceStr,
    signature,
    timestamp
  } = data

  wx.config({
    debug: false,
    appId: appId,
    timestamp: timestamp,
    nonceStr: nonceStr,
    signature: signature,
    jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData']
  })

  wx.ready(function () {
    callback()
    console.log('wx ready')
  })
  wx.error(function (err) {
    callback(err)
    console.log('wx error')
  })
}

function wxShare (obj) {
  updateAppMessageShareData(obj)
  updateTimelineShareData(obj)
  console.log('wxShare')
}

function updateAppMessageShareData ({title, desc, img, link}) { // 分享给朋友
  wx.updateAppMessageShareData({
    title,
    desc,
    link,
    imgUrl: img
  })
  // console.log('friend', title);
}

function updateTimelineShareData ({title, desc, img, link}) { // 分享到朋友圈儿
  wx.updateTimelineShareData({
    title,
    desc,
    link,
    imgUrl: img
  })
}

function getLocation () {
  wx.getLocation({
    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
    success: function (res) {
      // var latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
      // var longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。
      // var speed = res.speed // 速度，以米/每秒计
      // var accuracy = res.accuracy // 位置精度
      console.log('getLocation', res)
    }
  })
}

export default {
  wxStart,
  wxShare,
  wxhttp,
  getLocation
}
