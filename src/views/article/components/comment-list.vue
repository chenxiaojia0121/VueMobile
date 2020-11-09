<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="已显示全部评论"
    :error.sync="error"
    error-text="加载失败，请点击重试"
    :immediate-check="false"
    @load="onLoad"
  >
    <comment-item
      v-for="(item, index) in list"
      :key="index"
      title="item.content"
      :comment="item"
       @reply-click="$emit('reply-click', $event)"
    />
    <!-- @reply-click="$emit('reply-click', $event)"
    :comment="item" -->
  </van-list>
</template>

<script>
import { getComment } from '@/API/comment'
import CommentItem from './comment-item'
export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      // 自定义 Prop 数据验证
      validator (value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  data () {
    return {
      loading: false,
      finished: false,
      offset: null,
      limit: 10,
      error: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loading = true
    this.onLoad()
  },
  mounted () {},
  methods: {
    async onLoad () {
      try {
        const { data } = await getComment({
          type: this.type,
          source: this.source.toString(),
          offset: this.offset,
          limit: this.limit
        })

        const { results } = data.data
        this.list.push(...results)
        this.$emit('onload-success', data.data)
        this.loading = false
        if (results.length) {
          this.offset = data.data.last_id
        } else {
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
