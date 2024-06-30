<script setup>
import navbar from '@/pages/components/navbar.vue'
import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库
import { useUserStore } from '@/store'
import QreviewImage from '../../pages/components/q-previewImage.vue'
import { getUserArchive,removeUserTag } from '@/api'
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const Toast = useToast()
const message = useMessage(); // 消息弹框

const userInfoApi = ref({})
const previewImage = ref(null);

onMounted(() => {
  getUserArchiveFn()
})

const getUserArchiveFn = async () => {
  const {code,data,msg} = await getUserArchive()
  if(code != 0) return 
  console.log('data',data)
  userInfoApi.value = data
  userInfoApi.value.areaList = data.area //负责区域
  userInfoApi.value.engieeTypeList = data.engieeType //工程类型
}


const cancelTag = (item) => {
  message.confirm({
    title: "取消",
    msg: "您确定要取消吗?",
    confirmButtonText: "确认取消",
    cancelButtonText: "暂不取消",
  })
    .then(async () => {
      const { code, data, msg } = await removeUserTag(item.tagId)
      if (code != 0) return Toast.error(msg)
      Toast.success(msg)
      getUserArchiveFn()

    })
    .catch(() => { });
}

const imgs =ref([]) //设置图片数组

const lookover = (urls) => {
  if(!urls) return Toast.warning('暂未上传附件!')
  imgs.value = urls.split(',')
  setTimeout(() => {
    previewImage.value.open(imgs.value[0]); // 传入当前选中的图片地址(小程序必须添加$nextTick，解决组件首次加载无图)
  }, 100)
}
const onLongpress = e => {
  console.log('当前长按的图片是' + e);
  uni.showActionSheet({
    itemList: ['操作1', '操作2', '保存到手机'],
    success: function (res) {
      console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
    },
    fail: function (res) {
      console.log(res.errMsg);
    }
  });
}

/* open和close方法一般用不到，但是在一些特殊场景会用到，
* 比如预览图片时你需要覆盖 NavigationBar和 TabBar，
* 或者在app中需要预览图片时覆盖住原生组件，比如video或者map等，
* 你可以根据open和close去做一些操作，例如隐藏导航栏或者隐藏一些原生组件等
*/
const open = () => { //监听组件显示 （隐藏TabBar和NavigationBar，隐藏video原生组件） //打开时触发
  
  // uni.hideTabBar()
  // uni.setNavigationBarColor({
  //  frontColor: '#000000', // 设置前景色为黑色
  //  backgroundColor: '#000000', // 设置背景色为黑色
  // })
  // data.videoShow = false 
  console.log("🚀 ~ open ~ open:", )
}

const close = () => { //监听组件隐藏 （显示TabBar和NavigationBar，显示video原生组件）// 关闭时触发
  // uni.showTabBar()
  // uni.setNavigationBarColor({
  //  frontColor: '#ffffff', // 设置前景色为白色
  //  backgroundColor: '#000000', // 设置背景色为黑色
  // })
  // data.videoShow = true
}

</script>

