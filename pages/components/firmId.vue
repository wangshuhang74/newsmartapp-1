<!-- 首页广告弹框组件 -->
<template>
  <wd-toast></wd-toast>
  <uni-popup ref="popups" type="center" :is-mask-click="false">
    <view class="advertising_box">
      <view class="close_box" @tap="handleClose">
        <uni-icons type="closeempty" size="20" color="#fff"></uni-icons>
      </view>
      <swiper class="swiper" indicator-dots :autoplay="true" dot-color="#fff">
        <swiper-item v-for="(item, index) in swiperList" :key="index">
          <image :src="item" mode="aspectFill"></image>
        </swiper-item>
      </swiper>
    </view>
  </uni-popup>
</template>

<script setup >
import { defineProps } from "vue";
const emits = defineEmits(["tabClick"]);
const { swiperList } = defineProps({
  swiperList: {
    type: Array,
    default: [
      "http://116.62.107.90:8673/home/swiper1.png",
      "http://116.62.107.90:8673/home/swiper2.png",
      "http://116.62.107.90:8673/home/swiper3.png",
    ],
  },
});

const popups = ref(null);
onMounted(() => {
  popups.value.open();
});

const handleClose = () => {
  popups.value.close();
  emits("tabClick", false);
};
</script>

<style lang="scss" scoped>
.uni-popup__wrapper {
  width: 600rpx !important;
  height: 500rpx !important;

}

.advertising_box {
  position: relative;
  width: 600rpx !important;
  height: 500rpx !important;
  overflow: hidden;
  background-color: #f2f2f2;
  border-radius: 20rpx;

  .close_box {
    position: absolute;
    top: 20rpx;
    right: 20rpx;
    z-index: 9;
    color: #fff;
  }

  .swiper {
    width: 600rpx !important;
    height: 500rpx !important;

    image {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
