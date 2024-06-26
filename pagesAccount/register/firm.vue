<script setup>
import navbar from '@/pages/components/navbar.vue'
import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库
import areaData from '../../utils/areaData.json'
import { addOrgUser, sendCode } from '../../api'

import { useUserStore } from '@/store'
import { baseURL } from '../../utils/http'
const userStore = useUserStore()
const { deviceId, } = storeToRefs(userStore)
const Toast = useToast()
const postForm = ref({
  phone: null,//手机号
  captcha: null,//验证码
  password: null,//密码
  repeatPwd: null,//确认密码
  creditCode: null,//统一社会信用代码
  orgName: null,//企业名称
  orgShortName: null,//企业简称
  dutyUser: null,//联系人
  email: null,//邮箱
  area: null,//企业区域行政区码
  address: null,//企业详细地址
  license: null,//营业执照
})

onLoad(() => {
})



const areaValue = ref([]) // 区域
const area = ref([
  Object.keys(areaData[86]).map((key) => {
    return {
      value: key,
      label: areaData[86][key]
    }
  })
])

const columnChange = ({ selectedItem, resolve, finish }) => {
  if (areaData[selectedItem.value]) {
    resolve(
      Object.keys(areaData[selectedItem.value]).map((key) => {
        return {
          value: key,
          label: areaData[selectedItem.value][key]
        }
      })
    )
  } else {
    finish()
  }
}

function handleConfirm({ value }) {
  console.log('area-value', value)
  postForm.value.area = value[2]
}

const registerBtn = async () => {
  console.log("postForm", postForm.value);
  if (!postForm.value.captcha) return Toast.warning('请输入验证码')
  if (!postForm.value.password) return Toast.warning('请输入密码')
  if (!postForm.value.repeatPwd) return Toast.warning('请确认密码')
  if (postForm.value.password != postForm.value.repeatPwd) return Toast.warning('两次输入的密码不一致')
  if (!postForm.value.creditCode) return Toast.warning('请输入统一社会信用代码')
  if (!postForm.value.orgName) return Toast.warning('请输入企业名称')
  if (!postForm.value.orgShortName) return Toast.warning('请输入企业简称')
  if (!postForm.value.dutyUser) return Toast.warning('请输入联系人')
  if (!postForm.value.email) return Toast.warning('请输入邮箱')
  if (!postForm.value.area) return Toast.warning('请选择所属区域')
  if (!postForm.value.address) return Toast.warning('请输入详细地址')
  if (!postForm.value.license) return Toast.warning('请上传营业执照')
  const { code, data, msg } = await addOrgUser(postForm.value)
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

const handleUploadLicense = async () => {
  uni.chooseImage({
    count: 1,
    sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
    sourceType: ["album", "camera"], //从相册选择或者拍照
    success: function (res) {
      const tempFilePaths = res.tempFilePaths;
      uni.uploadFile({
        url: `${baseURL}sysFile/uploadFile`,
        filePath: tempFilePaths[0],
        name: "file",
        formData: {
          // datePath: "",
        },
        success: (uploadFileRes) => {
          const { code, data } = JSON.parse(uploadFileRes.data);
          console.log("🚀 ~ handleUploadLicense ~ data:", data)
          postForm.value.license = data.url
        },
      });
    },
  });
}

let timer;
const SendCodeFlag = ref(false)
const SendSecond = ref(60) // 倒计时
const SendCodeFn = async () => {
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
</script>

<template>
  <wd-toast></wd-toast>
  <view class="register_firm">
    <navbar :title="'注册企业账号'" />
    <view class="firm_flow">
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
          <image src="http://116.62.107.90:8673/images/icons/dm_icon.png"></image>
        </view>
        <input v-model="postForm.creditCode" type="text" class="input" placeholder="请输入统一信用代码" />
      </view>

      <view class="input_item">
        <view class="left_icon">
          <image src="http://116.62.107.90:8673/images/icons/qy_icon.png"></image>
        </view>
        <input v-model="postForm.orgName" type="text" class="input" placeholder="请输入企业名称" />
      </view>

      <view class="input_item">
        <view class="left_icon">
          <image src="http://116.62.107.90:8673/images/icons/qy_icon.png"></image>
        </view>
        <input v-model="postForm.orgShortName" type="text" class="input" placeholder="请输入企业简称" />
      </view>

      <view class="input_item">
        <view class="left_icon">
          <image style="width: 45rpx; height: 45rpx" src="http://116.62.107.90:8673/images/icons/lxr_icon.png"></image>
        </view>
        <input v-model="postForm.dutyUser" type="text" class="input" placeholder="请输入联系人" />
      </view>

      <view class="input_item">
        <view class="left_icon">
          <image style="width: 35rpx; height: 35rpx" src="http://116.62.107.90:8673/images/icons/yx_icon.png"></image>
        </view>
        <input v-model="postForm.email" type="text" class="input" placeholder="请输入电子邮箱" />
      </view>

      <view class="input_item">
        <view class="left_icon">
          <image style="width: 40rpx; height: 43rpx" src="http://116.62.107.90:8673/images/icons/dw_icon.png"></image>
        </view>
        <view class="input">
          <wd-col-picker v-model="areaValue" :columns="area" placeholder="请选择所属区域" custom-class="add_picker"
            :column-change="columnChange" @confirm="handleConfirm">
            <!-- <wd-button v-if="areaValue">{{ areaValue }}</wd-button>
            <wd-button v-else>请选择所属区域</wd-button> -->
          </wd-col-picker>
        </view>
      </view>

      <view class="input_item">
        <view class="left_icon">
          <image style="width: 35rpx; height: 35rpx" src="http://116.62.107.90:8673/images/icons/dw_icon.png"></image>
        </view>
        <input v-model="postForm.address" type="text" class="input" placeholder="请输入详细地址" />
      </view>

      <view class="up_img_box">
        <view class="title">请上传营业执照：</view>
        <view class="up_box" @tap="handleUploadLicense">
          <image v-if="postForm.license" :src="baseURL + postForm.license" class="license" mode="scaleToFill" />
          <image v-else src="http://116.62.107.90:8673/images/icons/add_icon.png" class="add_icon" mode="scaleToFill" />
        </view>
      </view>

      <button class="registerBtn" @tap="registerBtn">注册并登录</button>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.register_firm {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f7f7fc;

  .firm_flow {
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
      font-size: 34rpx;
      color: #FFFFFF;
      background: linear-gradient(90deg, #1082FF 0%, #5FA9FF 100%);
    }

  }
}
</style>
