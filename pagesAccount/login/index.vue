<script setup>

import { useUserStore } from '@/store'
import { useNotify, useToast, useMessage } from "wot-design-uni"; // ui组件库
import zhengyan from '../../static/images/icons/zhengyan.png'
import biyan from '../../static/images/icons/biyan.png'

const Toast = useToast()
const { safeAreaInsets } = uni.getSystemInfoSync() // 获取屏幕边界到安全区域距离
const userStore = useUserStore()
const { userInfo, deviceId, loginForm } = storeToRefs(userStore)
const visible = ref(false)
const postForm = ref({
  phone: null,
  password: null,
  isLastingCookie: false,
  phoneId: null,
  platform: 1
})

onLoad(() => {
  if (loginForm.value.isLastingCookie) {
    postForm.value.phone = loginForm.value.phone
    postForm.value.password = loginForm.value.password
    postForm.value.isLastingCookie = loginForm.value.isLastingCookie
  }
  uni.getSystemInfo({
    success: (res) => {
      deviceId.value = res.deviceId
      postForm.value.phoneId = res.deviceId
    },
    fail: (err) => {
      console.log("获取系统信息失败", err);
    },
  });
})



const loginBtn = async () => {
  if (!postForm.value.phone) {
    return Toast.warning('请输入用户名或手机号')
  }
  if (!postForm.value.password) {
    return Toast.warning('请输入登录密码')
  }
  if (postForm.value.isLastingCookie) {
    loginForm.value = postForm.value
  } else {
    loginForm.value = {}
  }
  Toast.loading("登录中...")
  setTimeout(() => {
    Toast.close()
  }, 10000)
  const { code, data, msg } = await userStore.loginInfo(postForm.value)
  if (code != 0) return Toast.warning(msg)
  Toast.close()
}

const passwordChange = ({ value }) => {
  console.log('value', value)
}

const forgetBtn = () => {
  console.log("忘记密码");
  uni.navigateTo({
    url: '/pagesAccount/forgetPassword/index',
  })
}

const registerBtn = () => {
  console.log("去注册");
  uni.navigateTo({
    url: '/pagesAccount/register/index',
  })
}

const visibleBtn = () => {
  console.log("🚀 ~ visibleBtn ~ visible.value1 :", visible.value)
  visible.value = !visible.value
  console.log("🚀 ~ visibleBtn ~ visible.value2 :", visible.value)
}

</script>
<template>
  <wd-toast></wd-toast>
  <view class="login_box">
    <view class="top_box" :style="{ paddingTop: safeAreaInsets?.top + 'px', height: safeAreaInsets?.top + 250 + 'px' }">
      <image class="logo" src="http://116.62.107.90:8673/images/logins/logo.png" mode="scaleToFill" />
      <view class="title">智慧运维</view>
    </view>

    <view class="forms">
      <view class="input_item">
        <image src="http://116.62.107.90:8673/images/icons/user.png" mode="scaleToFill" class="input_icon" />
        <input v-model="postForm.phone" placeholder="请输入用户名/手机号" />
        <image v-if="postForm.phone" src="http://116.62.107.90:8673/images/icons/clear.png" mode="scaleToFill"
          class="input_icon" @tap="postForm.phone = ''" />
      </view>
      <view class="input_item">
        <image src="http://116.62.107.90:8673/images/icons/password.png" mode="scaleToFill" class="input_icon" />
        <input v-if="visible" type="text" v-model="postForm.password" placeholder="请输入登录密码" />
        <input v-else type="password" v-model="postForm.password" placeholder="请输入登录密码" />
        <image v-if="postForm.password" src="http://116.62.107.90:8673/images/icons/clear.png" mode="scaleToFill"
          class="input_icon" @tap="postForm.password = ''" />
        <image v-if="postForm.password" :src="visible ? zhengyan : biyan" mode="scaleToFill" class="input_visible"
          @tap="visibleBtn" />
      </view>

      <view class="bottom_box">
        <wd-checkbox v-model="postForm.isLastingCookie" @change="passwordChange">记住密码</wd-checkbox>
        <text class="forget" @tap="forgetBtn">忘记密码?</text>
      </view>
      <button class="loginBtn" @tap="loginBtn">登录</button>
      <view class="register_text" @tap="registerBtn">没有账号？去注册</view>
    </view>


  </view>
</template>
<style lang="scss" scoped>
.login_box {
  width: 100%;
  height: 100vh;
  overflow: hidden;

  .forms {
    width: calc(100% - 120rpx);
    min-height: 500rpx;
    margin: 0 auto;

    .input_item {
      display: flex;
      align-items: center;
      width: 100%;
      height: 80rpx;
      margin-bottom: 30rpx;
      border-bottom: 1px solid #EBEBEB;

      &:last-child {
        margin-bottom: 0 !important;
      }

      input {
        flex: 1;
        height: 100%;
        border: none;
      }

      .input_icon {
        width: 40rpx;
        height: 40rpx;
        margin: 0 20rpx 0 0;
      }

      .input_visible {
        width: 50rpx;
        height: 32rpx;
        margin: 0 20rpx 0 0;
      }
    }

    .bottom_box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 30rpx;
      line-height: 30rpx;

      .forget {
        font-size: 26rpx;
        font-weight: 400;
        color: #1082FF;
      }
    }

    .loginBtn {
      width: 100%;
      height: 89rpx;
      margin-top: 200rpx;
      font-size: 36rpx;
      color: #FFFFFF;
      background: linear-gradient(90deg, #1082FF 0%, #5FA9FF 100%);
      border-radius: 14rpx 14rpx 14rpx 14rpx;
    }

    .register_text {
      display: flex;
      justify-content: center;
      width: 100%;
      margin: 20rpx 0;
      font-size: 26rpx;
      color: #1082FF;
    }

  }

  .top_box {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 550rpx;
    margin-bottom: 80rpx;
    background: linear-gradient(90deg, #4557D1 0%, #75DBED 100%);
    background: url('http://116.62.107.90:8673/images/logins/login_top.png') no-repeat;
    background-size: 100% 100%;

    .logo {
      width: 130rpx;
      height: 130rpx;
      margin: 80rpx 0 20rpx 0;
    }

    .title {
      font-size: 36rpx;
      font-weight: bold;
      color: #FFFFFF;
    }

  }
}
</style>
