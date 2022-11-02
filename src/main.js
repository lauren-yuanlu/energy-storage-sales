import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

import 'vant/lib/index.css'

import axios from 'axios'
Vue.prototype.$axios = axios

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

var dayjs = require('dayjs');
Vue.prototype.dayjs = dayjs

import {
  getUserInfo
} from "@/api/energyStorageSales";

const whiteList = ["/paymentResult"];

//注册一个全局前置守卫,确保要调用 next 方法，否则钩子就不会被 resolved
router.beforeEach((to, from, next) => {
  // var getInfo = window.sessionStorage.getItem('userInfo')
  var getOpenId = window.sessionStorage.getItem('openid')
  
  // if (getInfo != null) {
  if (getOpenId != null || whiteList.indexOf(to.path) !== -1) {
    next()
  } else {
    // alert(window.location.href)
    var searchHref = window.location.search.replace('?', '')
    var params = searchHref.split('&')
    var returnParam = {}
    params.forEach(function (param) {
      var paramSplit = param.split('=')
      returnParam[paramSplit[0]] = paramSplit[1]
    })

    var code = returnParam['code']
    // alert(code)
    if(!code) {
      // window.location.href = "http://wx.lsh-cat.com:8901/commons/weChatOfficial/login?appCode=energy&url=" +  encodeURIComponent(window.location.href)
      window.location.href = "https://apiqa.lshmec.cn/4WX/commons/weChatOfficial/loginSilented?appCode=energy&url=" +  encodeURIComponent(window.location.href)
    }
    let params1 = {
      loginType: 1,
      userCode: code,
      appCode: "energy"

    }
    // alert(JSON.stringify(params1))
    getUserInfo(params1).then(res => {
      // alert(JSON.stringify(res))
      if(res.data.code == 200) {
        // let info = {
        //   nickname: res.data.data.nickname,
        //   openid: res.data.data.openid
        // }
        window.sessionStorage.setItem('openid', res.data.data.openid)
        // window.sessionStorage.setItem('userInfo', JSON.stringify(info))
        next()
      } else {

      }
    })
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
