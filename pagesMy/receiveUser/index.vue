<script  setup>
import navbar from '@/pages/components/navbar.vue'
import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库
const Toast = useToast()

</script>
<template>
  <wd-toast></wd-toast>
  <view class="receiveUser">
    <navbar :title="'用户收款'" />
    <view class="receive_flow">

    </view>
  </view>
</template>
<style lang="scss" scoped>
.receiveUser {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f7f7fc;

  .receive_flow {
    flex: 1;
    width: 100;
    padding-bottom: 100rpx;
    overflow-y: scroll;
  }
}
</style>