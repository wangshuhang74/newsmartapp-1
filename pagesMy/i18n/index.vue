<script setup>
import navbar from '@/pages/components/navbar.vue'
import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库

import { useUserStore } from '@/store'
import { useI18n } from "vue-i18n"
const { locale, t } = useI18n()
const userStore = useUserStore()
const { lang } = storeToRefs(userStore)
const Toast = useToast()


//切换语言
const switchLang = () => {
  const code = userStore.switchLang(locale)
  console.log("🚀 ~ switchLang ~ code:", code)
  if (code) Toast.success(lang.value == 'zh' ? '切换成功' : 'Switch Success')
}

</script>

<template>
  <wd-toast></wd-toast>
  <view class="info_box">
    <navbar :title="'个人档案'" />
    <view class="info_flow">
      <text>{{ $t('你好') }} {{ $t('世界') }}</text>

      <button class="btn" @tap="switchLang">切换{{ lang == 'zh' ? '英文' : '中文' }}</button>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.info_box {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f7f7fc;


  .info_flow {
    flex: 1;
    width: 100%;
    padding: 20rpx;
    box-sizing: border-box;

    .btn {
      width: 90%;
      height: 90rpx;
      font-size: 36rpx;
      color: #FFFFFF;
      margin: 100rpx auto 100rpx auto;
      background: linear-gradient(90deg, #1082FF 0%, #5FA9FF 100%);
      border-radius: 14rpx 14rpx 14rpx 14rpx;
    }
  }
}
</style>