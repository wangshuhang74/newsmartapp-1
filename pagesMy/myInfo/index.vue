<script  setup>
import navbar from '@/pages/components/navbar.vue'
import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库
const Toast = useToast()


onLoad(() => {
})



</script>

<template>
  <wd-toast></wd-toast>
  <view class="info_box">
    <navbar :title="'个人档案'" />
    <view class="info_flow">

    </view>
  </view>
</template>
<style lang="scss" scoped>
.info_box {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f7f7fc;

  .info_flow {
    flex: 1;
    width: 100;
    padding-bottom: 100rpx;
    overflow-y: scroll;
  }
}
</style>