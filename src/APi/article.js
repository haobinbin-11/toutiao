// 文章相关请求模块
import request from '@/utils/request'

// 获取文章列表
export const getArticles = params => {
  return request({
    methosds: 'GET',
    url: '/mp/v1_0/articles',
    // body 参数使用 data 设置
    // query 参数使用 params 设置
    // headers 参数使用 headers 设置
    params
  })
}
// 获取文章频道
export const getArticleChannels = params => {
  return request({
    methosds: 'GET',
    url: '/mp/v1_0/channels'
    // body 参数使用 data 设置
    // query 参数使用 params 设置
    // headers 参数使用 headers 设置
  })
}
// 删除文章
export const deleteArticle = articleId => {
  return request({
    method: 'DELETE',
    // 接口文档中写的路径参数需要在 url 中传递
    // 凡是看到接口路径中有 :xxx 格式的字段, 需要传递路径参数
    url: `/mp/v1_0/articles/${articleId}`
  })
}
// 新建文章
export const addArticle = (data, draft = false) => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/articles',
    params: {
      draft // 是否为草稿 布尔值
    },
    data
  })
}
// 编辑文章
export const updateArticle = (articleId, data, draft = false) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/articles/${articleId}`,
    params: {
      draft // 是否为草稿 布尔值
    },
    data
  })
}
// 获取指定文章
export const getArticle = articleId => {
  return request({
    method: 'GET',
    url: `/mp/v1_0/articles/${articleId}`
  })
}