<template>
  <wd-toast></wd-toast>
  <wd-message-box />
  <view class="info_box">
    <navbar :title="'个人档案'" />
    <view class="info_flow">

      <view class="title_box">
        <view class="icon_box"></view>
        <view class="title_text">基本信息</view>
      </view>

      <view class="item_box">
        <text class="label">所属企业</text>
        <view class="right_text">
          <text class="text">{{userInfoApi?.orgName ? userInfoApi?.orgName : ''}}</text>
        </view>
      </view>

      <view class="item_box">
        <text class="label">姓名</text>
        <view class="right_text">
          <text class="text">{{userInfoApi?.userName ? userInfoApi?.userName : ''}}</text>
        </view>
      </view>


      <view class="item_box">
        <text class="label">性别</text>
        <view class="right_text">
          <text class="text">{{userInfoApi?.gender ? userInfoApi?.gender : ''}}</text>
        </view>
      </view>


      <view class="item_box">
        <text class="label">联系电话</text>
        <view class="right_text">
          <text class="text">{{userInfoApi?.phone ? userInfoApi?.phone : ''}}</text>
        </view>
      </view>

      <view class="item_box">
        <text class="label">身份证号</text>
        <view class="right_text">
          <text class="text">{{userInfoApi?.idCard ? userInfoApi?.idCard : ''}}</text>
        </view>
      </view>

      <view class="item_box">
        <text class="label">负责区域</text>
        <view class="right_text">
          <view class="border_box" v-for="(item, idx) in userInfoApi?.areaList" :key="idx">
            <text class="border_text">{{ item.tagName }}</text>
            <image class="cancel" @tap="cancelTag(item)" src="../../static/images/my/cancel.png"
              mode="scaleToFill" />
          </view>
          <view v-if="userInfoApi?.areaList && userInfoApi?.areaList.length == 0" class="no_data">暂无负责区域</view>
        </view>
      </view>

      <view class="item_box">
        <text class="label">工程类型</text>
        <view class="right_text">
          <view class="border_box" v-for="(item, idx) in userInfoApi?.engieeTypeList" :key="idx">
            <text class="border_text">{{ item.tagName }}</text>
            <image class="cancel" @tap="cancelTag(item)" src="../../static/images/my/cancel.png" mode="scaleToFill" />
          </view>
          <view v-if="userInfoApi?.engieeTypeList && userInfoApi?.engieeTypeList.length == 0" class="no_data">暂无工程类型</view>
        </view>
      </view>

      <view class="title_box">
        <view class="icon_box"></view>
        <view class="title_text">从业信息</view>
      </view>

      <view class="item_box">
        <text class="label">资格证发证日期</text>
        <view class="right_text">
          <text class="text">{{userInfoApi?.licenseDate ? userInfoApi?.licenseDate : ''}}</text>
        </view>
      </view>


      <view class="item_box">
        <text class="label">证书编号</text>
        <view class="right_text">
          <text class="text">{{userInfoApi?.licenseId ? userInfoApi?.licenseId : ''}}</text>
        </view>
      </view>


      <view class="item_box">
        <text class="label">技能等级</text>
        <view class="right_text">
          <text class="text">{{userInfoApi?.skillLevel ? userInfoApi?.skillLevel : ''}}</text>
        </view>
      </view>

      <view class="item_box">
        <text class="label">工种名称</text>
        <view class="right_text">
          <text class="text">{{userInfoApi?.workType ? userInfoApi?.workType : ''}}</text>
        </view>
      </view>

      <view class="item_box">
        <text class="label">资格证附件</text>
        <view class="right_text">
          <text class="lookover" @tap="lookover(userInfoApi.qaLicenseFile)">查看</text>
        </view>
      </view>

      <view class="item_box">
        <text class="label">高压电工证附件</text>
        <view class="right_text">
          <text class="lookover" @tap="lookover(userInfoApi.hvLicenseFile)">查看</text>
        </view>
      </view>

      <view class="item_box">
        <text class="label">低压电工证附件</text>
        <view class="right_text">
          <text class="lookover" @tap="lookover(userInfoApi.lvLicenseFile)">查看</text>
        </view>
      </view>

      <view class="item_box">
        <text class="label">高处作业证附件</text>
        <view class="right_text">
          <text class="lookover" @tap="lookover(userInfoApi.wahLicenseFile)">查看</text>
        </view>
      </view>

    </view>
    <QreviewImage ref="previewImage" :urls="imgs" @onLongpress="onLongpress" @open="open" @close="close"></QreviewImage>
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
    width: 100;
    padding-bottom: 100rpx;
    overflow-y: scroll;
    padding: 0 30rpx;
    box-sizing: border-box;

    .item_box {
      width: 92%;
      height: 80rpx;
      display: flex;
      align-items: center;
      margin: 0 auto;
      border-bottom: 1rpx solid #B7BEC8;

      .label {
        font-weight: 400;
        font-size: 28rpx;
        color: #484848;
      }

      .right_text {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .text {
          font-size: 28rpx;
          color: #000000;
        }

        .no_data {
          font-size: 28rpx;
          color: #B7BEC8;
        }

        .border_box {
          width: 80rpx;
          height: 42rpx;
          border-radius: 7rpx;
          border: 2rpx solid #1082FF;
          font-size: 26rpx;
          color: #1082FF;
          line-height: 42rpx;
          margin-left: 12rpx;
          text-align: center;
          position: relative;

          .cancel {
            width: 24rpx;
            height: 24rpx;
            position: absolute;
            top: -12rpx;
            right: -12rpx;
          }
        }

        .lookover {
          font-size: 28rpx;
          color: #1082FF;
          line-height: 16rpx;
          text-decoration: underline;
        }

      }
    }

    .title_box {
      width: 100%;
      height: 60rpx;
      display: flex;
      align-items: center;
      margin-top: 40rpx;

      .icon_box {
        display: inline-block;
        width: 11rpx;
        height: 27rpx;
        background-color: #8EAFFF;
        margin-right: 20rpx;
      }

      .title_text {
        font-weight: bold;
        font-size: 28rpx;
        color: #000000;
      }
    }
  }
}
</style>