<script setup>
import navbar from '@/pages/components/navbar.vue'
import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库
import { toNavigation, makePhoneCall, debounce } from '@/utils'
import { useWorkStore } from '@/store'
const { workDetail } = storeToRefs(useWorkStore())
const Toast = useToast()
const workInfo = ref({})

onMounted(() => {
  if (!workDetail.value) {
    workInfo.value = workDetail.value
    console.log("🚀 ~ onLoad ~ workDetail.value:", workDetail.value)
  } else {
    Toast.warning("没有找到该工单信息")
    setTimeout(() => {
      uni.navigateBack({
        delta: 1
      })
    }, 1000)
  }
})

</script>
<template>
  <wd-toast></wd-toast>
  <view class="workDetails">
    <navbar :title="'详情'" />
    <view class="details_center">

    </view>
  </view>
</template>
<style lang="scss" scoped>
.workDetails {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f7f7fc;

  .details_center {
    flex: 1;

  }

}
</style>