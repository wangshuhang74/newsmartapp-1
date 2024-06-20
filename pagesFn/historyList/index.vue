<script setup>
import '../../style/work.scss'
import { useNotify, useToast, useMessage, useQueue } from 'wot-design-uni' // ui组件库
import { toNavigation, makePhoneCall, debounce } from '@/utils'
import dayjs from 'dayjs';

const Toast = useToast()
const { safeAreaInsets } = uni.getSystemInfoSync()

const getForm = ref({
  search: null
})

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

const scrollBottom = () => {
  console.log('触底了')
  Toast.loading('加载中...')
  setTimeout(() => {
    Toast.close()
  }, 1000)
}

const leftBtn = () => {
  console.log('leftBtn')
  uni.navigateBack()
}



const { closeOutside } = useQueue()
const sliderValue = ref(Date.now())
const sliderShow = ref("时间段")
const value2 = ref(1)
const value3 = ref(1)
const value4 = ref(1)

const dropMenu = ref(null) // 

function handleConfirm() { //自定义时间下拉 确定按钮
  console.log("🚀 ~ handleConfirm ~ handleConfirm:",)
  sliderShow.value = dayjs(sliderValue.value).format("YY-MM-DD")
  dropMenu.value.close()
}

function handleClose() { //自定义时间下拉 关闭按钮
  console.log("🚀 ~ handleClose ~ handleClose:",)
  sliderShow.value = '时间段'
  sliderValue.value = null
  dropMenu.value.close()
}

function handleOpened() { //自定义时间下拉 打开时触发
  // if (!sliderValue.value) sliderValue.value = new Date()
  console.log("handleOpened()");
}

const option2 = ref([
  { label: '工单类型', value: 1 },
  { label: '工单类型2', value: 2 },
  { label: '工单类型3', value: 3 }
])
const option3 = ref([
  { label: '工程师', value: 1 },
  { label: '工程师2', value: 2 },
  { label: '工程师3', value: 3 }
])

const option4 = ref([
  { label: '客户企业', value: 1 },
  { label: '客户企业2', value: 2 },
  { label: '客户企业3', value: 3 },
  { label: '客户企业4', value: 4 },
  { label: '客户企业5', value: 5 },
  { label: '客户企业6', value: 6 },
  { label: '客户企业7', value: 7 },
  { label: '客户企业8', value: 8 },
  { label: '客户企业9', value: 9 },
  { label: '客户企业10', value: 10 },
  { label: '客户企业11', value: 11 },
  { label: '客户企业12', value: 12 },
  { label: '客户企业13', value: 13 },
  { label: '客户企业14', value: 14 },
  { label: '客户企业15', value: 15 },

])

function handleChange2({ value }) {
  console.log(value)
}
function handleChange3({ value }) {
  console.log(value)
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
        <wd-drop-menu-item :title="sliderShow" ref="dropMenu" @opened="handleOpened" icon-name="history"
          close-on-click-modal>
          <view>
            <wd-datetime-picker-view type="date" v-model="sliderValue" :maxDate="new Date()" />
            <view class="btns">
              <wd-button type="info" @tap="handleClose">取消</wd-button>
              <wd-button @tap="handleConfirm">确定</wd-button>
            </view>
          </view>
        </wd-drop-menu-item>
        <!-- <wd-drop-menu-item v-model="value1" :options="option1" @change="handleChange1" /> -->
        <wd-drop-menu-item v-model="value2" :options="option2" @change="handleChange2" />
        <wd-drop-menu-item v-model="value3" disabled :options="option3" @change="handleChange3" />
        <wd-drop-menu-item v-model="value4" :options="option4" @change="handleChange4" />
      </wd-drop-menu>
    </view>

    <scroll-view class="list_box" :scroll-y="true" :show-scrollbar="false" @scrolltolower="scrollBottom">
      <view class="work_item" v-for="(item, idx) in 10">
        <view class="work_top">
          <image src="http://116.62.107.90:8673/images/fns/map.png" class="work_icon" mode="scaleToFill" />
          <view class="work_title">
            <text class="tit">客户名称-车牌号码/VIN码</text>
            <text class="tags tag1">待接单</text>
            <!-- <text class="tags tag2">待新装</text> -->
            <!-- <text class="tags tag3">待运维</text> -->
          </view>
          <image src="http://116.62.107.90:8673/images/icons/item_arrow.png" class="item_arrow" mode="scaleToFill" />
        </view>
        <view class="work_center " :class="{ no: idx % 2 == 0 }">
          <view class="work_it">
            <view class="label">联系人:</view>
            <view class="value">张三</view>
          </view>

          <view class="work_it">
            <view class="label">联系电话:</view>
            <view class="value isImg">
              <text>13828282828</text>
              <image class="position_img" src="http://116.62.107.90:8673/images/homeMap/phone.png"
                @tap="makePhoneCall(19815103583)" mode="scaleToFill" />
            </view>
          </view>


          <view class="work_it">
            <view class="label">新装设备:</view>
            <view class="value">行车记录仪行车记录仪行车记录仪行车记录仪行车记录仪</view>
          </view>

          <view class="work_it">
            <view class="label">地址:</view>
            <view class="value isImg">
              <text>阳光大道238号阳光大道238号阳光大道238号</text>
              <image class="position_img" src="http://116.62.107.90:8673/images/homeMap/address.png" @tap="toNavigation"
                mode="scaleToFill" />
            </view>
          </view>

          <view class="work_it">
            <view class="label">设备型号:</view>
            <view class="value">XT001</view>
          </view>

          <view class="work_it">
            <view class="label">设备序列号:</view>
            <view class="value">XT001</view>
          </view>
        </view>
        <!-- <view class="btn_box" v-if="idx % 2 != 0">
          <view class="btn" @tap="returnBtn(item)">返还</view>
          <view class="btn">处理</view>
        </view> -->
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
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