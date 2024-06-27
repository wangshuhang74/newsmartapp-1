<script setup>
import navbar from '@/pages/components/navbar.vue'
import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库
import { toNavigation, makePhoneCall, debounce } from '@/utils'
import { useWorkStore } from '@/store'
const { workDetail } = storeToRefs(useWorkStore())
const Toast = useToast()
const workInfo = ref({})
const { safeAreaInsets, windowHeight } = uni.getSystemInfoSync()
const viewportHeight = windowHeight - safeAreaInsets.top + 50 - 80
console.log("🚀 ~ windowHeight:", windowHeight)
console.log("🚀 ~ viewportHeight:", viewportHeight)

onMounted(() => {
  if (workDetail.value) {
    workInfo.value = workDetail.value
    console.log("🚀 ~ onLoad ~ workDetail.value:", workDetail.value)
  } else {
    Toast.warning("没有找到该工单信息")
    setTimeout(() => {
      uni.navigateBack({
        delta: 1
      })
    }, 1000)
  }
})


const copyBtn = (val) => {
  uni.setClipboardData({
    data: val,
    success: function () {
      // Toast.success('复制成功')
    }
  })
}
</script>
<template>
  <wd-toast></wd-toast>
  <view class="workDetails">
    <navbar :title="'详情'" />
    <view class="details_center">
      <view class="scrol_box">
        <scroll-view class="workInfo_box" :scroll-y="true" :show-scrollbar="false">
          <view class="top_tit">客户名称 </view>

          <view class="basic_info">
            <view class="info_item">
              <view class="label">工单编号:</view>
              <view class="value">
                <text>21424235345234634645634</text>
                <image @tap="copyBtn(123)" class="copy" src="http://116.62.107.90:8673/images/icons/copy.png"
                  mode="scaleToFill" />
              </view>
            </view>

            <view class="info_item">
              <view class="label">联系人:</view>
              <view class="value">
                <text>张三</text>
              </view>
            </view>


            <view class="info_item">
              <view class="label">联系电话:</view>
              <view class="value">
                <text>12353453464</text>
              </view>
            </view>


            <view class="info_item">
              <view class="label">工单类型:</view>
              <view class="value">
                <text>车辆新装</text>
              </view>
            </view>


            <view class="info_item">
              <view class="label">所属区域:</view>
              <view class="value">
                <text>浙江省杭州市萧山区</text>
              </view>
            </view>


            <view class="info_item">
              <view class="label">详细地址:</view>
              <view class="value">
                <text>浙江省杭州市萧山区阳光大道250号</text>
              </view>
            </view>




          </view>

          <view class="car_boxs" v-for="item in 11">
            <view v-if="1">
              <view class="info_item">
                <view class="label">车牌号码/VIN码:</view>
                <view class="value">
                  <text>19</text>
                </view>
              </view>


              <view class="info_item">
                <view class="label">通道数量:</view>
                <view class="value">
                  <text>10</text>
                </view>
              </view>


              <view class="info_item">
                <view class="label">设备品牌:</view>
                <view class="value">
                  <text>海康</text>
                </view>
              </view>


              <view class="info_item">
                <view class="label">设备序列号:</view>
                <view class="value">
                  <text>28192</text>
                </view>
              </view>

              <view class="info_item">
                <view class="label">设备型号:</view>
                <view class="value">
                  <text>TK28192</text>
                </view>
              </view>


              <view class="info_item">
                <view class="label">Sim卡号:</view>
                <view class="value">
                  <text>28192</text>
                </view>
              </view>

              <view class="info_item">
                <view class="label">故障概述:</view>
                <view class="value">
                  <text>sim损坏</text>
                </view>
              </view>

              <view class="info_item">
                <view class="label">运维内容:</view>
                <view class="value">
                  <text>XXXXXXXX</text>
                </view>
              </view>

              <view class="info_item">
                <view class="label">预期运维时间:</view>
                <view class="value">
                  <text>2024-12-12 12:00:00</text>
                </view>
              </view>

              <view class="info_item">
                <view class="label">备注:</view>
                <view class="value">
                  <text>——</text>
                </view>
              </view>

            </view>

          </view>

        </scroll-view>
        <view class="foot_box">
          <button class="footBtn">返还</button>
          <button class="footBtn">处理</button>
        </view>
      </view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.workDetails {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f7f7fc;


  .details_center {
    flex: 1;
    padding: 30rpx;
    box-sizing: border-box;


    .scrol_box {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }


    .workInfo_box {
      flex: 1;
      padding: 20rpx 10rpx 20rpx 30rpx;
      box-sizing: border-box;
      background-color: #fff;
      box-shadow: 0rpx 5rpx 11rpx 2rpx rgba(0, 0, 0, 0.09);
      border-radius: 14rpx 14rpx 14rpx 14rpx;
      overflow-y: scroll;

      .top_tit {
        width: 100%;
        height: 60rpx;
        line-height: 50rpx;
        overflow: hidden;
        font-weight: bold;
        font-size: 28rpx;
        color: #191919;
        border-bottom: 4rpx solid #EFEFEF;
        margin-bottom: 20rpx;
      }

      .info_item {
        width: 100%;
        height: 60rpx;
        line-height: 60rpx;
        display: flex;
        align-items: center;

        .label {
          min-width: 100rpx;
          line-height: 50rpx;
          font-size: 26rpx;
          color: #AAAAAA;
        }

        .value {
          flex: 1;
          margin-left: 20rpx;
          line-height: 50rpx;
          font-size: 26rpx;
          color: #000000;
          white-space: nowrap;
          /* 不换行 */
          overflow: hidden;
          /* 溢出隐藏 */
          text-overflow: ellipsis;
          /* 超出部分显示省略号 */

          .copy {
            width: 30rpx;
            height: 30rpx;
            margin-left: 10rpx;
            margin-bottom: 15rpx;
          }
        }

      }

      .basic_info {
        width: 100%;
        padding-bottom: 20rpx;
        margin-bottom: 20rpx;
        border-bottom: 4rpx solid #EFEFEF;
      }

      .car_boxs {
        width: 100%;
        padding-bottom: 20rpx;
        margin-bottom: 20rpx;
        border-bottom: 4rpx solid #EFEFEF;
      }


    }

    .foot_box {
      width: 100%;
      height: 120rpx;
      margin-top: 30rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .footBtn {
        width: 45%;
        height: 88rpx;
        background: linear-gradient(90deg, #1082FF 0%, #5FA9FF 100%);
        border-radius: 14rpx 14rpx 14rpx 14rpx;
        font-size: 36rpx;
        color: #FFFFFF;
        text-align: center;
        line-height: 88rpx;
      }
    }
  }

}
</style>