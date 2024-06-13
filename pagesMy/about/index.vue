<script  setup>
import navbar from '@/pages/components/navbar.vue'
const Equipment = ref({})

onLoad(() => {
  uni.getSystemInfo({
    success: (res) => {
      console.log('res', res);
      Equipment.value.appName = res.appName;

      // #ifdef APP-PLUS	 
      Equipment.value.versionNum = 'v ' + res.appWgtVersion;
      // #endif

      // #ifdef MP-WEIXIN	 
      Equipment.value.versionNum = 'v ' + res.appVersion;
      // #endif
    }
  })
})

</script>
<template>
  <wd-toast></wd-toast>
  <view class="about_box">
    <navbar :title="'关于我们'" />
    <view class="about_flow">
      <view class="logo_box">
        <image class="logo_img" src="http://116.62.107.90:8673/images/logins/logo.png" mode="scaleToFill" />
      </view>

      <view class="about_name">{{ Equipment?.appName ? Equipment?.appName : '智慧运维' }}</view>
      <view class="about_v">版本：{{ Equipment?.versionNum }}</view>
      <view class="about_text">智慧运维是一款便携于一线运维人员使用的工具软件，提高运维人员工作效率，方便运维联系用户，在线提交工单、审核工单的软件。</view>

    </view>
  </view>
</template>
<style lang="scss" scoped>
.about_box {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f7f7fc;

  .about_flow {
    flex: 1;
    width: 100;
    padding-bottom: 100rpx;
    // overflow-y: scroll;

    .logo_box {
      display: flex;
      justify-content: center;
      width: 100%;
      height: 150rpx;
      margin: 60rpx 0;

      .logo_img {
        width: 150rpx;
        height: 150rpx;
      }
    }

    .about_name {
      width: 100%;
      margin: 30rpx 0;
      font-size: 34rpx;
      font-weight: bold;
      color: #000000;
      text-align: center;
    }

    .about_v {
      width: 100%;
      margin-bottom: 30rpx;
      font-size: 29rpx;
      color: #000000;
      text-align: center;
    }

    .about_text {
      width: 86%;
      margin: 0 auto;
      font-size: 30rpx;
      color: #000000;
    }



  }
}
</style>