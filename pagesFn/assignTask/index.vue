<script setup>
import assignPopup from '../components/assignPopup.vue'
import navbar from '@/pages/components/navbar.vue'
import { toNavigation, makePhoneCall } from '@/utils'
import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库
import { useWorkStore, } from '@/store'
import { getList } from '@/api'
const { workDetail, assignRefresh } = storeToRefs(useWorkStore())

const workList = ref([])
const Toast = useToast()

const getForm = ref({
  search: null,
  pageNum: 1,
  pageSize: 10,
  type: 8 // 类型 1pc待指派 2app、pc待审核 3app车辆新装 4app车辆维护 5app行车记录仪新装 6pc待运维 7待评价 8app待指派
})

const postForm = ref({
  checkWorks: [],
})

const assignShow = ref(false)
const assignInfo = ref({})

const listState = ref('loading') // 加载状态
const showLoadmore = ref(false) // 是否显示加载更多
const total = ref(0) // 总条数
const isTriggered = ref(false) // 是否在下拉刷新中?

onShow(() => {
  if (assignRefresh.value) {
    resetBtn()
    assignRefresh.value = false
  }
})

onMounted(() => {
  getListFn()
})


const getListFn = async () => {
  const { code, data, msg } = await getList(getForm.value)
  if (code != 0) return Toast.error(msg)
  total.value = data?.total ? data?.total : 0
  if (isTriggered.value) isTriggered.value = false
  showLoadmore.value = false
  workList.value = [...workList.value, ...data?.records]//.filter(item => item.isApproval == 0)
}

const onRefresherrefresh = () => { // 下拉刷新
  isTriggered.value = true
  getForm.value.pageNum = 1
  workList.value = []
  getListFn()
  console.log("🚀 ~ onRefresherrefresh ~ onRefresherrefresh:",)
}

const scrollBottom = () => { // 上拉加载
  console.log("🚀 ~ scrollBottom ~ scrollBottom:",)
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

const assignBtn = async (item) => {
  assignInfo.value = item
  assignShow.value = true
}

const CloseClick = (val) => {
  assignShow.value = false
  assignInfo.value = {}
  if (val != 'refresh') return
  Toast.success("指派成功!")
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
  console.log("一键指派");
  assignInfo.value = workList.value.filter(item => postForm.value.checkWorks.includes(item.orderId))
  console.log("🚀 ~ oneKeyHandle ~ assignInfo.value:", assignInfo.value)
  assignShow.value = true
}

const clickItem = (item) => {
  item.isAssignTask = true
  workDetail.value = item
  uni.navigateTo({
    url: "/pagesFn/work/workDetails",
  })
}

</script>
<template>
  <wd-toast></wd-toast>
  <view class="assignTask">
    <navbar :title="'指派任务'" />
    <scroll-view class="list_box" :class="{ padding_box: workList.length != 0 }" :scroll-y="true"
      :show-scrollbar="false" @scrolltolower="scrollBottom" @refresherrefresh="onRefresherrefresh"
      :refresher-triggered="isTriggered" refresher-enabled :lower-threshold="50">
      <wd-checkbox-group v-model="postForm.checkWorks" @change="checkboxChange">
        <view class="work_item" v-for="(item, idx) in workList" :key="idx">
          <view class="work_top">
            <wd-checkbox class="work_title" :modelValue="item.orderId">
              <text class="tit">{{ item?.clientName ? item?.clientName : '-' }}-{{ item?.carPlate ? item?.carPlate :
                '-' }}</text>
              <text class="tags tag1" v-if="item.orderTypeDetail">{{ item.orderTypeDetail }}</text>
              <!-- <text class="tags tag2" v-if="item.orderStatus">{{ item.orderStatus }}</text> -->
            </wd-checkbox>
            <image src="../../static/images/icons/item_arrow.png" class="item_arrow" mode="scaleToFill" />
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
                <image class="position_img" src="../../static/images/homeMap/phone.png"
                  @tap.stop="makePhoneCall(item?.contactPhone)" mode="scaleToFill" />
              </view>
            </view>

            <view class="work_it" v-if="item.orderType == 3">
              <view class="label">新装设备:</view>
              <view class="value">{{ item?.installType ? item?.installType : '-' }}</view>
            </view>
            <view class="work_it" v-else-if="item.orderType == 2">
              <view class="label">运维内容:</view>
              <view class="value">{{ item?.content ? item?.content : '-' }}</view>
            </view>

            <view class="work_it">
              <view class="label">地址:</view>
              <view class="value isImg">
                <text>{{ item?.address ? item?.address : '-' }}</text>
                <image class="position_img" src="../../static/images/homeMap/address.png"
                  @tap.stop="toNavigation(item)" mode="scaleToFill" />
              </view>
            </view>

            <view class="work_it" v-if="item.orderType == 3">
              <view class="label">设备型号:</view>
              <view class="value">{{ item?.terminalModel ? item?.terminalModel : '-' }}</view>
            </view>

            <view class="work_it" v-else-if="item.orderType == 2">
              <view class="label">故障概述:</view>
              <view class="value">{{ item?.faultContent ? item?.faultContent : '-' }}</view>
            </view>

            <view class="work_it">
              <view class="label">设备序列号:</view>
              <view class="value">{{ item?.terminalSerial ? item?.terminalSerial : '-' }}</view>
            </view>

          </view>
          <view class="btn_box">
            <view class="btn" @tap.stop="assignBtn(item)">指派</view>
          </view>
        </view>
      </wd-checkbox-group>
      <wd-status-tip v-if="workList.length == 0" image="content" tip="暂无工单" />
      <wd-loadmore v-if="showLoadmore" custom-class="loadmore" :state="listState" />
    </scroll-view>
    <view class="oneKey" v-if="workList.length != 0">
      <wd-checkbox v-model="allHandleValue" @change="allHandleChange">{{ allHandleValue ? '取消全选' : "全选" }}</wd-checkbox>
      <button class="btn" :disabled="postForm.checkWorks.length == 0" @tap="oneKeyHandle">一键指派</button>
    </view>
    <assignPopup v-if="assignShow" :assignShow="assignShow" :assignInfo="assignInfo" @CloseClick="CloseClick" />
  </view>
</template>
<style lang="scss" scoped>
@import '../../static/css/work.scss';

.assignTask {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f7f7fc;



}
</style>