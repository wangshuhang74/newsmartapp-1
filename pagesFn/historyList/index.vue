<script setup>
import { useNotify, useToast, useMessage, useQueue } from 'wot-design-uni' // ui组件库
import { toNavigation, makePhoneCall, debounce } from '@/utils'
import dayjs from 'dayjs';
import { finishedList, getClientOption } from '@/api'
import { useUserStore } from '@/store'

const Toast = useToast()
const { safeAreaInsets } = uni.getSystemInfoSync()
const { userInfo } = storeToRefs(useUserStore())

const workList = ref([])
const getForm = ref({
  search: null,
  pageNum: 1,
  pageSize: 10,
  startTime: null,
  endTime: null,
  orderType: null, //
  engiee: null, // 1:工程师 
  clientId: null // 客户名称
})

const total = ref(0) // 总条数
const isTriggered = ref(false) // 是否在下拉刷新中?

const orderTypeList = ref([ // 工单类型
  { label: '全部', value: null },
  { label: '维护车辆', value: 2 },
  { label: '车辆新装', value: 3 },
  { label: '行车记录仪新装', value: 4 }
])

const engieeList = ref([{ label: '全部', value: null }]) // 工程师选项
const ClientOptionList = ref([{ label: '全部', value: null }]) //客户选项

onMounted(() => {
  getListFn()
  getClientOptionFn()
  if (userInfo.value.userType == 3) {
    getForm.value.engiee = userInfo.value.userId
  }
})

const getListFn = async () => {
  const { code, data, msg } = await finishedList(getForm.value)
  if (code != 0) return
  total.value = data.total
  if (isTriggered.value) isTriggered.value = false
  Toast.close()
  workList.value = [...workList.value, ...data.records]
}

const getClientOptionFn = async () => {
  const { code, data, msg } = await getClientOption()
  if (code != 0) return Toast.error(msg)
  ClientOptionList.value = data.map(item => {
    return {
      label: item.clientName,
      value: item.clientId
    }
  })
  ClientOptionList.value.unshift({
    label: "全部",
    value: null
  })

}

const searchInput = debounce(() => {
  console.log('searchInput', getForm.value.search);
}, 1000); // 第二个参数是延迟时间，单位为毫秒

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

const leftBtn = () => {
  console.log('leftBtn')
  uni.navigateBack()
}


const { closeOutside } = useQueue()
const sliderValue = ref(Date.now())

const dropMenu = ref(null) // 

function handleConfirm() { //自定义时间下拉 确定按钮
  dropMenu.value.close()
}

function handleClose() { //自定义时间下拉 关闭按钮
  sliderValue.value = new Date()
  dropMenu.value.close()
}

function handleOpened() { //自定义时间下拉 打开时触发
  // if (!sliderValue.value) sliderValue.value = new Date()
  console.log("handleOpened()");
}

function handleChange2({ value }) {
  console.log(value)
}
function handleChange3({ value }) {
  console.log("getF")
}
function handleChange4({ value }) {
  console.log(value)
}

</script>

