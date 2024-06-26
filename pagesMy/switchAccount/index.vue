<script setup>
import navbar from '@/pages/components/navbar.vue'
import { useUserStore } from '@/store'
import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库
import { getPhoneLoginHistory } from '@/api'


const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const { deviceId, } = storeToRefs(userStore)

const Toast = useToast()

const accountList = ref([])
onLoad(() => {
  if (deviceId.value) {
    console.log("有设备id");
    getLoginHistoryFn()
  } else {
    console.log("没有设备id，获取设备id");
    uni.getSystemInfo({
      success: (res) => {
        deviceId.value = res.deviceId
        getLoginHistoryFn()
      },
      fail: (err) => {
        console.log("获取系统信息失败", err);
      },
    });
  }
})


const getLoginHistoryFn = async () => {
  const { code, data, msg } = await getPhoneLoginHistory(deviceId.value)
  if (code != 0) return Toast.warning(msg)
  accountList.value = data
}

const handleChangeAccout = (param) => {
  if (param.phone === userInfo.value.phone) return Toast.warning("当前账号已登录");
  userStore.loginInfo({
    phone: param.phone,
    password: param.password,
    isLastingCookie: false,
    phoneId: deviceId.value,
    platform: 1
  })
}

const userTypeList = {
  1: "企业",
  2: "主管",
  3: "工程师"
}

</script>
<template>
  <wd-toast></wd-toast>
  <view class="switchAccount">
    <navbar :title="'切换账号'" />
    <view class="switch_flow">
      <text class="tps">轻触账号以登录</text>
      <view class="accountList">
        <view v-for="(item, key, index) in accountList" :index="index" class="account_item"
          @tap="handleChangeAccout(item)" :key="index" :class="item.phone === userInfo.phone ? 'active' : ''">
          <text class="userName">【{{ userTypeList[item.userType] }}】 {{ item.userName ? item.userName : "" }} {{
            item.phone }}</text>
          <text class="logining" v-if="item.phone === userInfo.phone">当前登录账号</text>
        </view>
        <wd-status-tip v-if="accountList.length == 0" image="content" tip="暂无账号" />
      </view>
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
    padding: 20rpx;

    .tps {
      width: 100%;
      height: 50rpx;
      font-size: 26rpx;
      color: #000000;
      line-height: 50rpx;
    }

    .accountList {
      width: 100%;
      border-radius: 20rpx;
      font-size: 26rpx;
      background: #FFFFFF;
      box-shadow: 0rpx 5rpx 11rpx 2rpx rgba(0, 0, 0, 0.09);
      border-radius: 14rpx 14rpx 14rpx 14rpx;

      .account_item {
        height: 90rpx;
        padding: 0 20rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 2rpx solid #EFEFEF;

        .userName {
          font-size: 26rpx;
          color: #000000;
        }

        .logining {
          font-size: 26rpx;
          color: #1082FF;
        }

      }

    }

  }
}
</style>