<script setup>
import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库
import { toNavigation, makePhoneCall, debounce } from '@/utils'
import returnPopup from '../components/returnPopup.vue'
import { useWorkStore, useUserStore } from '@/store'
import { getList, complete, acceptOrder } from '@/api'

const { workDetail, workHandle } = storeToRefs(useWorkStore())
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
const listState = ref('loading') // 加载状态
const showLoadmore = ref(false) // 是否显示加载更多

const total = ref(0) // 总条数
const isTriggered = ref(false) // 是否在下拉刷新中?

const postForm = ref({
  comment: 1,
  procInsId: null,
  instanceId: null,
  deployId: null,
  taskId: null,
  variables: {
    comment: 1,
    approval: null,
    remark: null
  },
  executionId: null
})

onShow(() => {
  if (workList.value.length) resetBtn()
})

onMounted(() => {
  getListFn()
})


const getListFn = async () => {
  const { code, data, msg } = await getList(getForm.value)
  if (code != 0) return Toast.error(msg)
  total.value = data.total
  if (isTriggered.value) isTriggered.value = false
  showLoadmore.value = false
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
}

const scrollBottom = () => { // 上拉加载
  listState.value = 'loading'
  showLoadmore.value = true
  let lengths = workList.value.length
  if (lengths < total.value) {
    getForm.value.pageNum++
    getListFn()
  } else {
    listState.value = 'finished' // 加载完成
    setTimeout(() => {
      showLoadmore.value = false
    }, 1200);
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
    .then(async () => {
      postForm.value.procInsId = item.procInsId;
      postForm.value.instanceId = item.procInsId;
      postForm.value.deployId = item.deployId;
      postForm.value.taskId = item.taskId;
      postForm.value.executionId = item.executionId;
      postForm.value.variables.approval = userInfo.value.userId;
      console.log("🚀 ~ .then ~ postForm.value:", postForm.value)
      const { code, data, msg } = await complete(postForm.value)
      if (code == 0) {
        const { code, data, msg } = await acceptOrder(item.orderId)
        console.log("🚀 ~ .then ~ data:", data)
        if (code != 0) return Toast.error(msg)
        Toast.success(msg)
        resetBtn()
      } else {
        return Toast.error(msg)
      }
    })
    .catch(() => { });
}

const resetBtn = () => {
  getForm.value.pageNum = 1
  workList.value = []
  getListFn()
}

const CloseClick = (val) => {
  returnShow.value = false
  returnInfo.value = {}
  if (val != 'refresh') return
  resetBtn()
}

const clickItem = (item) => {
  workDetail.value = item
  uni.navigateTo({
    url: "/pagesFn/work/workDetails",
  })
}

const handleWork = (item) => {
  workHandle.value = item
  uni.navigateTo({
    url: "/pagesFn/work/handleWork",
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
          <image src="../../static/images/icons/fhui.png" class="left_img" mode="scaleToFill" />
        </view>
        <text class="title">车辆维护</text>
        <view class="right"></view>

      </view>
      <view class="search_box">
        <view class="search">
          <image class="search_img" src="../../static/images/homeMap/search.png" mode="scaleToFill" />
          <input type="text" v-model="getForm.search" placeholder="搜索" @input="searchInput">
          <image class="qr_img" src="../../static/images/fns/qr_img.png" @tap="scanBtn" mode="scaleToFill" />
        </view>
      </view>
    </view>

    <scroll-view class="list_box" :scroll-y="true" :show-scrollbar="false" @scrolltolower="scrollBottom"
      @refresherrefresh="onRefresherrefresh" :refresher-triggered="isTriggered" refresher-enabled :lower-threshold="50">
      <view class="work_item" v-for="(item, idx) in workList" :key="idx" @tap="clickItem(item)">
        <view class="work_top">
          <image src="../../static/images/fns/map.png" class="work_icon" mode="scaleToFill" />
          <view class="work_title">
            <text class="tit">{{ item?.clientName ? item?.clientName : '-' }}-{{ item?.carPlate ? item?.carPlate :
              '-' }}</text>
            <text class="tags tag1" v-if="item.orderStatus">{{ item.orderStatus }}</text>
            <!-- <text class="tags tag1">待接单</text> -->
            <!-- <text class="tags tag2">待新装</text> -->
            <!-- <text class="tags tag3">待运维</text> -->
          </view>
          <image src="../../static/images/icons/item_arrow.png" class="item_arrow" mode="scaleToFill" />
        </view>
        <view class="work_center " :class="{ no: userInfo.userType != 1 && userInfo.userType != 2 }">
          <view class="work_it">
            <view class="label">联系人:</view>
            <view class="value">{{ item?.contactName ? item?.contactName : '-' }}</view>
          </view>

          <view class="work_it">
            <view class="label">联系电话:</view>
            <view class="value isImg">
              <text>{{ item?.contactPhone ? item?.contactPhone : '-' }}</text>
              <image class="position_img" src="../../static/images/homeMap/phone.png"
                @tap.stop="makePhoneCall(item?.contactPhone)" mode="scaleToFill" />
            </view>
          </view>

          <view class="work_it">
            <view class="label">运维内容:</view>
            <view class="value">{{ item?.content ? item?.content : '-' }}</view>
          </view>

          <view class="work_it">
            <view class="label">地址:</view>
            <view class="value isImg">
              <text>{{ item?.address ? item?.address : '-' }}</text>
              <image class="position_img" src="../../static/images/homeMap/address.png" @tap.stop="toNavigation(item)"
                mode="scaleToFill" />
            </view>
          </view>

          <view class="work_it">
            <view class="label">故障概述:</view>
            <view class="value">{{ item?.faultContent ? item?.faultContent : '-' }}</view>
          </view>

          <view class="work_it">
            <view class="label">设备序列号:</view>
            <view class="value">{{ item?.terminalSerial ? item?.terminalSerial : '-' }}</view>
          </view>

        </view>
        <view class="btn_box">
          <view class="btn" v-if="item.isAccept == 0 && userInfo.ruleId == 6" @tap.stop="returnBtn(item)">返还
          </view>
          <view class="btn" v-if="item.isAccept == 0 && (userInfo.ruleId == 5 || userInfo.ruleId == 6)"
            @tap.stop="takeOrders(item)">接单
          </view>
          <view class="btn"
            v-if="item.isAccept == 1 && item.isDealOrder == 0 && (userInfo.ruleId == 5 || userInfo.ruleId == 6)"
            @tap.stop="handleWork(item)">处理</view>
        </view>
      </view>
      <wd-status-tip v-if="workList.length == 0" image="content" tip="暂无工单" />
    </scroll-view>
    <wd-loadmore v-if="showLoadmore" custom-class="loadmore" :state="listState" />
    <returnPopup v-if="returnShow" :returnShow="returnShow" :returnInfo="returnInfo" @CloseClick="CloseClick" />
  </view>
</template>

<style lang="scss" scoped>
@import '../../static/css/work.scss';

.oldMaintain {
  width: 100%;
  height: 100vh;
  background-color: #f7f7fc;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>