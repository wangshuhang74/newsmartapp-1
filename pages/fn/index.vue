<script setup>
import { useUserStore } from '@/store'
import electronicsTag from '@/static/images/fns/electronicsTag.png'
import { getAppTodoNum } from '@/api'
import newCar from '@/static/images/fns/newCar.png'
import oldCar from '@/static/images/fns/oldCar.png'
import assign from '@/static/images/fns/assign.png'
import audit from '@/static/images/fns/audit.png'
import history from '@/static/images/fns/history.png'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
console.log("🚀 ~ userInfo:", userInfo.value) // userInfo.userType
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

onShow(() => {
  userStore.isLoginFn()
  getAppTodoNumFn()
})
const getAppTodoNumFn = async () => {
  const { code, data, msg } = await getAppTodoNum()
  // xzNum 新装  // whNum 维护  // zpNum 指派  // shNum 审核  // xcNum 行车记录仪 // appZpNum app指派数量
  if (code != 0) return
  fnList.value[0].msgNum = data.xzNum ? data.xzNum : 0
  fnList.value[1].msgNum = data.whNum ? data.whNum : 0
  // fnList.value[2].msgNum = data.zpNum ? data.zpNum : 0
  fnList.value[2].msgNum = data.appZpNum ? data.appZpNum : 0
  fnList.value[3].msgNum = data.shNum ? data.shNum : 0
  // appZpNum
}

const fnList = ref([
  {
    id: '1',
    name: '车辆新装',
    icon: newCar,
    msgNum: 0,
    path: '/pagesFn/newInstall/index',
    permission: [1, 2, 3] // 1企业 2 主管 3 个人
  },
  {
    id: '2',
    name: '车辆维护',
    icon: oldCar,
    msgNum: 0,
    path: '/pagesFn/oldMaintain/index',
    permission: [1, 2, 3]
  },
  {
    id: '3',
    name: '指派任务',
    icon: assign,
    msgNum: 0,
    path: '/pagesFn/assignTask/index',
    permission: [1, 2,]
  },
  {
    id: '4',
    name: '审核任务',
    icon: audit,
    msgNum: 0,
    path: '/pagesFn/AuditTask/index',
    permission: [1, 2,]
  },
  {
    id: '5',
    name: '历史记录',
    icon: history,
    msgNum: 0,
    path: '/pagesFn/historyList/index',
    permission: [1, 2, 3]
  },
  {
    id: '6',
    name: '电子标识',
    icon: electronicsTag,
    msgNum: 0,
    path: '/pagesFn/electronicsTag/index',
    permission: [1, 2, 3]
  },
])

// onMounted(() => {})

const toPages = (item) => {
  uni.navigateTo({
    url: item.path,
  })
}
</script>
<template>
  <wd-toast></wd-toast>
  <view class="fn_box">
    <view class="top_box" :style="{ paddingTop: safeAreaInsets?.top + 'px', height: safeAreaInsets?.top + 124 + 'px' }">
      <view class="title">我的任务</view>
    </view>
    <view class="picture_box">
      <image class="image_bg" src="http://116.62.107.90:8673/images/fns/fn_bg.png" mode="scaleToFill" />
    </view>
    <view class="fn_list">
      <view class="task_item" v-for="(item, index) in fnList" :key="index" @tap="toPages(item)"
        :class="{ isHide: item?.permission && !item?.permission.includes(userInfo.userType) }">
        <image :src="item.icon" mode="scaleToFill" />
        <view class="name">
          {{ item.name }}
          <text class="text_num max" v-if="item.msgNum > 99">...</text>
          <text class="text_num" v-else-if="item.msgNum">{{ item.msgNum }}</text>
        </view>
      </view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.fn_box {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f7f7fc;

  .fn_list {
    display: flex;
    flex-wrap: wrap;
    width: 90%;
    margin: 10rpx auto;

    .task_item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 47%;
      height: 200rpx;
      margin-bottom: 30rpx;
      background-color: #fff;
      border-radius: 7rpx 7rpx 7rpx 7rpx;
      box-shadow: 0rpx 5rpx 11rpx 2rpx rgba(205, 205, 205, 0.31);
      margin: 1.2%;

      &.isHide {
        display: none !important;
      }

      // &:nth-child(2n - 1) {
      //   margin: 3.5%;
      // }

      image {
        width: 88rpx;
        height: 88rpx;
        margin-bottom: 10rpx;
      }

      .name {
        position: relative;
        width: 120rpx;
        height: 40rpx;
        font-size: 26rpx;
        line-height: 40rpx;
        color: #252525;
        text-align: center;
        background-color: #fff;

        .text_num {
          position: absolute;
          top: -16rpx;
          right: -16rpx;
          width: 28rpx;
          height: 28rpx;
          font-size: 20rpx;
          line-height: 28rpx;
          color: #fff;
          text-align: center;
          background-color: #e60505;
          border-radius: 50%;
          opacity: 0.6;
        }
      }
    }
  }

  .picture_box {
    position: relative;
    width: 100%;
    height: 200rpx;

    .image_bg {
      position: absolute;
      top: -120rpx;
      left: calc((100% - 700rpx) / 2);
      z-index: 9;
      width: 700rpx;
      height: 320rpx;
    }
  }

  .top_box {
    box-sizing: border-box;
    width: 100%;
    padding-bottom: 20rpx;
    background: linear-gradient(90deg, #4557d1 0%, #75dbed 100%);
    box-shadow: 0rpx 5rpx 11rpx 2rpx rgba(0, 0, 0, 0.09);

    .title {
      width: 100%;
      height: 60rpx;
      font-size: 33rpx;
      line-height: 60rpx;
      color: #ffffff;
      text-align: center;
    }
  }
}
</style>
