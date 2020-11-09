/**
 * 文章请求模块
 */
import request from '@/utils/request'

/**
 * 获取文章列表
 */
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    // params 选项用来配置 Query 参数
    params
  })
}
// 获取新闻文章详情
export const getArticleById = id => {
  return request({
    method: 'GET',
    url: `/app/v1_0/articles/${id}`
  })
}
// 收藏文章
export const addCollect = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/collections',
    data: {
      target
    }
  })
}
// 取消收藏
export const delCollect = id => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/collections/${id}`
  })
}
// 点赞
export const addLike = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/likings',
    data: {
      target
    }
  })
}
// 取消点赞
export const delLike = target => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/likings/${target}`
  })
}
