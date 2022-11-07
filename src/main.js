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
  var getOpenId = window.sessionStorage.getItem('openid')
  
  if (getOpenId != null || whiteList.indexOf(to.path) !== -1) {
    next()
  } else {
    var searchHref = window.location.search.replace('?', '')
    var params = searchHref.split('&')
    var returnParam = {}
    params.forEach(function (param) {
      var paramSplit = param.split('=')
      returnParam[paramSplit[0]] = paramSplit[1]
    })

    var code = returnParam['code']
    if(!code) {
      // return window.location.href = "https://apiqa.lshmec.cn/4WX/commons/weChatOfficial/loginSilented?appCode=energy&url=" +  encodeURIComponent(window.location.href) //测试
      return window.location.href = "https://wx.lsh-cat.com/commons/weChatOfficial/loginSilented?appCode=energy&url=" +  encodeURIComponent(window.location.href) //正式
    }
    let params1 = {
      loginType: 1,
      userCode: code,
      appCode: "energy"
    }
    getUserInfo(params1).then(res => {
      if(res.data.code == 200) {
        window.sessionStorage.setItem('openid', res.data.data.openid)
        next()
      } else {
        alert("授权登录失败，请联系管理员!")
      }
    })
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
