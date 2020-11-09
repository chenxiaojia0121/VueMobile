<template>
  <div class="search-history">
    <van-cell title="搜索历史" >
        <div v-if="isDeleteShow">
          <span @click="$emit('history-change','all')">全部删除</span>
          &nbsp;&nbsp;
          <span @click="isDeleteShow = false">完成</span>
        </div>
        <van-icon name="delete" @click="isDeleteShow = true" v-else></van-icon>
      </van-cell>
      <van-cell :title="item" v-for="(item, index) in searchHistories" :key="index" @click="onSearchItemClick(item, index)">
        <van-icon name="close" v-if="isDeleteShow"></van-icon>
      </van-cell>
  </div>
</template>

<script>
import { searchHistoryList, deleteAllHistorys } from '@/API/search'
export default {
  name: 'searchHistory',
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false
    }
  },
  methods: {
    onSearchItemClick (item, index) {
      if (this.isDeleteShow) {
        this.$emit('history-change', 'delete', index)
        this.getSearchHistory()
      } else {
        this.$emit('search', item)
      }
    },
    async getSearchHistory () {
      try {
        const { data } = await searchHistoryList()
        this.historyList = data.data.keywords
      } catch (err) {
        this.$toast('获取历史数据失败')
      }
    },
    deleteHistorys (index) {
      this.historyList.splice(index, 1)
    },
    async deleteAll () {
      try {
        await deleteAllHistorys()
        this.$toast('全部删除成功')
        this.getSearchHistory()
      } catch (err) {
        this.$toast('全部删除失败')
      }
    }
  },
  created () {
    // this.getSearchHistory()
  },
  computed: {},
  components: {}
}
</script>

<style lang="less" scoped>

</style>
