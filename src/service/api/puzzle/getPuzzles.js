import request from '@/utils/request'

// 获取puzzle线索数据
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

// 提交答案
export function postSubmitPuzzles(data) {
  return request({
    url: '/api/puzzle/submit-answers',
    headers: {
      isToken: false,
      repeatSubmit: false,
    },
    method: 'post',
    data: data,
  })
}
