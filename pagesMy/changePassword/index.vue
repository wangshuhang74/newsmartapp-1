<script setup>
import navbar from '@/pages/components/navbar.vue'
import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库
import { updPassword, sendCode } from '../../api'

import { useUserStore } from '@/store'
const userStore = useUserStore()
const { deviceId, userInfo } = storeToRefs(userStore)
const Toast = useToast()
const postForm = ref({
  oldPassword: null,//旧密码
  phone: '未获取到手机号,请重新登录后修改密码...',//手机号
  captcha: null,//验证码
  password: null,//密码
  repeatPwd: null,//确认密码
})

onLoad(() => {
  postForm.value.phone = userInfo.value.phone
})



const registerBtn = async () => {
  console.log("postForm", postForm.value);
  if (!postForm.value.oldPassword) return Toast.warning('请输入原密码')
  if (!postForm.value.password) return Toast.warning('请设置新密码')
  if (!postForm.value.repeatPwd) return Toast.warning('请确认新密码')
  if (postForm.value.password != postForm.value.repeatPwd) return Toast.warning('两次输入的密码不一致')
  if (!postForm.value.captcha) return Toast.warning('请输入验证码')
  console.log("postForm1", postForm.value);
  const { code, data, msg } = await updPassword(postForm.value)
  if (code != 0) return Toast.warning(msg)
  Toast.close()
  Toast.success('修改成功,正在登录中...')
  setTimeout(function () {
    userStore.loginInfo({
      phone: postForm.value.phone,
      password: postForm.value.password,
      isLastingCookie: false,
      phoneId: deviceId.value,
      platform: 1
    })
  }, 1000)
}

let timer;
const SendCodeFlag = ref(false)
const SendSecond = ref(60) // 倒计时
const SendCodeFn = async () => {
  if (!postForm.value.oldPassword) return Toast.warning('请输入原密码')
  if (!postForm.value.password) return Toast.warning('请设置新密码')
  if (!postForm.value.repeatPwd) return Toast.warning('请确认新密码')
  if (!postForm.value.phone) return Toast.warning('请输入手机号')
  if (!/^1[3456789]\d{9}$/.test(postForm.value.phone)) return Toast.warning('请输入正确的手机号')
  // if (SendSecond.value !== 60) return
  if (SendCodeFlag.value) return
  const { code, data, msg } = await sendCode(postForm.value.phone)
  if (code != 0) return Toast.warning(msg)
  SendCodeFlag.value = true
  Toast.success('验证码发送成功')
  timer = setInterval(() => {
    if (SendSecond.value > 0) {
      SendSecond.value--
    } else {
      SendCodeFlag.value = false
      SendSecond.value = 60
      clearInterval(timer)
    }
  }, 1000)
}





</script>

<template>
  <wd-toast></wd-toast>
  <view class="changePassword">
    <navbar :title="'修改密码'" />
    <view class="personal_flow">
      <view class="input_item">
        <view class="left_icon">
          <image style="width: 35rpx; height: 35rpx" src="http://116.62.107.90:8673/images/icons/mm_icon.png"></image>
        </view>
        <input v-model="postForm.oldPassword" type="text" class="input" placeholder="请输入原密码" />
      </view>

      <view class="input_item">
        <view class="left_icon">
          <image style="width: 35rpx; height: 35rpx" src="http://116.62.107.90:8673/images/icons/mm_icon.png"></image>
        </view>
        <input v-model="postForm.password" type="text" class="input" placeholder="请设置新密码" />
      </view>

      <view class="input_item">
        <view class="left_icon">
          <image style="width: 35rpx; height: 35rpx" src="http://116.62.107.90:8673/images/icons/mm_icon.png"></image>
        </view>
        <input v-model="postForm.repeatPwd" type="text" class="input" placeholder="请再次确认新密码" />
      </view>

      <view class="input_item">
        <view class="left_icon">
          <image src="http://116.62.107.90:8673/images/icons/phone_icon.png"></image>
        </view>
        <input v-model="postForm.phone" type="text" class="input" maxlength="11" disabled placeholder="请输入手机号" />
      </view>

      <view class="input_item">
        <view class="left_icon">
          <image src="http://116.62.107.90:8673/images/icons/yzm_icon.png"></image>
        </view>
        <input v-model="postForm.captcha" type="text" class="input" placeholder="请输入验证码" />
        <view class="code_box" @tap="SendCodeFn">
          <text v-if="SendCodeFlag">{{ SendSecond }}秒后重新发送</text>
          <text v-else>发送验证码</text>
        </view>
      </view>


      <button class="registerBtn" @tap="registerBtn">提交</button>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.changePassword {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f7f7fc;

  .personal_flow {
    flex: 1;
    width: 100;
    padding-bottom: 100rpx;
    overflow-y: scroll;

    .input_item {
      display: flex;
      align-items: center;
      width: 86%;
      height: 70rpx;
      margin: 30rpx auto 0 auto;
      border-bottom: 1px solid #b7bec8;

      &.address {
        margin: 30rpx auto 0 auto;
        border-bottom: none;

        input {
          height: 80rpx;
          margin-right: 30rpx;
          border: 1px solid #b7bec8;
        }
      }

      .left_icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 38rpx;
        height: 100%;
        margin: 0 20rpx 0 0;

        image {
          width: 38rpx;
          height: 38rpx;
        }
      }

      .input {
        box-sizing: border-box;
        flex: 1;
        padding: 0 10rpx;
        font-size: 28rpx;
        color: #000000;

        &::placeholder {
          font-size: 28rpx;
          color: #bfbfbf;
        }

        .uni-input-placeholder {
          color: #bfbfbf !important;
        }

        .input-placeholder {
          font-size: 28rpx;
          color: #bfbfbf !important;
        }

        :deep(.add_picker) {

          .wd-col-picker__field {
            background-color: transparent !important;
          }

          .wd-col-picker__cell {
            padding-left: 0 !important;
            background-color: transparent !important;
          }

          .wd-col-picker__value {
            font-size: 28rpx;
          }

          .wd-icon {
            display: none !important;
          }

        }

      }

      .code_box {
        width: 250rpx;
        height: 60rpx;
        font-size: 28rpx;
        line-height: 70rpx;
        color: #1082ff;
        text-align: right;
      }
    }

    .up_img_box {
      width: 86%;
      height: 450rpx;
      margin: 30rpx auto 0 auto;

      .title {
        width: 100%;
        height: 60rpx;
        font-size: 30rpx;
        line-height: 60rpx;
        color: #1082FF;
      }

      .up_box {
        position: relative;
        width: 100%;
        height: 380rpx;
        padding: 2rpx;
        border: 4rpx solid #1082FF;

        .license {
          width: 100%;
          height: 100%;
        }

        .add_icon {
          position: absolute;
          top: calc(50% - 44rpx);
          left: calc(50% - 44rpx);
          width: 88rpx;
          height: 88rpx;
        }
      }
    }

    .registerBtn {
      width: 86%;
      height: 89rpx;
      margin: 40rpx auto;
      margin-top: 300rpx;
      font-size: 34rpx;
      color: #FFFFFF;
      background: linear-gradient(90deg, #1082FF 0%, #5FA9FF 100%);
    }

  }
}
</style>