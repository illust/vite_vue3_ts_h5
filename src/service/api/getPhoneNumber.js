/*
 * @Author: jiang.sheng 87789771@qq.com
 * @Date: 2024-01-06 15:24:29
 * @LastEditors: JiangSheng 87789771@qq.com
 * @LastEditTime: 2024-05-17 15:48:58
 * @FilePath: \meimei-new-前端\src\api\login.js
 * @Description: 登录过程中加载的东西
 *
 */
import request from '@/utils/request'

// 获取access_token
export function getAccessToken() {
  return request({
    url: '/api/minipro/fetch-access-token',
    headers: {
      isToken: false,
      repeatSubmit: false,
    },
    method: 'get',
  })
}

// 获取手机号
export function getPhoneNumber(code) {
  const data = {
    code,
  }
  return request({
    url: '/api/minipro/get-phone-number',
    headers: {
      isToken: false,
      repeatSubmit: false,
    },
    method: 'post',
    data: data,
  })
}
