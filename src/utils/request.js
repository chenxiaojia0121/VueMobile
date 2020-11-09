/**
 * 封装 axios 请求模块
 */
import axios from 'axios'
import store from '../store'
import jsonBig from 'json-bigint'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',
  // baseURL: 'http://api-toutiao-web.itheima.net',
  transformResponse: [function (data) {
    // Do whatever you want to transform the data
    try {
      return jsonBig.parse(data)
    } catch (err) {
      return data
    }
  }]
})
// 请求拦截器
request.interceptors.request.use(function (config) {
// 在发送请求之前做些什么
  const user = store.state.user
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
// 对请求错误做些什么
  return Promise.reject(error)
})
export default request
