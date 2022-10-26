export function getConfig(params) {
  return request({
    url: '/commons/WeCat/getConfig',
    method: 'get',
    params
  })
}