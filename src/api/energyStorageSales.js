import request from '@/utils/wxRequest'

//企业微信JS配置 
export function getConfig(params) {
  return request({
    url: '/commons/weChatOfficial/getConfig',
    method: 'get',
    params
  })
}

//获取微信公众号用户信息
export function getUserInfo(params) {
  return request({
    url: '/commons/weChatOfficial/getUserInfo',
    method: 'get',
    params
  })
}

//获取产品详情
export function getProductById(params) {
  return request({
    url: '/lshm_energy/cu/product/getProductById',
    method: 'get',
    params
  })
}

//下单
export function placeOrder(data) {
  return request({
    url: '/lshm_energy/cu/product/placeOrder',
    method: 'post',
    data
  })
}

//查询订单状态
export function getOrderStatus(params) {
  return request({
    url: '/lshm_energy/cu/product/getOrderStatus',
    method: 'get',
    params
  })
}

//查询订单详情(包含支付表单参数)
export function getOrderDetail(params) {
  return request({
    url: '/lshm_energy/cu/product/getOrderDetail',
    method: 'get',
    params
  })
}