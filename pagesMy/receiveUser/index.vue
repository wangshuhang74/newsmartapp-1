<script setup>
import navbar from '@/pages/components/navbar.vue'
import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库
import Alipay from "../../static/images/my/Alipay.png"
import WeChatPay from "../../static/images/my/WeChatPay.png"

const Toast = useToast()

const columnsOrg = ref(['企业1', '企业2', '企业3', '企业4', '企业5', '企业6', '企业7'])
const columnsWork = ref(['工单1', '工单2', '工单3', '工单4', '工单5', '工单6', '工单7'])
const postForm = ref({
  orgValue: null,
  workValue: null,
  timeValue: null,
  price: null,
  payment: 3

})
const payBtn = async () => {

}

function handleConfirmOrg({ value }) {
  postForm.value.orgValue = value
}

function handleConfirmWork({ value }) {
  postForm.value.workValue = value
}

function radioChange(e) {
  console.log("🚀 ~ radioChange ~ e:", e)
}

function priceBlur() {
  console.log("🚀 ~ priceBlur ~ postForm.value.price:", postForm.value.price)
  postForm.value.price = parseFloat(postForm.value.price).toFixed(2);
}

</script>
<template>
  <wd-toast></wd-toast>
  <view class="receiveUser">
    <navbar :title="'用户收款'" />
    <view class="receive_flow">
      <view class="select_org_box">
        <wd-picker :columns="columnsOrg" custom-class="selects" label="选择付款企业:" v-model="postForm.orgValue"
          @confirm="handleConfirmOrg" />
      </view>

      <view class="select_work_box">
        <wd-picker :columns="columnsWork" custom-class="selects " label="工单:" v-model="postForm.workValue"
          @confirm="handleConfirmWork" />
        <view class="times">
          <view class="label">完成时间:</view>
          <view class="time_val">{{ postForm.timeValue ? postForm.timeValue : '系统自识别' }}</view>
        </view>
        <view class="price_box">
          <view class="price_label">金额</view>
          <input class="price_val" type="number" placeholder="请输入金额" v-model.number="postForm.price"
            @blur="priceBlur" />
        </view>
      </view>

      <view class="tps">请选择支付方式</view>

      <view class="pay_box">
        <!-- dot 点状单选 -->
        <wd-radio-group v-model="postForm.payment" shape="dot" @change="radioChange">
          <wd-radio :value="1">
            <image class="zfb_img" src="../../static/images/my/zfb.png" mode="scaleToFill" />
            <text class="pay_text">支付宝支付</text>
          </wd-radio>


          <wd-radio :value="2">
            <image class="wx_img" src="../../static/images/my/wx.png" mode="scaleToFill" />
            <text class="pay_text">微信支付</text>
          </wd-radio>

          <wd-radio :value="3">
            <image class="xj_img" src="../../static/images/my/xj.png" mode="scaleToFill" />
            <text class="pay_text">现金支付</text>
          </wd-radio>
        </wd-radio-group>

        <view class="qr_code_box" v-if="postForm.payment == 1 || postForm.payment == 2">
          <image :src="postForm.payment == 1 ? Alipay : WeChatPay" class="qr_img" mode="scaleToFill" />
        </view>

      </view>

      <button class="payBtn" @tap="payBtn">请扫码支付/已完成付款</button>


    </view>
  </view>
</template>
<style lang="scss" scoped>
.receiveUser {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f7f7fc;

  .receive_flow {
    flex: 1;
    width: 100;
    overflow-y: scroll;
    padding: 30rpx;
    padding-bottom: 20rpx;
    box-sizing: border-box;

    .label {
      font-weight: 400;
      font-size: 24rpx;
      color: #AAAAAA;
    }

    .select_org_box {
      width: 100%;
      height: 100rpx;
      display: flex;
      align-items: center;
      background: #FFFFFF;
      box-shadow: 0rpx 5rpx 11rpx 2rpx rgba(0, 0, 0, 0.09);
      border-radius: 14rpx 14rpx 14rpx 14rpx;
      overflow: hidden;
      margin-bottom: 40rpx;
    }

    .select_work_box {
      width: 100%;
      height: 310rpx;
      background: #FFFFFF;
      box-shadow: 0rpx 5rpx 11rpx 2rpx rgba(0, 0, 0, 0.09);
      border-radius: 14rpx 14rpx 14rpx 14rpx;
      overflow: hidden;
      margin-bottom: 40rpx;

      .times {
        width: 95%;
        height: 90rpx;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 6rpx dashed #B2B2B2;
        padding-bottom: 10rpx;

        .time_val {
          text-align: right;
          font-size: 28rpx;
          color: #000000;
          margin-right: 20rpx;
        }
      }

      .price_box {
        width: 95%;
        height: 120rpx;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .price_label {
          font-weight: bold;
          font-size: 30rpx;
          color: #000000;
        }

        :deep(.price_val) {
          font-weight: bold;
          flex: 1;
          text-align: right;
          margin-right: 20rpx;

          .uni-input-wrapper {
            font-size: 30rpx;
            color: #A21616;
          }

          .input-placeholder {
            font-size: 30rpx;
            color: #A21616;
          }

        }

      }

    }

    .tps {
      width: 100%;
      height: 60rpx;
      line-height: 60rpx;
      font-size: 26rpx;
      color: #000000;
    }

    .pay_box {
      width: 100%;
      min-height: 250rpx;
      background: #FFFFFF;
      box-shadow: 0rpx 5rpx 11rpx 2rpx rgba(0, 0, 0, 0.09);
      border-radius: 14rpx 14rpx 14rpx 14rpx;
      overflow: hidden;
      margin-bottom: 120rpx;

      :deep(.wd-radio-group) {
        width: 92%;
        margin: 10rpx auto;
        height: 250rpx;

        .wd-radio {
          width: 100%;
          height: 70rpx;
          border-bottom: 2rpx solid #EFEFEF;
          display: flex;
          align-items: center;

          &:last-child {
            border-bottom: none;
          }

          image {
            margin-right: 10rpx;
            margin-bottom: 6rpx;
          }

          .zfb_img {
            width: 38rpx;
            height: 38rpx;
          }

          .wx_img {
            width: 44rpx;
            height: 36rpx;
          }

          .xj_img {
            width: 43rpx;
            height: 36rpx;
          }

          .pay_text {
            font-size: 26rpx;
            color: #000000;
          }

        }
      }

      .qr_code_box {
        width: 100%;
        height: 330rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 30rpx;

        .qr_img {
          width: 280rpx;
          height: 280rpx;
        }
      }

    }

    .payBtn {
      width: 100%;
      height: 90rpx;
      font-size: 36rpx;
      color: #FFFFFF;
      background: linear-gradient(90deg, #1082FF 0%, #5FA9FF 100%);
      border-radius: 14rpx 14rpx 14rpx 14rpx;
    }

    :deep(.selects) {
      width: 100%;
      height: 80rpx;

      .wd-picker__field {
        width: 100%;
        height: 80rpx;
        padding: 0;
        margin: 0;
      }

      .wd-picker__cell {
        padding: 20rpx !important;
      }

      .wd-picker__label {
        padding: 0 !important;
        font-size: 26rpx;
        color: #AAAAAA;
      }

      .wd-picker__value {
        text-align: right;
        font-size: 28rpx;
        color: #000000;
      }

    }
  }
}
</style>