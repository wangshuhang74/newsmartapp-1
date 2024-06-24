<script setup>
import navbar from '@/pages/components/navbar.vue'
import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库
import { useWorkStore } from '@/store'
import { appDisposeOrder } from '@/api'

const { workHandle } = storeToRefs(useWorkStore())
const Toast = useToast()
const workInfo = ref({})

const postForm = ref({
  orderId: null,
  flowInfo: {
    taskId: null,
    instanceId: null
  }
})

onMounted(() => {
  if (workHandle.value) {
    workInfo.value = workHandle.value
    postForm.value.orderId = workHandle.value.orderId
    postForm.value.flowInfo.taskId = workHandle.value.taskId
    postForm.value.flowInfo.instanceId = workHandle.value.instanceId
    console.log("🚀 ~ onLoad ~ workHandle.value:", workHandle.value)
  } else {
    Toast.warning("没有找到该工单信息")
    setTimeout(() => {
      uni.navigateBack({
        delta: 1
      })
    }, 1000)
  }
})


const submitBtn = async () => {
  console.log("🚀 ~ submitBtn ~ postForm.value:", postForm.value)
  const { code, data, msg } = await appDisposeOrder(postForm.value)
  if (code != 0) return Toast.error(msg)
  Toast.success("提交成功")
  //关闭当前页面 跳转上一个页面
  setTimeout(() => {
    uni.navigateBack({
      delta: 1
    })
  }, 1000)
}

</script>
<template>
  <wd-toast></wd-toast>
  <view class="handleWork">
    <navbar :title="'处理工单'" />
    <view class="details_center">
      <button class="submit_button" @tap="submitBtn"> 提交工单 </button>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.handleWork {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f7f7fc;

  .details_center {
    flex: 1;

    .submit_button {
      margin: 800rpx auto;
      min-width: 178rpx;
      max-width: 250rpx;
      height: 66rpx;
      background: linear-gradient(126deg, #4557D1 0%, #75DBED 100%);
      border-radius: 26rpx 26rpx 26rpx 26rpx;
      font-size: 30rpx;
      text-align: center;
      line-height: 66rpx;
      color: #FFFFFF;
    }
  }

}
</style>