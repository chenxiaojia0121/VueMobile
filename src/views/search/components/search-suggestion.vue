<template>
  <div class="search-suggestion">
    <van-cell icon="search" v-for="(item, index) in suggestionList" :key="index" @click="$emit('search', item)">
      <div slot="title" v-html='highLight(item)'></div>
    </van-cell>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { getSearchSuggestion } from '@/API/search'
export default {
  name: 'searchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  watch: {
    searchText: {
      handler: debounce(function (value) {
        this.loadSearchSuggestion(value)
      }, 200),
      // async handler (value) {
      //   this.loadSearchSuggestion(value)
      // },
      immediate: true
    }
  },
  data () {
    return {
      suggestionList: [],
      htmlStr: ''
    }
  },
  methods: {
    async loadSearchSuggestion (keys) {
      try {
        const { data } = await getSearchSuggestion(keys)
        this.suggestionList = data.data.options
      } catch (err) {
        this.$toast('联想失败')
      }
    },
    highLight (text) {
      var str = this.searchText
      const highLightStr = `<span class="active">${str}</span>`
      const reg = new RegExp(str, 'gi')
      return text.replace(reg, highLightStr)
    }
  },
  created () {
  },
  computed: {},
  components: {}
}
</script>

<style lang="less" scoped>
.search-suggestion {
  /deep/ span.active {
    color: #00d6ce;
  }
}
</style>
