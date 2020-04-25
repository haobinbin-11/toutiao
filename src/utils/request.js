// 基于axios封装的请求模块
import axios from 'axios'
// 创建一个axios实例,说白了就是复制了一个axios
// 我们通过这个实例去发请求,把需要配置的配置给这个实例来处理
// 之前写法
// axios.defaults.baseURL = 'http://api.example.com'
// 我们可能有这样的需求
// 例如有多个不同路径的请求接口
// http:123.0.1.300/
// http://baidu.com
// axios.create就是复制了一个axios,不同的 axios 可以有不同的配置
// 而且不会冲突
// 复制出来的axios 和 axios 本身功能相同
// const req1 = axios.create()
// req1.defaults.baseURL = 'http:123.0.1.300/'
// const req2 = axios.create()
// req2.defaults.baseURL = 'http://baidu.com'
// req1.get('xxx')
// req2.get('xxx')
// req1({
//   method: '',
//   url: ''
// })
import jsonBigint from 'json-bigint'
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 请求的基础路径
  transformResponse: [function (data) {
    // 定义后端返回的原始数据的处理
    // 参数data 是后端返回的原始数据(未经处理的 JSON 格式字符串)
    try {
      return jsonBigint.parse(data)
    } catch (err) {
      return data
    }
  }]
})

// 导出请求方法
export default request

// 谁要使用谁就加载 request 模块

// 请求拦截器
request.interceptors.request.use(function (config) {
  const user = JSON.parse(window.localStorage.getItem('user'))
  // 如果有登录用户信息, 则统一设置token
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
// 响应拦截器
axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  return Promise.reject(error)
})
