<script setup>
import navbar from '@/pages/components/navbar.vue'
import '@/uni.scss'
import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库
const Toast = useToast()
const { safeAreaInsets } = uni.getSystemInfoSync()

const getForm = ref({
  search: null
})

const scrollBottom = () => {
  console.log('触底了')
  Toast.loading('加载中...')
  setTimeout(() => {
    Toast.close()
  }, 2000)
}

const leftBtn = () => {
  console.log('leftBtn')
  uni.navigateBack()
}

const makePhoneCall = (phone) => {
  uni.makePhoneCall({
    phoneNumber: phone,
    success() {
      console.log('拨打电话成功');
    },
    fail(err) {
      console.error('拨打电话失败', err);
    }
  });
}

const toNavigation = (val) => {
  console.log("打开导航", val);
  if (!val.latitude || !val.longitude) {
    uni.showToast({
      title: '暂无坐标信息',
      icon: 'none'
    })
    return
  }
  val.latitude = val.latitude * 1
  val.longitude = val.longitude * 1
  if (typeof val.latitude !== 'number' || typeof val.longitude !== 'number') {
    uni.showToast({
      title: '坐标信息错误',
      icon: 'none'
    })
    return
  }
  uni.openLocation({
    latitude: val.latitude,
    longitude: val.longitude,
    name: val.name,
    address: val.address,
    success: function () {
      console.log('success');
    },
    fail: function (err) {
      console.log('err', err);
    },
  });
}


</script>

<template>
  <wd-toast></wd-toast>
  <view class="AuditTask">
    <navbar :title="'审核任务'" />
    <scroll-view class="list_box" :scroll-y="true" @scrolltolower="scrollBottom">
      <view class="work_item" v-for="item in 10">
        <view class="work_top">
          <image src="http://116.62.107.90:8673/images/fns/map.png" class="work_icon" mode="scaleToFill" />
          <view class="work_title">
            <span class="tit">客户名称-车牌号码/VIN码</span>
            <span class="tags tag1">待接单</span>
            <!-- <span class="tags tag2">待新装</span> -->
            <!-- <span class="tags tag3">待运维</span> -->
          </view>
          <image src="http://116.62.107.90:8673/images/icons/item_arrow.png" class="item_arrow" mode="scaleToFill" />
        </view>
        <view class="work_center " :class="{ no: item % 2 == 0 }">
          <view class="work_it">
            <view class="label">联系人:</view>
            <view class="value">张三</view>
          </view>

          <view class="work_it">
            <view class="label">联系电话:</view>
            <view class="value">
              <span>13828282828</span>
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
            <view class="value">
              <span>阳光大道238号阳光大道238号阳光大道238号</span>
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
        <view class="btn_box" v-if="item % 2 != 0">
          <view class="btn">审核</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
<style lang="scss" scoped>
.AuditTask {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f7f7fc;

}
</style>