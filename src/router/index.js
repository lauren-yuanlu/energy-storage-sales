import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/energyStorageSales',
    component: () => import('@/views/energyStorageSales'),
    name: 'energyStorageSales',
    meta: {
      title: '能源储能销售'
    }
  },
  {
    path: '/paymentResult',
    component: () => import('@/views/paymentResult'),
    name: 'paymentResult',
    meta: {
      title: '支付结果'
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
