<script setup>
import { complete } from '@/api'
import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库

const Toast = useToast()
const auditPopup = ref(null)
const emits = defineEmits(['CloseClick'])
const { auditShow, auditInfo } = defineProps({
  auditShow: {
    type: Boolean,
    default: false
  },
  auditInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

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

onMounted(() => {
  auditPopup.value.open("bottom")
})

const isOkBtn = async () => {
  if (Array.isArray(auditInfo)) {
    const results = await Promise.all(auditInfo.map(async (item) => {
      let post = {
        comment: postForm.value.comment,
        procInsId: item.procInsId,
        instanceId: item.procInsId,
        deployId: item.deployId,
        taskId: item.taskId,
        variables: {
          comment: postForm.value.comment,
          remark: postForm.value.variables.remark
        },
        executionId: item.executionId
      }
      return completeFn(post)
    }));
    console.log("🚀 ~ results ~ results:", results)
    const nonZeroCodeResults = results.filter(result => result.code != 0);
    if (nonZeroCodeResults.length) {
      Toast.warning(`有${nonZeroCodeResults.length}个工单审核失败!请注意查看!`)
    } else {
      Toast.success("审核成功!")
    }
  } else {
    postForm.value.procInsId = auditInfo.procInsId
    postForm.value.instanceId = auditInfo.procInsId
    postForm.value.deployId = auditInfo.deployId
    postForm.value.taskId = auditInfo.taskId
    postForm.value.executionId = auditInfo.executionId
    postForm.value.variables.comment = postForm.value.comment
    completeFn(postForm.value)
  }
}

const completeFn = async (value) => {
  const { code, data, msg } = await complete(value)
  if (code != 0) return Toast.error(msg)
  Toast.success(msg)
  setTimeout(() => {
    handlePopupsClose('refresh')
  }, 800)
}

const handlePopupsClose = (val) => {
  emits('CloseClick', val)
};

</script>

<template>
  <uni-popup ref="auditPopup" type="dialog" :is-mask-click="false">
    <view class="popupContent">

      <view class="top_tit">
        <text>审核</text>
        <image class="img_close" @tap="handlePopupsClose" src="http://116.62.107.90:8673/images/logins/close46.png"
          mode="scaleToFill" />
      </view>

      <view class="input_box">
        <view class="input_item radio_item">
          <wd-radio-group v-model="postForm.comment" inline shape="button">
            <wd-radio :value="1">通过</wd-radio>
            <wd-radio :value="0" checked-color="#fa4350">驳回</wd-radio>
          </wd-radio-group>
        </view>

        <view class="input_item">
          <view class="label">理由:</view>
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
.popupContent {
  width: 100%;
  height: 600rpx;
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

    .input_item {
      width: 100%;
      min-height: 120rpx;
      display: flex;
      align-items: center;

      .label {
        min-width: 100rpx;
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

    .radio_item {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 30rpx;
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