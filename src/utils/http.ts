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
/**
 * 请求函数
 * @param UniApp.RequestOptions
 * @returns Promise
 * 1. 返回Promise对象
 * 2. 请求成功
 *  2.1 提取核心数据 res.data
 *  2.2 添加类型，支持泛型
 * 3. 请求失败
 *  3.1 网络错误 -》 提示用户换网络
 *  3.2 401错误 -》清理用户信息，跳转登录页
 *  3.3 其他错误 -》根据后端错误信息轻提示
 */
interface Data<T> {
  code: string
  msg: string
  result: T
}
export function http<T>(options: UniApp.RequestOptions) {
  // 1. 返回Promise对象
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,
      // 2. 请求成功
      success(result) {
        if (result.statusCode >= 200 && result.statusCode < 300) {
          // 获取数据成功，调用resolve
          resolve(result.data as Data<T>)
        } else if (result.statusCode === 401) {
          // 401 错误，调用reject
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          uni.navigateTo({ url: '/pages/login/login' })
          reject(result)
        } else {
          // 通用错误
          uni.showToast({
            icon: 'none',
            title: (result.data as Data<T>).msg || '请求错误',
          })
          reject(result)
        }
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
  })
}
