<script setup>
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
import { useUserStore } from '@/store'

import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库
import icon1 from '@/static/images/icons/grda_icon.png'
import sk_icon from '@/static/images/icons/sk_icon.png'
import qh_icon from '@/static/images/icons/qh_icon.png'
import about_icon from '@/static/images/icons/about_icon.png'
import mm_icon from '@/static/images/icons/mm_icon.png'
import gj_icon from '@/static/images/icons/gj_icon.png'
import item_arrow from '@/static/images/icons/item_arrow.png'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const Message = useMessage()

onShow(() => {
  userStore.isLoginFn()
  console.log("userInfo", userInfo.value);

})

const fnList = [
  {
    id: 1,
    title: '个人档案',
    path: '/pagesMy/myInfo/index',
    icon: icon1,
    type: 'navigateTo'
  },
  {
    id: 2,
    title: '用户收款',
    path: '/pagesMy/receiveUser/index',
    icon: sk_icon,
    type: 'navigateTo'
  },
  {
    id: 3,
    title: '切换账号',
    path: '/pagesMy/switchAccount/index',
    icon: qh_icon,
    type: 'navigateTo'
  },
  {
    id: 4,
    title: '关于我们',
    path: '/pagesMy/about/index',
    icon: about_icon,
    type: 'navigateTo'
  },
  //{
  //  id: 7,
  //  title: '切换语言',
  //  path: '/pagesMy/i18n/index',
  //  icon: qh_icon,
  //  type: 'navigateTo'
  //},
  {
    id: 5,
    title: '修改密码',
    path: '/pagesMy/changePassword/index',
    icon: mm_icon,
    type: 'navigateTo'
  },
  {
    id: 6,
    title: '退出登录',
    path: '/pagesAccount/login/index',
    icon: gj_icon,
    type: ''
  },
]

const itemClick = (item) => {
  if (item.type == 'navigateTo') {
    uni.navigateTo({
      url: item.path
    })
  } else if (item.id == 6) {
    Message.confirm({
      title: "退出登录",
      msg: `确定退出登录吗？`,
      confirmButtonText: "确定退出",
    })
      .then(() => {
        userStore.clearUserInfo()
      })
      .catch(() => { });
  }
}

</script>
<template>
  <wd-toast></wd-toast>
  <wd-message-box />
  <view class="my_box">
    <view class="top_box" :style="{ paddingTop: safeAreaInsets?.top + 'px', height: safeAreaInsets?.top + 250 + 'px' }">
      <view class="active_info">
        <view class="active_info_left">
          <image v-if="userInfo.active" :src="userInfo.active" mode="scaleToFill" />
          <view v-else class="avatar_text">{{
            userInfo.userName ? userInfo.userName.charAt(0).toUpperCase() : userInfo.phone ?
              userInfo.phone.charAt(0).toUpperCase() : ""
          }}</view>
        </view>
        <view class="active_info_right" v-if="userInfo.userName || userInfo.phone">
          <view class="title_box">
            <text class="title">{{ userInfo.userName ? userInfo.userName : userInfo.phone }}</text>
            <view class="type_box" v-if="userInfo.roleName">【{{ userInfo.roleName }}】</view>
            <view class="tag_box" v-if="userInfo.tags && userInfo.tags.length > 0">
              <text class="tag" v-for="(item, idx) in userInfo.tags" :key="idx">{{ item }}</text>
            </view>
          </view>
          <view class="phone_box">{{ userInfo.phone }}</view>
        </view>

        <view class="active_info_right" v-else>
          <view class="title_box">
            <text class="title">未登录</text>
          </view>
          <view class="phone_box">请先登录...</view>
        </view>

      </view>
    </view>
    <view class="my_fn">
      <view class="my_fn_item" v-for="(item, index) in fnList" :key="index" @tap="itemClick(item)">
        <image class="my_fn_icon" :src="item.icon" mode=""></image>
        <view class="item_text">{{ item.title }}</view>
        <image class="item_arrow" :src="item_arrow" mode=""></image>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.my_box {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #F7F7FC;

  .top_box {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 550rpx;
    background: linear-gradient(90deg, #4557D1 0%, #75DBED 100%);
    background: url('http://116.62.107.90:8673/images/logins/login_top.png') no-repeat;
    background-size: 100% 100%;

    .active_info {
      display: flex;
      width: 88%;
      height: 250rpx;
      margin-top: 130rpx;

      .active_info_left {
        width: 160rpx;
        height: 160rpx;
        margin-left: 10rpx;

        image {
          width: 160rpx;
          height: 160rpx;
          overflow: hidden;
          border-radius: 50%;
        }

        .avatar_text {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 160rpx;
          height: 160rpx;
          font-size: 80rpx;
          color: #77bfe8;
          border: 4rpx solid #77bfe8;
          border-radius: 50%;
        }
      }

      .active_info_right {
        display: flex;
        flex-direction: column;
        align-content: center;
        justify-content: center;
        width: calc(100% - 150rpx);
        height: 180rpx;
        margin-left: 20rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        .title_box {
          display: flex;
          flex-wrap: nowrap;
          align-content: center;
          width: 100%;
          height: 60rpx;
          overflow: hidden;
          line-height: 60rpx;


          .title {
            font-size: 42rpx !important;
            color: #FFFFFF;
          }

          .type_box {
            font-size: 20rpx;
            font-weight: 400;
            line-height: 72rpx;
            color: #FFFFFF;
            white-space: nowrap;
          }

          .tag_box {
            display: flex;
            flex: 1;
            align-items: center;
            min-width: 100rpx;
            overflow: hidden;
            overflow-x: scroll;
            text-overflow: ellipsis;
            white-space: nowrap;

            .tag {
              display: flex;
              align-items: center;
              justify-content: center;
              min-width: 80rpx;
              height: 33rpx;
              margin-left: 8rpx;
              font-size: 20rpx;
              font-weight: 400;
              color: #537DD9;
              background: #FFFFFF;
              border-radius: 5rpx 5rpx 5rpx 5rpx;
            }
          }

        }

        .phone_box {
          height: 60rpx;
          font-size: 30rpx;
          line-height: 60rpx;
          color: #FFFFFF;
        }

      }

    }
  }

  .my_fn {
    width: 100%;
    height: calc(100% - 550rpx);

    .my_fn_item {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 92%;
      height: 111rpx;
      padding: 0 20rpx;
      margin: 0 auto;
      margin-bottom: 20rpx;
      background: #FFFFFF;
      border-radius: 9rpx 9rpx 9rpx 9rpx;
      box-shadow: 0rpx 4rpx 7rpx 2rpx rgba(0, 0, 0, 0.16);

      .my_fn_icon {
        width: 42rpx;
        height: 42rpx;
        margin-right: 20rpx;
      }

      .item_text {
        flex: 1;
        font-size: 30rpx;
        color: #000000;
      }

      .item_arrow {
        width: 18rpx;
        height: 32rpx;
      }

    }

  }
}
</style>
