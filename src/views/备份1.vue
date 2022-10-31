import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

import 'vant/lib/index.css'

import axios from 'axios'
Vue.prototype.$axios = axios

import {
  login,
  getUserInfo
} from "@/api/energyStorageSales";

// //注册一个全局前置守卫,确保要调用 next 方法，否则钩子就不会被 resolved
router.beforeEach((to, from, next) => {
  var getInfo = window.localStorage.getItem('userInfo')
  
  if (getInfo != null) {
    next()
  } else {
    let params = {
      appCode: "energy",
      url: ""
    }
    login(params).then(res => {
      // console.log("888",window.location.href);
      // alert(window.location.href)
      window.location.href
    })
    // alert(window.location.href)
    // alert('请重新授权')

    var searchHref = window.location.search.replace('?', '')
    var params1 = searchHref.split('&')
    var returnParam = {}
    params1.forEach(function (param) {
      var paramSplit = param.split('=')
      returnParam[paramSplit[0]] = paramSplit[1]
    })

    var code = returnParam['code']
    let params2 = {
      userCode: code,
      appCode: "energy"
    }
    getUserInfo(params2).then(res => {
      if(res.data.code == 200) {
        // console.log("ttttt",res);
        alert(res)
        // let info = {
        //   hrid: res.data.data.hrid,
        //   name: encodeURIComponent(res.data.data.name)
        // }
        // window.localStorage.setItem('supplierInfo', JSON.stringify(info))
        // window.localStorage.setItem('supplierHrid', res.data.data.hrid)
        // window.localStorage.setItem('supplierName', encodeURIComponent(res.data.data.name))
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
