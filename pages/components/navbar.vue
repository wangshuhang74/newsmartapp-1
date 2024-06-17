<script setup>
import { getdeviceInfo } from "../../utils/deviceInfo";
const { safeAreaInsets } = uni.getSystemInfoSync()
const emits = defineEmits(['navbarClick'])
const { title } = defineProps({
  title: {
    type: String,
    default: '',
  },
})

const leftBtn = () => {
  console.log('leftBtn')
  uni.navigateBack()
}
// 获取导航栏信息
const { globalData, custom } = reactive(getdeviceInfo());
onMounted(() => {
})


</script>
<template>
  <wd-toast></wd-toast>
  <!-- #ifdef APP-PLUS -->
  <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
    <view class="left" @tap="leftBtn">
      <!-- <wd-icon name="thin-arrow-left" class="left_icon" size="20px"></wd-icon> -->
      <image src="http://116.62.107.90:8673/images/icons/fhui.png" class="left_img" mode="scaleToFill" />
    </view>
    <view class="title">{{ title }}</view>
    <view class="right"></view>
  </view>
  <!-- #endif -->

  <!-- #ifdef MP-WEIXIN -->
  <view class="navbar" :style="{ paddingTop: globalData.customTop + 'px', height: `${globalData.navHeight}px` }">
    <view class="left" @tap="leftBtn">
      <!-- <wd-icon name="thin-arrow-left" class="left_icon" size="20px"></wd-icon> -->
      <image src="http://116.62.107.90:8673/images/icons/fhui.png" class="left_img" mode="scaleToFill" />
    </view>
    <view class="title">{{ title }}</view>
    <view class="right"></view>
  </view>
  <!-- #endif -->
</template>

<style lang="scss" scoped>
.navbar {
  display: flex;
  -webkit-flex-shrink: 0;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  // #ifdef APP-PLUS
  height: 80px;
  // #endif
  background: linear-gradient(90deg, #4557d1 0%, #75dbed 100%);
  box-shadow: 0rpx 5rpx 11rpx 2rpx rgba(0, 0, 0, 0.09);
  box-sizing: border-box;

  .left {
    width: 80rpx;
    margin-left: 20rpx;
    // #ifdef MP-WEIXIN
    // #endif


    .left_img {
      width: 40rpx;
      height: 40rpx;
    }


    .left_icon {
      margin-left: 20rpx;
      color: #ffffff !important;


    }
  }

  .title {
    flex: 1;
    font-size: 34rpx;
    font-weight: bold;
    color: #ffffff;
    text-align: center;
  }

  .right {
    width: 100rpx;
  }
}
</style>
