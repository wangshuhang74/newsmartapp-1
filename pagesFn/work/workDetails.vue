<script setup>
import navbar from '@/pages/components/navbar.vue'
import returnPopup from '../components/returnPopup.vue'
import assignPopup from '../components/assignPopup.vue'
import AuditPopup from '../components/AuditPopup.vue'

import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库
import { toNavigation, makePhoneCall, debounce } from '@/utils'
import { useUserStore, useWorkStore } from '@/store'
import { acceptOrder, complete, getAppOrderInfo, getList } from '@/api'

const { workDetail, workHandle, assignRefresh, auditRefresh } = storeToRefs(useWorkStore())
const Toast = useToast()
const message = useMessage(); // 消息弹框
const workInfo = ref({}) // 传入的工单信息
const workInfoApi = ref({}) // 传入的工单信息
const { userInfo } = storeToRefs(useUserStore())

const assignShow = ref(false) // 指派弹窗
const assignInfo = ref({}) // 指派弹窗信息

const returnShow = ref(false) // 返还弹窗
const returnInfo = ref({}) // 返还弹窗信息

const auditShow = ref(false) // 审核弹窗
const auditInfo = ref({}) // 审核弹窗信息

const getWork = ref({
  pageNum: 1,
  pageSize: 10,
  type: null,
  orderId: null,
})
const records = ref([])

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
  if (workDetail.value) {
    workDetail.value.isAssignTask = workDetail.value.isAssignTask ? true : false // 是否是指派页面进入的详情页
    workDetail.value.isAuditTask = workDetail.value.isAuditTask ? true : false // 是否是审核页面进入的详情页
    workDetail.value.isHistory = workDetail.value.isHistory ? true : false // 是否是历史记录页面进入的详情页
    workInfo.value = { ...workDetail.value }
    getWork.value.orderId = workDetail.value.orderId
    getWork.value.type = workDetail.value.orderType == 2 ? 3 : workDetail.value.orderType == 3 ? 4 : null // orderType == 4 ? 5 : null //行车记录仪
    if (getWork.value.type && !workDetail.value.isAssignTask && !workDetail.value.isAuditTask) getWorkFn()
    getOrderInfo()
    console.log("🚀 ~ onLoad ~ workDetail.value:111111", workDetail.value)
  } else {
    console.log("🚀 ~ onLoad ~ workDetail.value:222222", workDetail.value)
    Toast.warning("没有找到该工单信息")
    setTimeout(() => {
      uni.navigateBack({
        delta: 1
      })
    }, 1000)
  }
})

onMounted(() => {

})


const getOrderInfo = async () => {
  Toast.loading('加载中...')
  const { code, data, msg } = await getAppOrderInfo(workInfo.value.orderId)
  if (code != 0) {
    Toast.error(msg)
    setTimeout(() => {
      Toast.close()
      uni.navigateBack({
        delta: 1
      })
    }, 600)
  } else {
    Toast.close()
    workInfoApi.value = data
    console.log("🚀 ~ getOrderInfo ~ data:", data)
  }

}


const getWorkFn = async () => {
  Toast.loading('加载中...')
  setTimeout(() => {
    Toast.close()
  }, 5000)
  const { code, data, msg } = await getList(getWork.value)
  if (code != 0) return Toast.error(msg)
  Toast.close()
  records.value = data.records
  workInfo.value = data.records[0] ? data.records[0] : workInfo.value
  workDetail.value = data.records[0] ? data.records[0] : workDetail.value
}

const assignBtn = async (item) => {
  assignInfo.value = item
  assignShow.value = true
}

const assignClose = (val) => {
  assignShow.value = false
  assignInfo.value = {}
  if (val != 'refresh') return
  Toast.success("指派成功!")
  assignRefresh.value = true
  uni.navigateBack({
    delta: 1
  })
}

const returnBtn = (item) => { // 退回
  returnInfo.value = item
  returnShow.value = true
}

const returnClose = (val) => {
  returnShow.value = false
  returnInfo.value = {}
  if (val != 'refresh') return
  getWorkFn()
}

