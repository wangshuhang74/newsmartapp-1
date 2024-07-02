<script setup>
import AuditPopup from '../components/AuditPopup.vue'
import navbar from '@/pages/components/navbar.vue'
import { toNavigation, makePhoneCall } from '@/utils'
import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库
import { useWorkStore, } from '@/store'
import { getList } from '@/api'
const { workDetail, auditRefresh } = storeToRefs(useWorkStore())

const workList = ref([])
const Toast = useToast()

const getForm = ref({
  search: null,
  pageNum: 1,
  pageSize: 10,
  type: 2
})

const postForm = ref({
  checkWorks: [],
})

const auditShow = ref(false)
const auditInfo = ref({})

const total = ref(0) // 总条数
const isTriggered = ref(false) // 是否在下拉刷新中?

onShow(() => {
  if (auditRefresh.value) {
    resetBtn()
    auditRefresh.value = false
  }
})

onMounted(() => {
  getListFn()
})

const listState = ref('loading') // 加载状态

const getListFn = async () => {
  const { code, data, msg } = await getList(getForm.value)
  if (code != 0) {
    Toast.error(msg)
  } else {
    listState.value = 'finished'
    total.value = data.total
    if (isTriggered.value) isTriggered.value = false
    Toast.close()
    workList.value = [...workList.value, ...data.records]
  }
}

const onRefresherrefresh = () => { // 下拉刷新
  isTriggered.value = true
  getForm.value.pageNum = 1
  workList.value = []
  getListFn()
  console.log("🚀 ~ onRefresherrefresh ~ onRefresherrefresh:",)
}

const scrollBottom = () => { // 上拉加载
  // Toast.loading('加载中...')
  let lengths = workList.value.length
  if (lengths < total.value) {
    getForm.value.pageNum++
    getListFn()
    listState.value = 'loading'
  } else {
    listState.value = 'finished'
    // Toast.warning("没有更多了!")
  }
}

const auditBtn = (item) => {
  auditInfo.value = item
  auditShow.value = true
}

const CloseClick = (val) => {
  auditShow.value = false
  auditInfo.value = {}
  if (val != 'refresh') return
  Toast.success("审核成功!")
  resetBtn()
}

const resetBtn = () => {
  getForm.value.pageNum = 1
  workList.value = []
  getListFn()
}

const checkboxChange = (val) => {
  console.log("🚀 ~ checkboxChange ~ val:", val)
}

const allHandleValue = ref(false)
const allHandleChange = (val) => {
  if (val.value) {
    postForm.value.checkWorks = workList.value.map(item => item.orderId)
  } else {
    postForm.value.checkWorks = []
  }
}


const oneKeyHandle = () => {
  console.log("一键审核");
  auditInfo.value = workList.value.filter(item => postForm.value.checkWorks.includes(item.orderId))
  auditShow.value = true
}

const clickItem = (item) => {
  item.isAuditTask = true
  workDetail.value = item
  uni.navigateTo({
    url: "/pagesFn/work/workDetails",
  })
}
</script>

<template>
  <wd-toast></wd-toast>
  <view class="AuditTask">
    <navbar :title="'审核任务'" />
    <scroll-view class="list_box" :scroll-y="true" :show-scrollbar="false" @scrolltolower="scrollBottom"
      @refresherrefresh="onRefresherrefresh" :refresher-triggered="isTriggered" refresher-enabled :lower-threshold="50">
      <wd-checkbox-group v-model="postForm.checkWorks" @change="checkboxChange">
        <view class="work_item" v-for="(item, idx) in workList" :key="idx">
          <view class="work_top">
            <wd-checkbox class="work_title" :modelValue="item.orderId">
              <text class="tit">{{ item?.clientName ? item?.clientName : '-' }}-{{ item?.carPlate ? item?.carPlate :
                '-' }}</text>
              <text class="tags tag1" v-if="item.orderTypeDetail">{{ item.orderTypeDetail }}</text>
              <!-- <text class="tags tag2" v-if="item.orderStatus">{{ item.orderStatus }}</text> -->
            </wd-checkbox>
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
          <view class="btn_box">
            <view class="btn" @tap="auditBtn(item)">审核</view>
          </view>
        </view>
      </wd-checkbox-group>
      <wd-status-tip v-if="workList && workList.length == 0" image="content" tip="暂无工单" />
      <wd-loadmore v-if="workList.length > 5" custom-class="loadmore" :state="listState" @reload="getListFn" />
    </scroll-view>
    <view class="oneKey" v-if="workList && workList.length != 0">
      <wd-checkbox v-model="allHandleValue" @change="allHandleChange">{{ allHandleValue ? '取消全选' : "全选" }}</wd-checkbox>
      <button class="btn" :disabled="postForm.checkWorks.length == 0" @tap="oneKeyHandle">一键审核</button>
    </view>
  </view>
  <AuditPopup v-if="auditShow" :auditShow="auditShow" :auditInfo="auditInfo" @CloseClick="CloseClick" />
</template>
<style lang="scss" scoped>
@import '../../static/css/work.scss';

.AuditTask {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f7f7fc;

}
</style>