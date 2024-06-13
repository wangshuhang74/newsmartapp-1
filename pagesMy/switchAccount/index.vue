<script  setup>
import navbar from '@/pages/components/navbar.vue'
import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库
const Toast = useToast()

</script>
<template>
  <wd-toast></wd-toast>
  <view class="switchAccount">
    <navbar :title="'切换账号'" />
    <view class="switch_flow">

    </view>
  </view>
</template>
<style lang="scss" scoped>
.switchAccount {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f7f7fc;

  .switch_flow {
    flex: 1;
    width: 100;
    padding-bottom: 100rpx;
    overflow-y: scroll;
  }
}
</style>