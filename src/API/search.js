import request from '@/utils/request'
export const searchHistoryList = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search/histories'
  })
}
export const deleteAllHistorys = () => {
  return request({
    method: 'DELETE',
    url: '/app/v1_0/search/histories'
  })
}
export const getSearchResult = searchKey => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params: searchKey
  })
}
export const getSearchSuggestion = searchKey => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q: searchKey
    }
  })
}
