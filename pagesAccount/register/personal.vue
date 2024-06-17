<script setup>
import navbar from '@/pages/components/navbar.vue'
import qr_code from '../../static/images/logins/qr_code.png'

import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库
import { addUser, sendCode } from '../../api'
import { useUserStore } from '@/store'
const userStore = useUserStore()
const { deviceId, } = storeToRefs(userStore)
const Toast = useToast()
const postForm = ref({
  repeatPwd: null,//确认密码
  phone: null,//登录手机号
  captcha: null,//验证码
  password: null,//密码
  orgId: null, // 企业ID
  userName: null // 用户名
})
const firmIdShow = ref(null);

onLoad(() => {
  console.log("🚀 ~ onLoad ~ deviceId.value:", deviceId.value)
})



const registerBtn = async () => {
  console.log("postForm", postForm.value);
  if (!postForm.value.captcha) return Toast.warning('请输入验证码')
  if (!postForm.value.password) return Toast.warning('请输入密码')
  if (!postForm.value.repeatPwd) return Toast.warning('请确认密码')
  if (postForm.value.password != postForm.value.repeatPwd) return Toast.warning('两次输入的密码不一致')
  if (!postForm.value.orgId) return Toast.warning('请输入企业ID')
  console.log("postForm1", postForm.value);
  const { code, data, msg } = await addUser(postForm.value)
  if (code != 0) return Toast.warning(msg)
  Toast.success('注册成功,正在登录中...')
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
const SendCodeFn = () => {
  if (!postForm.value.phone) return Toast.warning('请输入手机号')
  if (!/^1[3456789]\d{9}$/.test(postForm.value.phone)) return Toast.warning('请输入正确的手机号')
  if (SendSecond.value !== 60) return
  if (SendCodeFlag.value) return
  SendCodeFlag.value = true
  SendCodeApi()
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


const SendCodeApi = async () => {
  //调用验证码接口 postForm.value.phone
  const { code, data, msg } = await sendCode(postForm.value.phone)
  if (code == 0) {
    Toast.success('验证码发送成功')
  } else {
    Toast.warning(msg)
    SendCodeFlag.value = false
    SendSecond.value = 60
    clearInterval(timer)
  }
}

const noFirmId = () => {
  console.log("noFirmId");
  firmIdShow.value = true
}

const handlePopupsClose = () => {
  firmIdShow.value = false
};

const toWeChatAccount = () => {
  // qr_code
  // uni.showLoading({
  //   title: '加载中...'
  // });
  uni.downloadFile({ //下载文件资源到本地,返回文件的本地临时路径
    url: qr_code, //网络二维码路径
    success: (res) => {
      var imageUrl = res.tempFilePath;//临时文件路径
      // console.log("imageUrl", imageUrl);
      uni.saveImageToPhotosAlbum({ //保存二维码到系统相册
        filePath: qr_code,
        success: (res) => {
          Toast.success('二维码保存成功');
          firmIdShow.value = false
        },
        fail: (err) => {
          Toast.error('二维码保存失败');
        }
      })
    }
  })
}



</script>

<template>
  <wd-toast></wd-toast>
  <view class="register_personal">
    <navbar :title="'注册个人账号'" />
    <view class="personal_flow">
      <view class="input_item">
        <view class="left_icon">
          <image src="http://116.62.107.90:8673/images/icons/phone_icon.png"></image>
        </view>
        <input v-model="postForm.phone" type="text" class="input" maxlength="11" placeholder="请输入手机号" />
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

      <view class="input_item">
        <view class="left_icon">
          <image style="width: 35rpx; height: 35rpx" src="http://116.62.107.90:8673/images/icons/mm_icon.png"></image>
        </view>
        <input v-model="postForm.password" type="text" class="input" placeholder="登陆密码，8-16位字母或者数字" />
      </view>

      <view class="input_item">
        <view class="left_icon">
          <image style="width: 35rpx; height: 35rpx" src="http://116.62.107.90:8673/images/icons/mm_icon.png"></image>
        </view>
        <input v-model="postForm.repeatPwd" type="text" class="input" placeholder="请再次输入密码" />
      </view>

      <view class="input_item">
        <view class="left_icon">
          <image style="width: 35rpx; height: 35rpx" src="http://116.62.107.90:8673/images/icons/qy_icon.png"></image>
        </view>
        <input v-model="postForm.orgId" type="text" class="input" placeholder="请输入企业ID" />
        <view class="code_box" @tap="noFirmId">
          <text style="text-decoration: underline;">无企业ID?</text>
        </view>
      </view>

      <button class="registerBtn" @tap="registerBtn">注册并登录</button>
    </view>
  </view>
  <wd-popup v-model="firmIdShow" :close-on-click-modal="false" @close="handlePopupsClose">
    <view class="firmId_box">
      <view class="centerr">
        <image class="qr_code" :src="qr_code" mode="scaleToFill" />
        <view class="tips">
          <view class="tip">温馨提示</view>
          <view class="text">可扫码进入公众号或致电4008-4-96520</view>
        </view>
      </view>
      <!-- <button class="firmId_close_btn" @click="toWeChatAccount">进入公众号</button> -->
      <button class="firmId_close_btn" @click="toWeChatAccount">保存二维码打开微信扫一扫</button>
    </view>
    <view class="firmId_close">
      <image class="img_close" @tap="handlePopupsClose" src="http://116.62.107.90:8673/images/logins/close.png"
        mode="scaleToFill" />
    </view>
  </wd-popup>
</template>
<style lang="scss" scoped>
.register_personal {
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
      margin-top: 200rpx;
      font-size: 34rpx;
      color: #FFFFFF;
      background: linear-gradient(90deg, #1082FF 0%, #5FA9FF 100%);
    }

  }
}

:deep(.wd-popup) {
  background-color: transparent !important;
}

.wd-popup {
  background-color: transparent !important;

  .firmId_box {
    width: 527rpx;
    height: 672rpx;
    overflow: hidden;
    background: url('http://116.62.107.90:8673/images/logins/firmId_box.png');
    background-size: 100% 100%;
    border-radius: 20rpx;

    .centerr {
      display: flex;
      align-content: center;
      width: 95%;
      height: 45%;
      margin: 45% auto 0 auto;

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

  .firmId_close {
    display: flex;
    align-content: center;
    justify-content: center;
    width: 527rpx;
    height: 100rpx;
    background-color: transparent !important;

    .img_close {
      width: 66rpx;
      height: 66rpx;
      margin-top: 30rpx;
    }
  }
}
</style>