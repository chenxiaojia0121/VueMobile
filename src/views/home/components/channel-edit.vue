<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell>
      <div slot="title" class="title-text">我的频道</div>
      <van-button type="danger" plain round size="mini" class="edit-btn" @click="isEdit = !isEdit"
      >{{ isEdit ? '完成' : '编辑' }}</van-button>
    </van-cell>
    <van-grid :gutter="10" class="my-grid">
    <van-grid-item v-for="(channel,index) in myChannels" class="grid-item" :key="index" :text="channel.name" @click="onMychannelClick(channel, index)">
      <van-icon
          v-show="isEdit && !fiexdChannels.includes(channel.id)"
          slot="icon"
          name="clear"
        ></van-icon>
      <span class="text" slot="text" :class="{ active: index === active}">{{channel.name}}</span>
    </van-grid-item>
    </van-grid>
    <!-- 频道推荐 -->
    <van-cell>
      <div slot="title">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10"  class="recommend-grid">
    <van-grid-item class="grid-item" v-for="(channel, index) in recommendChannels"  :key="index" :text="channel.name" icon="plus" @click="onAddChannel(channel)"/>
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels, addUserChannel, deleteUserChannel
} from '@/API/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  name: 'ChannelEdit',
  data () {
    return {
      isEdit: false,
      allChannels: [],
      fiexdChannels: []
    }
  },
  methods: {
    async loadChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch {
        this.$toast('数据获取失败')
      }
    },
    async onAddChannel (channel) {
      this.$emit('addChannel', channel)
      // this.myChannels.push(channel)
      if (this.user) {
        try {
          // 已登录，把数据请求接口放到线上
          await addUserChannel({
            id: channel.id,
            seq: this.myChannels.length // 编号为我的频道的数量
          })
        } catch (err) {
          this.$toast('保存失败，请稍后重试')
        }
      } else {
        // 未登录，把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    onMychannelClick (channel, index) {
      if (this.isEdit) {
        // 编辑状态
        if (this.fiexdChannels.includes(channel.id)) {
          return
        }
        this.myChannels.splice(index, 1)
        if (index <= this.active) {
          this.$emit('updata-active', this.active - 1, true)
        }
        this.deleteChannel(channel)
      } else {
        // 非编辑状态
        this.$emit('updata-active', index, false)
      }
    },
    async deleteChannel (channel) {
      try {
        if (this.user) {
          await deleteUserChannel(channel.id)
        } else {
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('删除失败，请稍后重试')
      }
    }
  },
  computed: {
    ...mapState(['user']),
    recommendChannels () {
      // const channels = []
      // this.allChannels.forEach(channel => {
      //   const ret = this.myChannels.find(myChannel => {
      //     return myChannel.id === channel.id
      //   })
      //   if (!ret) {
      //     channels.push(channel)
      //   }
      // })
      // return channels
      return this.allChannels.filter(channel => {
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
      })
    }
  },
  created () {
    this.loadChannels()
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;

  .title-text {
    font-size: 32px;
    color: #333333;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #09d6cf;
    border: 1px solid #09d6cf;
  }

  /deep/.grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,   .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: #00b0b0;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
