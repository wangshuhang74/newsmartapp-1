<script setup>
import seleLIst from "../components/lxx-indexed-list/lxx-indexed-list"
import { dataList } from "../components/lxx-indexed-list"
const assignPopup = ref(null)
const assignData = ref({})
const emits = defineEmits(['CloseClick'])
const { assignShow, assignInfo } = defineProps({
  assignShow: {
    type: Boolean,
    default: false
  },
  assignInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const linkman = ref(false)
onMounted(() => {
  assignPopup.value.open("bottom")
})

const isOkBtn = async () => { }
const handlePopupsClose = () => {
  console.log("🚀 ~ handlePopupsClose ~ CloseClick:",)
  emits('CloseClick', false)
};
const bindClick = ({ item }) => {
  console.log("🚀 ~ bindClick ~ item:", item)
  linkman.value = false;
  assignData.value = item
}

</script>

<template>
  <uni-popup ref="assignPopup" type="dialog" :is-mask-click="false">
    <view class="popupContent">

      <view class="top_tit">
        <text>指派</text>
        <image class="img_close" @tap="handlePopupsClose" src="http://116.62.107.90:8673/images/logins/close46.png"
          mode="scaleToFill" />
      </view>

      <view class="input_box">
        <view class="input_item">
          <view class="label requiredLabel">指派给:</view>
          <view class="inp_value" @tap="linkman = true" style="padding-right: 28rpx;">
            <view class="placehold_value" v-if="assignData?.name?.username">{{ assignData?.name?.username + '-' +
              assignData?.name?.deptName }}</view>
            <view class="placehold" v-else>请选择</view>

            <image class="placehold_img" src="http://116.62.107.90:8673/images/tips/arrow_default.png"
              mode="scaleToFill" />
          </view>
        </view>

        <view class="input_item">
          <view class="label">备注:</view>
          <view class="inp_value remark">
            <textarea class="textarea_inp" autosize maxlength="200" show-confirm-bar placeholder="请输入备注"></textarea>
          </view>
        </view>
      </view>

      <view class="btn_box">
        <button class="isOkBtn" @tap="isOkBtn">确定</button>
      </view>

    </view>
  </uni-popup>

  <u-popup class="my_popup" v-if="linkman" style="z-index: 9999;">
    <view class="index_Box">
      <seleLIst :showSelect="false" :options="dataList" @click="bindClick">
      </seleLIst>
    </view>
  </u-popup>

</template>
<style lang="scss" scoped>
.popupContent {
  width: 100%;
  height: 550rpx;
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
      min-height: 100rpx;
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
<style lang="scss">
.index_Box {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}

.my_popup {
  width: 100vw;
  height: 88vh;
}

.content-block {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  background-color: #fff;

  .title {
    color: #333;
    padding: 20rpx;
    margin-right: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .btn {
    color: #ccc;
    padding: 10rpx;
    border: 1rpx solid #ccc;
    border-radius: 10rpx;
    margin: 20rpx 10rpx;
    font-size: 28rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;

  }
}
</style>