import request from '@/utils/request'

// 获取access_token
export function getPuzzles(id) {
  return request({
    url: '/api/puzzle/' + id,
    headers: {
      isToken: false,
      repeatSubmit: false,
    },
    method: 'get',
  })
}
