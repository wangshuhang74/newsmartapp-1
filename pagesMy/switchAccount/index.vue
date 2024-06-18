<script setup>
import navbar from '@/pages/components/navbar.vue'
import { useUserStore } from '@/store'
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
console.log("🚀 ~ userInfo.value:", userInfo.value)
import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库
const Toast = useToast()

const accountList = ref([
  {
    phone: '13320134803',
    userName: '客服主管',
    userType: 2,
    userTypeStr: '【主管账号】'
  },
  {
    phone: '19815103583',
    userName: '测试企业',
    userType: 1,
    userTypeStr: '【企业账号】'
  },
  {
    phone: '19210964479',
    userName: '管理员',
    userType: 0,
    userTypeStr: '【管理员账号】'
  },
  {
    phone: '13333333333',
    userName: '王树杭',
    userType: 3,
    userTypeStr: '【个人账号】'
  },
])

const handleChangeAccout = (param) => {
  if (param.phone === userInfo.value.phone) return;
  param["isLastingCookie"] = false;
  param["platform"] = 1;

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
          <text class="userName">{{ item.userTypeStr }} {{ item.userName ? item.userName : "" }} {{ item.phone }}</text>
          <text class="logining" v-if="item.phone === userInfo.phone">当前登录账号</text>
        </view>
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