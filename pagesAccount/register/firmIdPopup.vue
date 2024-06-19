<script setup>
import { toWeChatAccount } from '../../utils'
import qr_code from '../../static/images/logins/qr_code.png'

const myPopup = ref(null)
const emits = defineEmits(['CloseClick'])
const { firmIdShow } = defineProps({
  firmIdShow: {
    type: Boolean,
    default: false
  },
})

// // firmIdShow
// watch(() => firmIdShow, (newVal) => {
//   if (newVal) {
//     setTimeout(() => {
//       myPopup.value.open("center")
//     }, 100)
//   } else {
//     setTimeout(() => {
//       myPopup.value.close()
//     }, 100)
//   }
// },
//   {
//     immediate: true,
//     deep: true
//   }
// )

onMounted(() => {
  myPopup.value.open("center")
})

const handlePopupsClose = () => {
  console.log("🚀 ~ handlePopupsClose ~ CloseClick:",)
  emits('CloseClick', false)
};

</script>

<template>
  <uni-popup ref="myPopup" type="dialog" :is-mask-click="false">
    <view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
      <view class="firmId_box">
        <view class="firmId_center">
          <view class="firmId_body">
            <image class="qr_code" :src="qr_code" mode="scaleToFill" />
            <view class="tips">
              <view class="tip">温馨提示</view>
              <view class="text">可扫码进入公众号或致电4008-4-96520</view>
            </view>
          </view>
          <button class="firmId_close_btn" @click="toWeChatAccount(qr_code)">保存二维码打开微信扫一扫</button>

          <view class="firmId_close">
            <image class="img_close" @tap="handlePopupsClose" src="http://116.62.107.90:8673/images/logins/close.png"
              mode="scaleToFill" />
          </view>
        </view>
      </view>
    </view>
  </uni-popup>
</template>
<style lang="scss" scoped>
// :deep(.popup-content) {
.popup-content {
  background-color: transparent !important;
  background: transparent !important;
  width: 527rpx;
  height: 777rpx;

  .firmId_box {
    width: 527rpx;
    height: 777rpx;
    border-radius: 20rpx;
    overflow: hidden;
    background-color: transparent !important;
    background: transparent !important;

    .firmId_center {
      width: 527rpx;
      height: 666rpx;
      background-color: transparent !important;
      background: url('http://116.62.107.90:8673/images/logins/firmId_box.png');
      background-size: 100% 100%;
      border-radius: 20rpx;
      position: relative;

      .firmId_body {
        display: flex;
        align-content: center;
        width: 95%;
        height: 50%;
        margin: 0 auto;
        padding-top: 200rpx;

        .qr_code {
          width: 180rpx;
          height: 180rpx;
          margin: auto 20rpx;
        }

        .tips {
          flex: 1;
          height: 180rpx;
          padding: 0 20rpx 0 0;
          margin: auto 0;

          .tip {
            width: 100%;
            margin-bottom: 10rpx;
            font-size: 34rpx;
            color: #000000;
            text-align: center;
          }

          .text {
            font-size: 26rpx;
            color: #B3B3B3;
          }

        }
      }

      .firmId_close_btn {
        width: 460rpx;
        height: 76rpx;
        margin: 0 auto;
        font-size: 30rpx;
        color: #FFFFFF;
        background: #469DFF;
        border-radius: 14rpx 14rpx 14rpx 14rpx;
        box-shadow: 5rpx 5rpx 14rpx 2rpx rgba(29, 75, 159, 0.14);
      }
    }
  }


  .firmId_close {
    display: flex;
    align-content: center;
    justify-content: center;
    width: 527rpx;
    height: 100rpx;
    background-color: transparent !important;
    position: absolute;
    bottom: -100rpx;
    left: 0;

    .img_close {
      width: 66rpx;
      height: 66rpx;
      margin-top: 30rpx;
    }
  }
}
</style>
