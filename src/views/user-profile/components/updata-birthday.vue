<template>
  <div class="update-birthday">
    <van-datetime-picker
    v-model="currentDate"
    type="date"
    title="选择您的生日"
    :min-date="minDate"
    :max-date="maxDate"
    @cancel="$emit('close')"
    @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/API/user'
import dayjs from 'dayjs'
export default {
  name: '',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const data = dayjs(this.currentDate).format('YYYY-MM-DD')
        await updateUserProfile({
          birthday: data
        })
        this.$emit('input', data)
        this.$emit('close')
        this.$toast.success('修改生日成功')
      } catch (err) {
        this.$toast.fail('修改生日失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
