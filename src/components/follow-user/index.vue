<template>
     <van-button
      v-if="articleData.is_followed"
      class="follow-btn"
      round
      :plain="true"
      color="#00d7cf"
      size="small"
      :loading="loading"
      @click="onFollow(articleData.aut_id)"
    >已关注</van-button>
    <van-button
      v-else
      class="follow-btn"
      type="info"
      color="#00d7cf"
      round
      size="small"
      icon="plus"
      :loading="loading"
      @click="onFollow(articleData.aut_id)"
    >关注</van-button>
</template>

<script>
import { addFollow, delFollow } from '@/API/user'
export default {
  name: 'FollowUser',
  components: {},
  props: {
    articleData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {},
  watch: {},
  created () {
    console.log(this.articleData)
  },
  mounted () {},
  methods: {
    async onFollow (id) {
      this.loading = true
      if (this.articleData.is_followed) {
        try {
          await delFollow(id)
          this.articleData.is_followed = false
          this.$toast('取消关注 ' + this.articleData.aut_name)
        } catch (err) {
          this.$toast('取消关注用户失败')
        }
      } else {
        try {
          await addFollow(id)
          this.articleData.is_followed = true
          this.$toast('已关注 ' + this.articleData.aut_name)
        } catch (err) {
          let message = '关注用户失败'
          if (err.response & err.response.status === 400) {
            message = '不可以关注自己'
          }
          this.$toast(message)
        }
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
.follow-btn follow-btn van-button van-button--info van-button--small van-button--round {
  color: rgb(255, 255, 255); background: rgb(0, 216, 206); border-color: rgb(0, 216, 206);
}
</style>