const auditBtn = (item) => {
  auditInfo.value = item
  auditShow.value = true
}

const auditClose = (val) => {
  auditShow.value = false
  auditInfo.value = {}
  if (val != 'refresh') return
  Toast.success("审核成功!")
  auditRefresh.value = true
  uni.navigateBack({
    delta: 1
  })
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
      const { code, msg } = await complete(postForm.value)
      if (code == 0) {
        const { code, data, msg } = await acceptOrder(item.orderId)
        console.log("🚀 ~ .then ~ data:", data)
        if (code != 0) return Toast.error(msg)
        Toast.success(msg)
        getWorkFn()
      } else {
        return Toast.error(msg)
      }
    })
    .catch(() => { });
}

const handleWork = (item) => {
  workHandle.value = item
  uni.navigateTo({
    url: "/pagesFn/work/handleWork",
  })
}

const copyBtn = (val) => {
  uni.setClipboardData({
    data: String(val),
    success: function () {
      // Toast.success('复制成功')
    },
    fail: (fail) => {
      console.log("🚀 ~ file: workDetails.vue ~ line 30 ~ fail", fail)
    },
  })
}

const checkRules = (userinfo, item, workInfo) => {// 处理按钮权限
  return item.isAccept == 1 && workInfo.isDealOrder == 0 && !item.isAssignTask && !item.isAuditTask && (userinfo.rules.includes(5) || userinfo.rules.includes(6))
}


