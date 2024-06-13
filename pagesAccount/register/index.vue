
<template>
  <wd-toast></wd-toast>
  <view class="register">
    <navbar :title="'注册账号'" />
    <view class="register_flow">
      <view class="tip">请选择账户类型：</view>
      <view class="flow_box">
        <view class="flow_item" v-for="(item, index) in flowList" :key="index" :class="{ is_active: item.is_active }"
          @tap="flowItemBtn(item)">
          <image :src="item.icon" mode="scaleToFill" />
          <text class="name">{{ item.name }}</text>
        </view>
      </view>
      <button class="registerBtn" @tap="registerBtn">下一步</button>
    </view>
  </view>
</template>

<script  setup>
import navbar from '@/pages/components/navbar.vue'
import firm from '../../static/images/logins/firm.png'
import personal from '../../static/images/logins/user.png'
import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库

const Toast = useToast()
const { safeAreaInsets } = uni.getSystemInfoSync() // 获取屏幕边界到安全区域距离
const flowList = ref([
  {
    name: '企业账号',
    icon: firm,
    path: '/pagesAccount/register/firm',
    is_active: false,
  },
  {
    name: '个人账号',
    icon: personal,
    path: '/pagesAccount/register/personal',
    is_active: false,
  },
])
const flowInfo = ref(null)

const flowItemBtn = (item) => {
  flowList.value.forEach((element) => {
    element.is_active = false
  })
  item.is_active = true
  flowInfo.value = item
}
const registerBtn = () => {
  if (!flowInfo.value) return Toast.warning('请先选择账户类型')
  uni.navigateTo({
    url: flowInfo.value.path,
  })
}
</script>

<style lang="scss" scoped>
.register {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f7f7fc;

  .register_flow {
    width: 90%;
    margin: 20rpx auto;

    .tip {
      width: 100%;
      height: 120rpx;
      font-size: 30rpx;
      line-height: 120rpx;
      color: #000000;
    }

    .flow_box {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      height: 800rpx;

      .flow_item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 185rpx;
        height: 200rpx;
        margin-right: 40rpx;
        background: #ffffff;
        border: 2rpx solid #fff;
        border-radius: 7rpx 7rpx 7rpx 7rpx;
        box-shadow: 0rpx 4rpx 7rpx 2rpx rgba(0, 0, 0, 0.16);

        image {
          width: 90rpx;
          height: 90rpx;
          margin-bottom: 30rpx;
        }

        .name {
          font-size: 26rpx;
          color: #000000;
        }
      }

      .is_active {
        border: 2rpx solid #1082ff;
      }
    }

    .registerBtn {
      width: 632rpx;
      height: 89rpx;
      margin: 0 auto;
      font-size: 36rpx;
      color: #ffffff;
      text-align: center;
      background: linear-gradient(90deg, #1082ff 0%, #5fa9ff 100%);
      border-radius: 14rpx 14rpx 14rpx 14rpx;
    }
  }
}
</style>
