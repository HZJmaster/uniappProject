/* 添加拦截器:
 拦截 request 请求
 拦截 uploadfile 文件上传

 TODO：
 1. 非http 开头需要拼接地址
 2. 请求超时
 3. 添加小程序请求头标识
 4. 添加token 请求头标识 */

import { useMemberStore } from '@/stores'

const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'

// 添加拦截器
const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    // request 触发前拼接 url
    // 非http 开头需要拼接地址
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }
    // 请求超时, 默认60s
    options.timeout = 10000
    // 添加小程序请求头标识
    options.header = {
      ...options.header,
      'source-client': 'miniapp',
    }
    // 添加token 请求头标识
    const memberStore = useMemberStore()
    const token = memberStore.profile?.token
    if (token) {
      options.header.Authorization = token
    }
  },
}
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadfile', httpInterceptor)
