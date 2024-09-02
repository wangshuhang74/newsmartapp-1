<script setup>
import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库
import { toNavigation, makePhoneCall, debounce } from '@/utils'
import { getAppOrderManager, backOrder, complete } from '@/api'
import { useUserStore } from '@/store'

const Toast = useToast()
const { userInfo } = storeToRefs(useUserStore())

const returnPopup = ref(null)
const emits = defineEmits(['CloseClick'])
const { returnShow, returnInfo } = defineProps({
  returnShow: {
    type: Boolean,
    default: false
  },
  returnInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const postForm = ref({
  comment: 0,
  procInsId: null,
  instanceId: null,
  deployId: null,
  taskId: null,
  variables: {
    comment: 0,
    approval: null,
    remark: null
  },
  executionId: null
})

// orderId: null,
// remark: null,

const personnel = ref('未获取到账号信息!')
const superior = ref({
  personnel: null,
  userName: null,
  phone: null
})

onMounted(() => {
  returnPopup.value.open("bottom")
  console.log("returnInfo", returnInfo);
  postForm.value.procInsId = returnInfo.procInsId
  postForm.value.instanceId = returnInfo.procInsId
  postForm.value.deployId = returnInfo.deployId
  postForm.value.taskId = returnInfo.taskId
  postForm.value.executionId = returnInfo.executionId
  if (returnInfo.orderId) {
    getAppOrderManagerFn(returnInfo.orderId)
  } else {
    Toast.warning('未获取到工单Id')
  }
  personnel.value = userInfo.value.userName + "-" + userInfo.value.phone
})


const getAppOrderManagerFn = async (id) => {
  const { code, data, msg } = await getAppOrderManager(id)
  console.log("🚀 ~ getAppOrderManagerFn ~ data:", data)
  if (code != 0) return
  superior.value.personnel = data.userName + "-" + data.phone
  superior.value.userName = data.userName
  superior.value.phone = data.phone
  postForm.value.variables.approval = data.userId
}
 
const isOkBtn = async () => {
  if (!postForm.value.variables.remark) return Toast.warning('请输入理由!')
  console.log("postForm.value", postForm.value);
  const { code, data, msg } = await complete(postForm.value)
  if (code != 0) return Toast.error(msg)
  Toast.success(msg)
  handlePopupsClose('refresh')
}
const handlePopupsClose = (val) => {
  console.log("🚀 ~ handlePopupsClose ~ val:", val)
  emits('CloseClick', val)
};

</script>

<template>
  <wd-toast></wd-toast>
  <uni-popup ref="returnPopup" type="dialog" :is-mask-click="false">
    <view class="popupContent">

      <view class="top_tit">
        <text>返还</text>
        <image class="img_close" @tap="handlePopupsClose" src="../../static/images/logins/close46.png"
          mode="scaleToFill" />
      </view>

      <view class="input_box">
        <view class="input_phone">
          <text>上级主管: {{ superior.personnel ? superior.personnel : '未获取到上级信息!' }}</text>
          <image class="position_img" src="../../static/images/homeMap/phone.png"
            @tap="makePhoneCall(superior.phone)" mode="scaleToFill" v-if="superior.personnel" />
        </view>


        <view class="input_item">
          <view class="label">返还人:</view>
          <view class="inp_value">
            <input class="inp" type="text" v-model="personnel" disabled placeholder="系统自识别">
          </view>
        </view>

        <view class="input_item">
          <view class="label requiredLabel">理由:</view>
          <view class="inp_value remark">
            <textarea class="textarea_inp" autosize maxlength="200" v-model="postForm.variables.remark" show-confirm-bar
              placeholder="请输入理由"></textarea>
          </view>
        </view>
      </view>

      <view class="btn_box">
        <button class="isOkBtn" @tap="isOkBtn">确定</button>
      </view>
    </view>
  </uni-popup>

</template>
<style lang="scss" scoped>
.requiredLabel {
    position: relative;
    &::before {
        content: '*';
        color: red;
        position: absolute;
        left: -16rpx;
        top: -4rpx;
    }
}
.popupContent {
  width: 100%;
  height: 620rpx;
  background-color: #fff;
  border-radius: 30rpx 30rpx 0 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  .top_tit {
    width: 86%;
    height: 90rpx;
    text-align: center;
    font-size: 32rpx;
    color: #000000;
    line-height: 100rpx;
    border-bottom: 4rpx solid #EFEFEF;
    position: relative;

    .img_close {
      width: 50rpx;
      height: 50rpx;
      margin-top: 30rpx;
      position: absolute;
      right: -24rpx;
      bottom: 16rpx;
    }
  }

  .input_box {
    width: 86%;
    flex: 1;
    padding: 30rpx 0;

    .input_phone {
      width: 100%;
      height: 60rpx;
      display: flex;
      align-items: center;

      .position_img {
        width: 30rpx;
        height: 30rpx;
        margin-left: 20rpx;
      }
    }

    .input_item {
      width: 100%;
      min-height: 140rpx;
      display: flex;
      align-items: center;

      .label {
        min-width: 120rpx;
        font-size: 30rpx;
        color: #AAAAAA;
      }

      .inp_value {
        flex: 1;
        min-height: 66rpx;
        border-radius: 6rpx 6rpx 6rpx 6rpx;
        border: 2rpx solid #D8D8D8;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .inp {
          width: 96%;
          padding-left: 10rpx;
          box-sizing: border-box;
          border: none;
        }

        .placehold {
          font-size: 30rpx;
          color: #AAAAAA;
          line-height: 66rpx;
          margin-left: 10rpx;
        }

        .placehold_img {
          width: 18rpx;
          height: 32rpx;
          transform: rotate(90deg);
        }

        .placehold_value {
          color: #000000;
          font-size: 30rpx;
          line-height: 66rpx;
          margin-left: 10rpx;
        }

        :deep(.uni-textarea-placeholder) {
          font-size: 30rpx;
          color: #AAAAAA;
        }

      }

      .remark {
        height: 120rpx;
        padding: 10rpx;
        box-sizing: border-box;

        .textarea_inp {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          border: none;
          font-size: 28rpx;
        }
      }


    }

  }

  .btn_box {
    width: 86%;
    height: 120rpx;

    .isOkBtn {
      width: 100%;
      height: 88rpx;
      font-size: 36rpx;
      color: #FFFFFF;
      background: linear-gradient(90deg, #1082FF 0%, #5FA9FF 100%);
      border-radius: 14rpx 14rpx 14rpx 14rpx;
    }
  }
}
</style>