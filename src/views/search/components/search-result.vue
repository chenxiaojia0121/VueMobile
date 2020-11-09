<template>
  <div class="search-result">
     <van-list v-model="loading" :finished="finished" finished-text="没有更多了" error-text="请求失败，点击重新加载" :error.sync="error" @load="onLoad">
       <van-cell v-for="item in list" :key="item.art_id" :title="item.title" @click="$router.push('article/'+ item.art_id)"></van-cell>
     </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/API/search'
export default {
  name: 'searchResult',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      queryInfo: {
        page: 1,
        per_page: 20,
        q: ''
      },
      error: false
    }
  },
  methods: {
    async onLoad () {
      try {
        this.queryInfo.q = this.searchText
        const { data } = await getSearchResult(this.queryInfo)
        const { results } = data.data
        this.list.push(...results)
        this.loading = false
        if (results.length) {
          this.page++
        } else {
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  },
  created () {
  },
  computed: {},
  components: {}
}
</script>

<style lang="less" scoped>

</style>
