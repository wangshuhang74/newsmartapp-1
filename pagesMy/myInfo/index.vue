<script setup>
import navbar from '@/pages/components/navbar.vue'
import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库
import { useUserStore } from '@/store'
import QreviewImage from '../../pages/components/q-previewImage.vue'
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
console.log("🚀 ~ userInfo.value:", userInfo.value)

const territoryList = ref([
  {
    name: '湖州',
    id: 1,
  },
  {
    name: '上海',
    id: 2,
  },
  {
    name: '杭州',
    id: 3,
  },
]);

const territoryClick = (idx) => {
  territoryList.value.splice(idx, 1)
}

const projectList = ref([
  {
    name: '定位',
    id: 1,
  },
  {
    name: '测试',
    id: 2,
  },
  {
    name: '视频',
    id: 3,
  },
])

const projectClick = (idx) => {
  projectList.value.splice(idx, 1)
}
const previewImage = ref(null);

const lookover = (idx) => {
  preview('https://web-assets.dcloud.net.cn/unidoc/zh/multiport-20210812.png')
}
const imgs = ['https://web-assets.dcloud.net.cn/unidoc/zh/multiport-20210812.png', 'https://web-assets.dcloud.net.cn/unidoc/zh/uni-function-diagram.png'] //设置图片数组
const preview = (url) => {
  setTimeout(() => {
    previewImage.value.open(url); // 传入当前选中的图片地址(小程序必须添加$nextTick，解决组件首次加载无图)
  }, 100)
};
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
          <text class="text">浙江中导</text>
        </view>
      </view>

      <view class="item_box">
        <text class="label">姓名</text>
        <view class="right_text">
          <text class="text">张三</text>
        </view>
      </view>


      <view class="item_box">
        <text class="label">性别</text>
        <view class="right_text">
          <text class="text">男</text>
        </view>
      </view>


      <view class="item_box">
        <text class="label">联系电话</text>
        <view class="right_text">
          <text class="text">19210964479</text>
        </view>
      </view>

      <view class="item_box">
        <text class="label">身份证号</text>
        <view class="right_text">
          <text class="text">330522155897445</text>
        </view>
      </view>

      <view class="item_box">
        <text class="label">负责区域</text>
        <view class="right_text">
          <view class="border_box" v-for="(item, idx) in territoryList" :key="idx">
            <text class="border_text">{{ item.name }}</text>
            <image class="cancel" @tap="territoryClick(idx)" src="../../static/images/my/cancel.png"
              mode="scaleToFill" />
          </view>
          <view v-if="territoryList && territoryList.length == 0" class="no_data">暂无负责区域</view>
        </view>
      </view>

      <view class="item_box">
        <text class="label">工程类型</text>
        <view class="right_text">
          <view class="border_box" v-for="(item, idx) in projectList" :key="idx">
            <text class="border_text">{{ item.name }}</text>
            <image class="cancel" @tap="projectClick(idx)" src="../../static/images/my/cancel.png" mode="scaleToFill" />
          </view>
          <view v-if="territoryList && projectList.length == 0" class="no_data">暂无工程类型</view>
        </view>
      </view>

      <view class="title_box">
        <view class="icon_box"></view>
        <view class="title_text">从业信息</view>
      </view>

      <view class="item_box">
        <text class="label">资格证发证日期</text>
        <view class="right_text">
          <text class="text">2020-05-15</text>
        </view>
      </view>


      <view class="item_box">
        <text class="label">证书编号</text>
        <view class="right_text">
          <text class="text">330522155897445</text>
        </view>
      </view>


      <view class="item_box">
        <text class="label">技能等级</text>
        <view class="right_text">
          <text class="text">三级/高级技能</text>
        </view>
      </view>

      <view class="item_box">
        <text class="label">工种名称</text>
        <view class="right_text">
          <text class="text">电工</text>
        </view>
      </view>

      <view class="item_box">
        <text class="label">资格证附件</text>
        <view class="right_text">
          <text class="lookover" @tap="lookover(1)">查看</text>
        </view>
      </view>

      <view class="item_box">
        <text class="label">高压电工证附件</text>
        <view class="right_text">
          <text class="lookover" @tap="lookover(2)">查看</text>
        </view>
      </view>

      <view class="item_box">
        <text class="label">低压电工证附件</text>
        <view class="right_text">
          <text class="lookover" @tap="lookover(3)">查看</text>
        </view>
      </view>

      <view class="item_box">
        <text class="label">高处作业证附件</text>
        <view class="right_text">
          <text class="lookover" @tap="lookover(4)">查看</text>
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