<template>
  <wd-toast></wd-toast>
  <view class="historyList">
    <view class="top_box" :style="{ paddingTop: safeAreaInsets?.top + 'px', height: safeAreaInsets?.top + 124 + 'px' }">
      <view class="title_box">
        <view class="left" @tap="leftBtn">
          <!-- <wd-icon name="thin-arrow-left" class="left_icon" size="20px"></wd-icon> -->
          <image src="http://116.62.107.90:8673/images/icons/fhui.png" class="left_img" mode="scaleToFill" />
        </view>
        <text class="title">历史记录</text>
        <view class="right"></view>

      </view>
      <view class="search_box">
        <view class="search">
          <image class="search_img" src="http://116.62.107.90:8673/images/homeMap/search.png" mode="scaleToFill" />
          <input type="text" v-model="getForm.search" placeholder="搜索" @input="searchInput">
          <image class="qr_img" src="http://116.62.107.90:8673/images/fns/qr_img.png" @tap="scanBtn"
            mode="scaleToFill" />
        </view>
      </view>
    </view>
    <view class="top_choose" @click="closeOutside">
      <wd-drop-menu :close-on-click-modal="false">
        <wd-drop-menu-item ref="dropMenu" title="时间段" @opened="handleOpened" icon-name="history" close-on-click-modal>
          <view>
            <wd-datetime-picker-view type="year-month" v-model="sliderValue" :maxDate="new Date()" />
            <view class="btns">
              <wd-button type="info" @tap="handleClose">取消</wd-button>
              <wd-button @tap="handleConfirm">确定</wd-button>
            </view>
          </view>
        </wd-drop-menu-item>
        <!-- <wd-drop-menu-item v-model="value1" :options="option1" @change="handleChange1" /> -->
        <wd-drop-menu-item v-model="getForm.orderType" title="工单类型" :options="orderTypeList" @change="handleChange2" />
        <wd-drop-menu-item v-model="getForm.engiee" title="工程师" :disabled="userInfo.userType == 3" :options="engieeList"
          @change="handleChange3" />
        <wd-drop-menu-item v-model="getForm.clientId" title="客户企业" :options="ClientOptionList"
          @change="handleChange4" />
      </wd-drop-menu>
    </view>

    <scroll-view class="list_box" :scroll-y="true" :show-scrollbar="false" @scrolltolower="scrollBottom"
      @refresherrefresh="onRefresherrefresh" :refresher-triggered="isTriggered" refresher-enabled :lower-threshold="50">
      <view class="work_item" v-for="(item, idx) in workList" :key="idx">
        <view class="work_top">
          <image src="http://116.62.107.90:8673/images/fns/map.png" class="work_icon" mode="scaleToFill" />
          <view class="work_title">
            <text class="tit">{{ item?.clientName ? item?.clientName : '-' }}-{{ item?.carPlate ? item?.carPlate :
              '-' }}</text>
            <text class="tags tag1" v-if="item.orderStatus">{{ item.orderStatus }}</text>
            <!-- <text class="tags tag2">待新装</text> -->
            <!-- <text class="tags tag3">待运维</text> -->
          </view>
          <image src="http://116.62.107.90:8673/images/icons/item_arrow.png" class="item_arrow" mode="scaleToFill" />
        </view>
        <view class="work_center" @tap.stop="clickItem(item)">
          <view class="work_it">
            <view class="label">联系人:</view>
            <view class="value">{{ item?.contactName ? item?.contactName : '-' }}</view>
          </view>

          <view class="work_it">
            <view class="label">联系电话:</view>
            <view class="value isImg">
              <text>{{ item?.contactPhone ? item?.contactPhone : '-' }}</text>
              <image class="position_img" src="http://116.62.107.90:8673/images/homeMap/phone.png"
                @tap.stop="makePhoneCall(item?.contactPhone)" mode="scaleToFill" />
            </view>
          </view>

          <view class="work_it" v-if="item.orderType == 3">
            <view class="label">新装设备:</view>
            <view class="value">{{ item?.contactName ? item?.contactName : '-' }}</view>
          </view>
          <view class="work_it" v-else-if="item.orderType == 2">
            <view class="label">运维内容:</view>
            <view class="value">{{ item?.contactName ? item?.contactName : '-' }}</view>
          </view>

          <view class="work_it">
            <view class="label">地址:</view>
            <view class="value isImg">
              <text>{{ item?.address ? item?.address : '-' }}</text>
              <image class="position_img" src="http://116.62.107.90:8673/images/homeMap/address.png"
                @tap.stop="toNavigation(item)" mode="scaleToFill" />
            </view>
          </view>

          <view class="work_it" v-if="item.orderType == 3">
            <view class="label">设备型号:</view>
            <view class="value">{{ item?.contactName ? item?.contactName : '-' }}</view>
          </view>

          <view class="work_it" v-else-if="item.orderType == 2">
            <view class="label">故障概述:</view>
            <view class="value">{{ item?.contactName ? item?.contactName : '-' }}</view>
          </view>

          <view class="work_it">
            <view class="label">设备序列号:</view>
            <view class="value">{{ item?.terminalSerial ? item?.terminalSerial : '-' }}</view>
          </view>
        </view>
      </view>
      <wd-status-tip v-if="workList.length == 0" image="content" tip="暂无工单" />
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
@import '../../static/css/work.scss';

.historyList {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f7f7fc;
  display: flex;
  flex-direction: column;

  .top_choose {
    width: 100%;
    height: 80rpx;
    background-color: #fff;
    box-sizing: border-box;
    margin-bottom: 30rpx;

    .wd-drop-menu {
      box-sizing: border-box;

    }

    :deep(.wd-icon-arrow-down) {
      font-size: 42rpx !important;

      &::before {
        transform: translateX(10rpx) !important;
      }
    }

    :deep(.wd-drop-menu__item) {
      &:last-child {
        margin-right: 40rpx;
      }
    }

    .btns {
      width: 100%;
      height: 120rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

  }


}
</style>