</script>
<template>
  <wd-toast></wd-toast>
  <wd-message-box />
  <view class="workDetails">
    <navbar :title="'详情'" />
    <view class="details_center">
      <scroll-view class="workInfo_box" style="width: 100%; height: 100%;" :scroll-y="true" :show-scrollbar="false">
        <view class="top_tit">{{ workInfoApi?.clientName ? workInfoApi?.clientName : '-' }} </view>

        <view class="basic_info">
          <view class="info_item">
            <view class="label">工单编号:</view>
            <view class="value">
              <text>{{ workInfoApi?.orderId ? workInfoApi?.orderId : '-' }}</text>
              <image @tap="copyBtn(workInfoApi?.orderId)" class="copy"
                src="../../static/images/icons/copy.png" mode="scaleToFill" />
            </view>
          </view>

          <view class="info_item">
            <view class="label">联系人:</view>
            <view class="value">
              <text>{{ workInfoApi?.contactName ? workInfoApi?.contactName : '-' }}</text>
            </view>
          </view>


          <view class="info_item">
            <view class="label">联系电话:</view>
            <view class="value">
              <text>{{ workInfoApi?.contactPhone ? workInfoApi?.contactPhone : '-' }}</text>
            </view>
          </view>


          <view class="info_item">
            <view class="label">工单类型:</view>
            <view class="value">
              <text>{{ workInfoApi?.orderTypeDetail ? workInfoApi?.orderTypeDetail : '-' }}</text>
            </view>
          </view>


          <view class="info_item">
            <view class="label">所属区域:</view>
            <view class="value">
              <text>{{ workInfoApi?.areaStr ? workInfoApi?.areaStr : workInfoApi?.area ? workInfoApi?.area : '-'
                }}</text>
            </view>
          </view>


          <view class="info_item ov">
            <view class="label">详细地址:</view>
            <view class="value ">
              <text>{{ workInfoApi?.address ? workInfoApi?.address : '-' }}</text>
            </view>
          </view>
        </view>

        <view class="car_boxs" v-for="(item, idx) in workInfoApi?.orderExtras" :key="idx">
          <!-- 新装 -->
          <view v-if="workInfoApi?.orderType == 3">
            <view class="info_item">
              <view class="label">车牌号码/VIN码:</view>
              <view class="value">
                <text>{{ item?.carPlate ? item?.carPlate : '-' }}</text>
              </view>
            </view>

            <view class="info_item">
              <view class="label">新装设备:</view>
              <view class="value">
                <text>{{ item?.installType ? item?.installType : '-' }}</text>
              </view>
            </view>

            <view class="info_item">
              <view class="label">通道数量:</view>
              <view class="value">
                <text>{{ item?.channelNum ? item?.channelNum : '-' }}</text>
              </view>
            </view>


            <view class="info_item">
              <view class="label">设备品牌:</view>
              <view class="value">
                <text>{{ item?.deviceBrand ? item?.deviceBrand : '-' }}</text>
              </view>
            </view>


            <view class="info_item">
              <view class="label">设备序列号:</view>
              <view class="value">
                <text>{{ item?.deviceSerial ? item?.deviceSerial : '-' }}</text>
              </view>
            </view>

            <view class="info_item">
              <view class="label">设备型号:</view>
              <view class="value">
                <text>{{ item?.deviceModel ? item?.deviceModel : '-' }}</text>
              </view>
            </view>

            <view class="info_item">
              <view class="label">Sim卡号:</view>
              <view class="value">
                <text>{{ item?.simNum ? item?.simNum : '-' }}</text>
              </view>
            </view>

            <view class="info_item">
              <view class="label">预期运维时间:</view>
              <view class="value">
                <text>{{ item?.expectTime ? item?.expectTime : '-' }}</text>
              </view>
            </view>

            <view class="info_item">
              <view class="label">备注:</view>
              <view class="value">
                <text>{{ item?.remark ? item?.remark : '————' }}</text>
              </view>
            </view>

          </view>
          <!-- 维护 -->
          <view v-if="workInfoApi?.orderType == 2">
            <view class="info_item">
              <view class="label">车牌号码/VIN码:</view>
              <view class="value">
                <text>{{ item?.carPlate ? item?.carPlate : '-' }}</text>
              </view>
            </view>

            <view class="info_item">
              <view class="label">通道数量:</view>
              <view class="value">
                <text>{{ item?.channelNum ? item?.channelNum : '-' }}</text>
              </view>
            </view>


            <view class="info_item">
              <view class="label">设备品牌:</view>
              <view class="value">
                <text>{{ item?.deviceBrand ? item?.deviceBrand : '-' }}</text>
              </view>
            </view>


            <view class="info_item">
              <view class="label">设备序列号:</view>
              <view class="value">
                <text>{{ item?.deviceSerial ? item?.deviceSerial : '-' }}</text>
              </view>
            </view>

            <view class="info_item">
              <view class="label">设备型号:</view>
              <view class="value">
                <text>{{ item?.deviceModel ? item?.deviceModel : '-' }}</text>
              </view>
            </view>


            <view class="info_item">
              <view class="label">Sim卡号:</view>
              <view class="value">
                <text>{{ item?.simNum ? item?.simNum : '-' }}</text>
              </view>
            </view>

            <view class="info_item">
              <view class="label">故障概述:</view>
              <view class="value">
                <text>{{ item?.faultContent ? item?.faultContent : '-' }}</text>
              </view>
            </view>

            <view class="info_item">
              <view class="label">运维内容:</view>
              <view class="value">
                <text>{{ item?.content ? item?.content : '-' }}</text>
              </view>
            </view>

            <view class="info_item">
              <view class="label">预期运维时间:</view>
              <view class="value">
                <text>{{ item?.expectTime ? item?.expectTime : '-' }}</text>
              </view>
            </view>

            <view class="info_item">
              <view class="label">备注:</view>
              <view class="value">
                <text>{{ item?.remark ? item?.remark : '————' }}</text>
              </view>
            </view>

          </view>

        </view>

        <view class="workFlow">
          <view class="flow_item" v-for="(item, idx) in workInfoApi?.orderRecords" :key="idx">
            <view class="flow_top">
              <view class="icon"></view>
              <view class="tit">{{ item?.recordState ? item?.recordState : '-' }}</view>
              <view class="time">{{ item?.createTime ? item?.createTime : '-' }}</view>
            </view>
            <view class="flow_center">
              <view class="center">
                <!-- <span class="work_style">客服主管-张三</span> -->
                <span>{{ item?.recordInfo ? item?.recordInfo : '-' }}</span>
              </view>
            </view>
          </view>
        </view>

      </scroll-view>
      <!-- 如果 records.length 是空的 说明这个工单不是待办的工单 只能显示在指派和审核中 -->
      <view class="foot_box" v-if="!workInfo.isHistory">
        <button class="footBtn" @tap="returnBtn(workInfo)"
          v-if="workInfo.isAccept == 0 && userInfo.rules.includes(6)">返还</button>
        <button class="footBtn" @tap="takeOrders(workInfo)"
          v-if="workInfo.isAccept == 0 && (userInfo.rules.includes(5) || userInfo.rules.includes(6)) && !workInfo.isAssignTask && !workInfo.isAuditTask">接单</button>
        <button class="footBtn" v-if="checkRules(userInfo, workInfo, workInfoApi)"
          @tap="handleWork(workInfo)">处理</button>
        <button class="footBtn" v-if="workInfo.isAssignTask" @tap="assignBtn(workInfo)">指派</button>
        <button class="footBtn" v-if="workInfo.isAuditTask" @tap="auditBtn(workInfo)">审核</button>
      </view>

    </view>
    <returnPopup v-if="returnShow" :returnShow="returnShow" :returnInfo="returnInfo" @CloseClick="returnClose" />
    <assignPopup v-if="assignShow" :assignShow="assignShow" :assignInfo="assignInfo" @CloseClick="assignClose" />
    <AuditPopup v-if="auditShow" :auditShow="auditShow" :auditInfo="auditInfo" @CloseClick="auditClose" />
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
    height: 90%;
    padding: 30rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .workInfo_box {
      width: 100%;
      flex: 1;
      padding: 30rpx;
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
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;

          .copy {
            width: 30rpx;
            height: 30rpx;
            margin-left: 10rpx;
            margin-bottom: 15rpx;
          }
        }



      }

      .ov {
        min-height: 80rpx;

        .value {
          line-height: 32rpx;
          //超过两行显示省略号
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
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

      .workFlow {
        width: 100%;
        min-height: 200rpx;

        .flow_item {
          width: 100%;
          min-height: 120rpx;

          &:first-child {
            .flow_top {
              .tit {
                color: #1082FF !important;
              }

              .icon {
                background-color: #1082FF !important;
              }
            }

          }

          &:last-child {
            .flow_center {
              border-left: none;
            }
          }


          .flow_top {
            width: 100%;
            height: 60rpx;
            line-height: 60rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .tit {
              font-size: 26rpx;
              color: #8D949A;
              flex: 1;
              text-align: left;
            }

            .time {
              min-width: 120rpx;
              text-align: right;
              font-size: 26rpx;
              color: #8D949A;
            }

            .icon {
              width: 24rpx;
              height: 24rpx;
              border-radius: 50%;
              background-color: #C3C3C3;
              margin-right: 8rpx;
            }

          }

          .flow_center {
            width: 98%;
            min-height: 70rpx;
            border-left: 4rpx solid #DBDBDB;
            margin-left: 10rpx;

            .center {
              margin-left: 20rpx;
              white-space: normal;
              word-wrap: break-word;
              word-break: break-all;
              overflow: hidden;
              box-sizing: border-box;
              padding: 10rpx 20rpx;
              background-color: #E6E6E6;
              font-size: 24rpx;
              color: #272727;

              .work_style {
                display: inline-block;
                padding: 0rpx 16rpx;
                background: #F5FAFF;
                border-radius: 5rpx 5rpx 5rpx 5rpx;
                border: 1px solid #1082FF;
                color: #1082FF;
                font-size: 26rpx;
                color: #1082FF;
                margin: 2rpx 6rpx;
              }
            }
          }
        }
      }
    }

    .foot_box {
      width: 100%;
      margin-top: 20rpx;
      margin-bottom: 20rpx;
      display: flex;
      align-items: center;
      justify-content: space-around;

      .footBtn {
        flex: 1;
        height: 88rpx;
        margin: 20rpx 10rpx 40rpx 10rpx;
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