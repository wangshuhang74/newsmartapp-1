<script lang="ts" setup>
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

onMounted(() => {
})
</script>
<template>
  <wd-toast></wd-toast>
  <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
    <view class="left" @tap="leftBtn">
      <!-- <wd-icon name="thin-arrow-left" class="left_icon" size="20px"></wd-icon> -->
      <image src="http://116.62.107.90:8673/images/icons/fhui.png" class="left_img" mode="scaleToFill" />
    </view>
    <view class="title">{{ title }}</view>
    <view class="right"></view>
  </view>
</template>

<style lang="scss" scoped>
.navbar {
  display: flex;
  -webkit-flex-shrink: 0;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 80rpx;
  background: linear-gradient(90deg, #4557d1 0%, #75dbed 100%);
  box-shadow: 0rpx 5rpx 11rpx 2rpx rgba(0, 0, 0, 0.09);

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
