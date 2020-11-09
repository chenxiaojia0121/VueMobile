<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="个人信息" left-arrow @click-left="$router.back()"></van-nav-bar>
    <!-- 个人信息 -->
    <input type="file" ref="file" hidden @change="onFileChange">
    <van-cell
      class="photo-cell"
      title="头像"
      is-link
      center
      @click="$refs.file.click()"
    >
      <van-image
        class="avatar"
        fit="cover"
        round
        :src="user.photo"
      />
    </van-cell>
    <van-cell
    title="昵称"
    is-link
    :value="user.name"
    @click="isUpdateNameShow = true"
    ></van-cell>
    <van-cell
    title="性别"
    :value="user.gender === 0 ? '男' : '女'"
    is-link
    @click="isUpdateGenderShow = true"></van-cell>
    <van-cell
    title="生日"
    :value="user.birthday"
    is-link
    @click="isUpdateBirthdayShow = true"></van-cell>
     <!-- 编辑昵称 -->
    <van-popup
      v-model="isUpdateNameShow"
      style="height: 100%;"
      position="bottom"
    >
      <updata-name
        v-if="isUpdateNameShow"
        v-model="user.name"
        @close="isUpdateNameShow = false"
      />
    </van-popup>
    <!-- 编辑性别 -->
    <van-popup
      v-model="isUpdateGenderShow"
      position="bottom"
    >
      <update-gender
        v-if="isUpdateGenderShow"
        v-model="user.gender"
        @close="isUpdateGenderShow = false"
      />
    </van-popup>
    <!-- 编辑生日 -->
    <van-popup
      v-model="isUpdateBirthdayShow"
      position="bottom"
    >
      <updata-birthday
        v-if="isUpdateBirthdayShow"
        v-model="user.birthday"
        @close="isUpdateBirthdayShow = false"
      />
    </van-popup>
    <!-- 编辑头像 -->
    <van-popup
      v-model="isUpdatePhotoShow"
      position="bottom"
      style="height: 100%;"
    >
      <updata-photo
        v-if="isUpdatePhotoShow"
        :img="img"
        @close="isUpdatePhotoShow = false"
        @update-photo="user.photo = $event"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/API/user'
import UpdataName from './components/updata-name'
import UpdateGender from './components/updata-gender'
import UpdataBirthday from './components/updata-birthday'
import UpdataPhoto from './components/updata-photo'
export default {
  name: '',
  components: {
    UpdataName,
    UpdataBirthday,
    UpdateGender,
    UpdataPhoto
  },
  props: {
  },
  data () {
    return {
      user: {},
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserProfile()
    console.log(this.user)
  },
  mounted () {},
  methods: {
    async loadUserProfile () {
      try {
        const { data } = await getUserProfile()
        this.user = data.data
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    onFileChange () {
      const file = this.$refs.file.files[0]
      const data = window.URL.createObjectURL(file)
      this.img = data
      this.isUpdatePhotoShow = true
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }

  .van-popup {
    background-color: #f5f7f9;
  }
  .photo-cell {
    .van-cell__value {
      display: flex;
      flex-direction: row-reverse;
    }
  }
  /deep/.van-nav-bar .van-icon {
    color: #fff;
  }
}
</style>
