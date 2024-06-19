<script setup>
import navbar from '@/pages/components/navbar.vue'
import { toNavigation, makePhoneCall } from '@/utils'
import '@/uni.scss'
import AuditPopup from './AuditPopup.vue'
import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库
const Toast = useToast()

const getForm = ref({
  search: null,
  checkWorks: []
})

const AuditTaskList = ref([
  {
    name: '王小虎',
    carNum: '浙E12345',
    vinCode: '12423532523',
    id: 1
  },

  {
    name: '张三',
    carNum: '浙E12345',
    vinCode: '12423532523',
    id: 2
  },

  {
    name: '王小虎',
    carNum: '浙E12345',
    vinCode: '12423532523',
    id: 3
  },

  {
    name: '王小虎',
    carNum: '浙E12345',
    vinCode: '12423532523',
    id: 5
  },

  {
    name: '王小虎',
    carNum: '浙E12345',
    vinCode: '12423532523',
    id: 6
  },
  {
    name: '王小虎',
    carNum: '浙E12345',
    vinCode: '12423532523',
    id: 7
  },
  {
    name: '王小虎',
    carNum: '浙E12345',
    vinCode: '12423532523',
    id: 8
  },
  {
    name: '王小虎',
    carNum: '浙E12345',
    vinCode: '12423532523',
    id: 9
  },
  {
    name: '王小虎',
    carNum: '浙E12345',
    vinCode: '12423532523',
    id: 10
  },
])

const auditShow = ref(false)
const auditInfo = ref({})

onMounted(() => {
  AuditTaskList.value.forEach(item => {
    item.title = `${item.name}-${item.carNum}/${item.vinCode}`
  });
})

const scrollBottom = () => {
  console.log('触底了')
  Toast.loading('加载中...')
  setTimeout(() => {
    Toast.close()
  }, 2000)
}

const checkboxChange = (val) => {
  console.log("🚀 ~ checkboxChange ~ val:", val)
}

const allHandleValue = ref(false)
const allHandleChange = (val) => {
  if (val.value) {
    getForm.value.checkWorks = AuditTaskList.value.map(item => item.id)
  } else {
    getForm.value.checkWorks = []
  }
}

const auditBtn = (item) => {
  console.log("🚀 ~ auditBtn ~ item:", item)
  auditInfo.value = item
  auditShow.value = true
}

const oneKeyHandle = () => {
  console.log("一键审核");
  auditShow.value = true
}

const CloseClick = () => {
  auditShow.value = false
  auditInfo.value = {}
}

</script>

<template>
  <wd-toast></wd-toast>
  <view class="AuditTask">
    <navbar :title="'审核任务'" />
    <scroll-view class="list_box" :scroll-y="true" @scrolltolower="scrollBottom" :show-scrollbar="false">
      <wd-checkbox-group v-model="getForm.checkWorks" @change="checkboxChange">
        <view class="work_item" v-for="(item, idx) in AuditTaskList" :key="idx">
          <view class="work_top">
            <wd-checkbox class="work_title" :modelValue="item.id">
              <text class="tit">{{ item.title }}</text>
              <text class="tags tag1">待接单</text>
            </wd-checkbox>
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
                <image class="position_img" src="http://116.62.107.90:8673/images/homeMap/address.png"
                  @tap="toNavigation" mode="scaleToFill" />
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
          <view class="btn_box" v-if="idx % 2 != 0">
            <view class="btn" @tap="auditBtn(item)">审核</view>
          </view>
        </view>
      </wd-checkbox-group>
    </scroll-view>
    <view class="oneKey">
      <wd-checkbox v-model="allHandleValue" @change="allHandleChange">全选</wd-checkbox>
      <button class="btn" :disabled="getForm.checkWorks.length == 0" @tap="oneKeyHandle">一键审核</button>
    </view>
  </view>
  <AuditPopup v-if="auditShow" :auditShow="auditShow" :auditInfo="auditInfo" @CloseClick="CloseClick" />
</template>
<style lang="scss" scoped>
.AuditTask {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f7f7fc;

  .oneKey {
    width: 100%;
    height: 130rpx;
    position: fixed;
    left: 0;
    bottom: 0;
    background-color: #fff;
    box-shadow: 5rpx 0rpx 11rpx 2rpx rgba(0, 0, 0, 0.16);
    border-radius: 20rpx 20rpx 0rpx 0rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20rpx;
    box-sizing: border-box;

    :deep(.wd-checkbox__shape) {
      width: 42rpx;
      height: 42rpx;
    }

    :deep(.wd-checkbox__txt) {
      font-size: 28rpx;
      color: #999999;
    }

    .btn {
      width: 178rpx;
      height: 66rpx;
      margin: 0 !important;
      background: linear-gradient(126deg, #4557D1 0%, #75DBED 100%);
      border-radius: 36rpx 36rpx 36rpx 36rpx;
      font-size: 30rpx;
      text-align: center;
      line-height: 66rpx;
      color: #FFFFFF;
    }

  }
}
</style>