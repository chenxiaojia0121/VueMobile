<template>
  <div class="search-container">
    <form action="/" class="search-form">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#00d0c3"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>
    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :searchText="searchText"/>

    <!-- 搜索建议 -->
    <search-suggestion v-else-if="searchText" :searchText="searchText" @search="onSearch"/>
    <!-- 搜索历史 -->
    <search-history v-else @search="onSearch" @historyChange="historyChange" :search-histories="searchHistories" @history-change="historyChange"/>
  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'SearchIndex',
  data () {
    return {
      isResultShow: false,
      searchText: '',
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || []
    }
  },
  methods: {
    onSearch (val) {
      this.searchText = val
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
      this.isResultShow = true
    },
    onCancel () {
      this.$router.back()
    },
    historyChange (type, index) {
      if (type === 'delete') {
        this.searchHistories.splice(index, 1)
      } else if (type === 'all') {
        this.searchHistories = []
        setItem('TOUTIAO_SEARCH_HISTORIES', [])
      }
    }
  },
  created () {
  },
  computed: {},
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  watch: {
    searchHistories (value) {
      setItem('TOUTIAO_SEARCH_HISTORIES', value)
    }
  }
}
</script>

<style lang="less" scoped>
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    background-color: pink;
  }
}
</style>
