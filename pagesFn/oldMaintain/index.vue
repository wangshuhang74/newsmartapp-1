<script setup>
import '../../style/work.scss'
import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库
import { toNavigation, makePhoneCall, debounce } from '@/utils'
import returnPopup from '../components/returnPopup.vue'
import { useWorkStore, useUserStore } from '@/store'
import { getList } from '@/api'

const { workDetail } = storeToRefs(useWorkStore())
const { userInfo } = storeToRefs(useUserStore())
const message = useMessage(); // 消息弹框
const Toast = useToast()
const { safeAreaInsets } = uni.getSystemInfoSync()
const workList = ref([])

const getForm = ref({
  search: null,
  pageNum: 1,
  pageSize: 10,
  type: 3
})

const returnShow = ref(false)
const returnInfo = ref({})


const total = ref(0) // 总条数
const isTriggered = ref(false) // 是否在下拉刷新中?

onMounted(() => {
  getListFn()
})


const getListFn = async () => {
  const { code, data, msg } = await getList(getForm.value)
  if (code != 0) return
  total.value = data.total
  if (isTriggered.value) isTriggered.value = false
  Toast.close()
  workList.value = [...workList.value, ...data.records]
}


const searchInput = debounce(() => {
  getForm.value.pageNum = 1
  workList.value = []
  getListFn()
}, 600); // 第二个参数是延迟时间，单位为毫秒


const onRefresherrefresh = () => { // 下拉刷新
  isTriggered.value = true
  getForm.value.pageNum = 1
  workList.value = []
  getListFn()
  console.log("🚀 ~ onRefresherrefresh ~ onRefresherrefresh:",)
}

const scrollBottom = () => { // 上拉加载
  Toast.loading('加载中...')
  let lengths = workList.value.length
  if (lengths < total.value) {
    getForm.value.pageNum++
    getListFn()
  } else {
    Toast.warning("没有更多了!")
  }
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

const leftBtn = () => {
  console.log('leftBtn')
  uni.navigateBack()
}

const returnBtn = (item) => { // 退回
  returnInfo.value = item
  returnShow.value = true
}

const takeOrders = (item) => {
  message.confirm({
    title: "确认接单",
    msg: "您确定要接单吗?",
    confirmButtonText: "确认接单",
    cancelButtonText: "暂不接单",
  })
    .then(() => {
      console.log("确认");
    })
    .catch(() => { });
}

const CloseClick = () => {
  returnShow.value = false
  returnInfo.value = {}
}

const clickItem = (item) => {
  workDetail.value = item
  uni.navigateTo({
    url: "/pagesFn/workDetails/index",
  })
}
</script>

<template>
  <wd-toast></wd-toast>
  <wd-message-box />
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

    <scroll-view class="list_box" :scroll-y="true" :show-scrollbar="false" @scrolltolower="scrollBottom"
      @refresherrefresh="onRefresherrefresh" :refresher-triggered="isTriggered" refresher-enabled :lower-threshold="50">
      <view class="work_item" v-for="(item, idx) in workList" :key="idx" @tap="clickItem(item)">
        <view class="work_top">
          <image src="http://116.62.107.90:8673/images/fns/map.png" class="work_icon" mode="scaleToFill" />
          <view class="work_title">
            <text class="tit">{{ item?.clientName ? item?.clientName : '--' }}-{{ item?.carPlate ? item?.carPlate :
              '--' }}</text>
            <text class="tags tag1" v-if="item.orderStatus">{{ item.orderStatus }}</text>
            <!-- <text class="tags tag1">待接单</text> -->
            <!-- <text class="tags tag2">待新装</text> -->
            <!-- <text class="tags tag3">待运维</text> -->
          </view>
          <image src="http://116.62.107.90:8673/images/icons/item_arrow.png" class="item_arrow" mode="scaleToFill" />
        </view>
        <view class="work_center " :class="{ no: userInfo.userType != 1 && userInfo.userType != 2 }">
          <view class="work_it">
            <view class="label">联系人:</view>
            <view class="value">{{ item?.contactName ? item?.contactName : '--' }}</view>
          </view>

          <view class="work_it">
            <view class="label">联系电话:</view>
            <view class="value isImg">
              <text>{{ item?.contactPhone ? item?.contactPhone : '--' }}</text>
              <image class="position_img" src="http://116.62.107.90:8673/images/homeMap/phone.png"
                @tap.stop="makePhoneCall(item?.contactPhone)" mode="scaleToFill" />
            </view>
          </view>

          <view class="work_it">
            <view class="label">运维内容:</view>
            <view class="value">{{ item?.contactName ? item?.contactName : '--' }}</view>
          </view>

          <view class="work_it">
            <view class="label">地址:</view>
            <view class="value isImg">
              <text>{{ item?.address ? item?.address : '--' }}</text>
              <image class="position_img" src="http://116.62.107.90:8673/images/homeMap/address.png"
                @tap.stop="toNavigation(item)" mode="scaleToFill" />
            </view>
          </view>

          <view class="work_it">
            <view class="label">故障概述:</view>
            <view class="value">{{ item?.contactName ? item?.contactName : '--' }}</view>
          </view>

          <view class="work_it">
            <view class="label">设备序列号:</view>
            <view class="value">{{ item?.terminalSerial ? item?.terminalSerial : '--' }}</view>
          </view>

        </view>
        <view class="btn_box">
          <view class="btn" @tap.stop="returnBtn(item)" v-if="item.isAccept == 0">返还</view>
          <view class="btn" @tap.stop="takeOrders(item)" v-if="item.isAccept == 0">接单</view>
          <view class="btn" v-if="userInfo.userType == 3">处理</view>
        </view>
      </view>
      <wd-status-tip v-if="workList.length == 0" image="content" tip="暂无工单" />
    </scroll-view>

    <returnPopup v-if="returnShow" :returnShow="returnShow" :returnInfo="returnInfo" @CloseClick="CloseClick" />

  </view>
</template>

<style lang="scss" scoped>
.oldMaintain {
  width: 100%;
  height: 100vh;
  background-color: #f7f7fc;
  overflow: hidden;
  display: flex;
  flex-direction: column;


}
</style>