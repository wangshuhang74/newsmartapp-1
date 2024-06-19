<script setup>
import '@/uni.scss'
import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库
import { toNavigation, makePhoneCall, debounce } from '@/utils'

const Toast = useToast()
const { safeAreaInsets } = uni.getSystemInfoSync()

const getForm = ref({
  search: null
})

const searchInput = debounce(() => {
  console.log('searchInput', getForm.value.search);
}, 1000); // 第二个参数是延迟时间，单位为毫秒
const leftBtn = () => {
  console.log('leftBtn')
  uni.navigateBack()
}

const scanBtn = () => {
  uni.scanCode({
    success: (res) => {
      console.log("res", res);
    },
    fail: (err) => {
      console.log("err", err);
    }
  })
}

const scrollBottom = () => {
  console.log('触底了')
  Toast.loading('加载中...')
  setTimeout(() => {
    Toast.close()
  }, 2000)
}


</script>

<template>
  <wd-toast></wd-toast>
  <view class="oldMaintain">
    <view class="top_box" :style="{ paddingTop: safeAreaInsets?.top + 'px', height: safeAreaInsets?.top + 124 + 'px' }">
      <view class="title_box">
        <view class="left" @tap="leftBtn">
          <!-- <wd-icon name="thin-arrow-left" class="left_icon" size="20px"></wd-icon> -->
          <image src="http://116.62.107.90:8673/images/icons/fhui.png" class="left_img" mode="scaleToFill" />
        </view>
        <text class="title">维护车辆</text>
        <view class="right"></view>

      </view>
      <view class="search_box">
        <view class="search">
          <image class="search_img" src="http://116.62.107.90:8673/images/homeMap/search.png" mode="scaleToFill" />
          <input type="text" v-model="getForm.search" placeholder="搜索" @input="searchInput">
          <image class="qr_img" src="http://116.62.107.90:8673/images/fn/qr_img.png" @tap="scanBtn"
            mode="scaleToFill" />
        </view>
      </view>
    </view>

    <scroll-view class="list_box" :scroll-y="true" @scrolltolower="scrollBottom" :show-scrollbar="false">
      <view class="work_item" v-for="(item, idx) in 10">
        <view class="work_top">
          <image src="http://116.62.107.90:8673/images/fns/map.png" class="work_icon" mode="scaleToFill" />
          <view class="work_title">
            <text class="tit">客户名称-车牌号码/VIN码</text>
            <!-- <text class="tags tag1">待接单</text> -->
            <!-- <text class="tags tag2">待新装</text> -->
            <text class="tags tag3">待运维</text>
          </view>
          <image src="http://116.62.107.90:8673/images/icons/item_arrow.png" class="item_arrow" mode="scaleToFill" />
        </view>
        <view class="work_center " :class="{ no: idx % 2 == 0 }">
          <view class="work_it">
            <view class="label">联系人:</view>
            <view class="value">张三</view>
          </view>

          <view class="work_it">
            <view class="label">联系电话:</view>
            <view class="value isImg">
              <text>13828282828</text>
              <image class="position_img" src="http://116.62.107.90:8673/images/homeMap/phone.png"
                @tap="makePhoneCall(19815103583)" mode="scaleToFill" />
            </view>
          </view>


          <view class="work_it">
            <view class="label">新装设备:</view>
            <view class="value">行车记录仪行车记录仪行车记录仪行车记录仪行车记录仪</view>
          </view>

          <view class="work_it">
            <view class="label">地址:</view>
            <view class="value isImg">
              <text>阳光大道238号阳光大道238号阳光大道238号</text>
              <image class="position_img" src="http://116.62.107.90:8673/images/homeMap/address.png" @tap="toNavigation"
                mode="scaleToFill" />
            </view>
          </view>

          <view class="work_it">
            <view class="label">设备型号:</view>
            <view class="value">XT001</view>
          </view>

          <view class="work_it">
            <view class="label">设备序列号:</view>
            <view class="value">XT001</view>
          </view>


        </view>
        <view class="btn_box" v-if="idx % 2 != 0">
          <view class="btn">返还</view>
          <view class="btn">接单</view>
          <view class="btn">处理</view>
        </view>
      </view>
    </scroll-view>


  </view>
</template>

<style lang="scss" scoped>
.oldMaintain {
  width: 100%;
  height: 100vh;
  background-color: #f7f7fc;
  overflow: hidden;


  .top_box {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    padding-bottom: 20rpx;
    background: linear-gradient(90deg, #4557D1 0%, #75DBED 100%);
    box-shadow: 0rpx 5rpx 11rpx 2rpx rgba(0, 0, 0, 0.09);

    .search_box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: calc(100% - 60rpx);
      // height: 100%;
      margin-top: 10rpx;

      .search {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 680rpx;
        height: 66rpx;
        background: #FBFBFB;
        border: 2rpx solid #F4F4F5;
        border-radius: 30rpx 30rpx 30rpx 30rpx;


        .search_img {
          width: 32rpx;
          height: 32rpx;
          margin: 0 10rpx 0 30rpx;
        }

        .qr_img {
          width: 38rpx;
          height: 38rpx;
          margin: 0 30rpx 0 10rpx;
        }

        input {
          flex: 1;
          height: 100%;
          padding-left: 10rpx;
          font-size: 24rpx;
          color: #333333;
        }
      }

    }

    .title_box {
      width: 100%;
      height: 60rpx;
      font-size: 33rpx;
      line-height: 80rpx;
      color: #FFFFFF;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20rpx;


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
  }

}
</style>