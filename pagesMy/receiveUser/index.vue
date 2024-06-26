<script setup>
import navbar from '@/pages/components/navbar.vue'
import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库
import Alipay from "../../static/images/my/Alipay.png"
import WeChatPay from "../../static/images/my/WeChatPay.png"
import { getPayClient, getList, userPayment } from '@/api'

const Toast = useToast()
const columnsOrg = ref([])
const columnsWork = ref([])
const payInfo = ref({
})

const payForm = ref({
  orderId: 0, //工单id
  payAmount: "00.00", //支付金额
  payWay: "现金", //支付方式
})

const getWorkForm = ref({
  pageNum: 1,
  pageSize: 999,
  type: 10,
  clientId: null
})
const workList = ref([])


onMounted(() => {
  getPayClientFn()
})

const payBtn = async () => {
  const { code, data, msg } = await userPayment(payForm.value)
  if (code != 0) return Toast.error(msg)
  Toast.success("支付完成")
}

const getPayClientFn = async () => {
  const { code, data, msg } = await getPayClient()
  if (code != 0) return Toast.warning(msg)
  columnsOrg.value = data.map(item => {
    return {
      label: item.clientName,
      value: item.clientId
    }
  })
}

const getWorkListFn = async () => {
  console.log("getWorkListFn");
  const { code, data, msg } = await getList(getWorkForm.value)
  if (code != 0) return Toast.error(msg)
  workList.value = data.records
  columnsWork.value = data.records.map(item => {
    return {
      label: item.orderId,
      value: item.orderId
    }
  })
}

function handleConfirmOrg({ value }) {
  getWorkForm.value.clientId = value
  getWorkListFn()
}

function handleConfirmWork(res) {
  workList.value.forEach(item => {
    if (item.orderId == res.value) {
      payInfo.value = item
    }
  })
}

function radioChange(e) { }
function payAmountBlur() { }

</script>
<template>
  <wd-toast></wd-toast>
  <view class="receiveUser">
    <navbar :title="'用户收款'" />
    <view class="receive_flow">
      <view class="select_org_box">
        <wd-picker :columns="columnsOrg" custom-class="selects" label="选择付款企业:" @confirm="handleConfirmOrg" />
      </view>
      <view class="select_work_box">
        <wd-picker :columns="columnsWork" custom-class="selects" :readonly="!getWorkForm.clientId" label="工单编号:"
          @confirm="handleConfirmWork" />
        <view class="times">
          <view class="label">完成时间:</view>
          <view class="time_val">{{ payInfo.createTime ? payInfo.createTime : '系统自识别' }}</view>
        </view>
        <view class="payAmount_box">
          <view class="payAmount_label">金额</view>
          <input class="payAmount_val" type="number" disabled placeholder="0.00" v-model.number="payForm.payAmount"
            @blur="payAmountBlur" />
        </view>
      </view>

      <view class="tps">请选择支付方式</view>

      <view class="pay_box">
        <wd-radio-group v-model="payForm.payWay" shape="dot" @change="radioChange">
          <wd-radio value="支付宝">
            <image class="zfb_img" src="../../static/images/my/zfb.png" mode="scaleToFill" />
            <text class="pay_text">支付宝支付</text>
          </wd-radio>

          <wd-radio value="微信">
            <image class="wx_img" src="../../static/images/my/wx.png" mode="scaleToFill" />
            <text class="pay_text">微信支付</text>
          </wd-radio>

          <wd-radio value="现金">
            <image class="xj_img" src="../../static/images/my/xj.png" mode="scaleToFill" />
            <text class="pay_text">现金支付</text>
          </wd-radio>
        </wd-radio-group>

        <view class="qr_code_box" v-if="payForm.payWay == '支付宝' || payForm.payWay == '微信'">
          <image :src="payForm.payWay == '支付宝' ? Alipay : WeChatPay" class="qr_img" mode="scaleToFill" />
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

        .label {
          margin-left: 8rpx;
        }

        .time_val {
          text-align: right;
          font-size: 28rpx;
          color: #000000;
          margin-right: 20rpx;
        }
      }

      .payAmount_box {
        width: 95%;
        height: 120rpx;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .payAmount_label {
          font-weight: bold;
          font-size: 30rpx;
          color: #000000;
        }

        :deep(.payAmount_val) {
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
      margin-bottom: 60rpx;

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