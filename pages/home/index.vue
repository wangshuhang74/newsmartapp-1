<script setup>
import myLocation from '@/static/images/homeMap/location.png'
import marker1 from '@/static/images/homeMap/marker1.png'
import marker1_active from '@/static/images/homeMap/marker1_active.png'
import marker2 from '@/static/images/homeMap/marker2.png'
import marker2_active from '@/static/images/homeMap/marker2_active.png'
import { toNavigation, makePhoneCall } from '@/utils'
import { getList } from '@/api'

import { useUserStore, useWorkStore } from '@/store'
const { workDetail } = storeToRefs(useWorkStore())

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
// defineOptions({
//   name: 'Home',
// })

const { safeAreaInsets } = uni.getSystemInfoSync()

const userMap = ref({
  longitude: 116.397428,
  latitude: 39.90923
})

const mapCtx = ref(null)
const markers = ref([])
const mapScale = ref(14)
const cardFlag = ref(false)
const wordcard = ref({})
const newEquip = ref({})
const oldMaintain = ref({})


const wordList = ref([])
const wordListMap = ref(new Map())
const activeMarker = ref(null)

watch(() => {
  return [userMap.value];
}, ([newUserMap], [oldUserMap]) => {
  // console.log('修改前', newUserMap);
  // console.log('修改后', oldUserMap);
  // setMyMarker(userMap.value)
},
  {
    deep: true
  }
)

onShow(() => {
  userStore.isLoginFn()
})
onMounted(() => {
  mapCtx.value = uni.createMapContext('myMap', this)
  // console.log("mapCtx", mapCtx.value);
  getLocation()
})

const getListFn = async () => {
  wordList.value = []
  {
    let getForm = {
      pageNum: 1,
      pageSize: 9999,
      type: 4 // 4新装 3运维
    }
    const { code, data, msg } = await getList(getForm)
    if (code != 0) return Toast.error(msg)
    newEquip.value = data
    addMarkers(data.records)
    // wordList.value = [...wordList.value, ...data.records]
    // data.total
    // data.records
  }
  {
    let getForm = {
      pageNum: 1,
      pageSize: 9999,
      type: 3 // 4新装 3运维
    }
    const { code, data, msg } = await getList(getForm)
    if (code != 0) return Toast.error(msg)
    oldMaintain.value = data
    addMarkers(data.records)
    // wordList.value = [...wordList.value, ...data.records]
    // data.records
  }
}

const addMarkers = (list) => {
  wordList.value = [...wordList.value, ...list, { orderId: new Date().getTime(), lat: 39.90923, lng: 116.397428, orderType: 3, }]
  markers.value = wordList.value.map((item) => {
    // console.log("item.lat", item.lat);
    // console.log("item.lng", item.lng);
    return {
      id: item.orderId,
      latitude: item.lat,
      longitude: item.lng,
      width: 48,
      height: 48,
      iconPath: item.orderType == 3 ? marker1 : marker2, //视图显示图标 
      workItem: item
    }
  })
  // console.log("markers.value2", markers.value);
  setMyMarker(userMap.value)
  markers.value.forEach((item) => {
    wordListMap.value.set(item.id, item)
  });
  // markers.value.push({})
}

const onMarkerTap = (e) => {
  const marker = wordListMap.value.get(e.detail.markerId)
  if (activeMarker?.value && activeMarker?.value?.id == marker?.id) { //点击了相同的marker 
    activeMarkerClickNo()
    activeMarker.value = null
  } else {
    activeMarkerClickNo()
    activeMarkerClickYes(marker)
  }
}

const activeMarkerClickNo = () => {
  if (!activeMarker?.value) return
  cardFlag.value = false
  activeMarker.value.iconPath = activeMarker?.value?.workItem?.orderType == 3 ? marker1 : marker2
  activeMarker.value.width = 48
  activeMarker.value.height = 48
  wordcard.value = activeMarker?.value?.workItem
}

const activeMarkerClickYes = (marker,) => {
  cardFlag.value = true
  wordcard.value = marker.workItem
  marker.iconPath = marker?.workItem?.orderType == 3 ? marker1_active : marker2_active
  marker.width = 66
  marker.height = 66
  activeMarker.value = marker; // 更新当前高亮的标记点
}


const scanBtn = () => {
  uni.scanCode({
    success: (res) => {
      console.log("res", res);
    },
    fail: (err) => {
      console.log("err", err);
    }
  })
}


// 获取当前位置
const getLocation = () => {
  uni.getLocation({
    // type: "wgs84",
    type: "gcj02",
    enableHighAccuracy: true,//高精度
    success: (res) => {
      console.log("res定位", res);
      userMap.value.latitude = res.latitude;
      userMap.value.longitude = res.longitude;
      mapCtx.value.moveToLocation();
      mapScale.value = 16
      cardFlag.value = false
      setMyMarker(userMap.value)
      getListFn()
    },
    fail: (err) => {
      console.log(err);
    },
  });
};

const setMyMarker = (val) => {
  markers.value.splice(markers.value.length - 1, 1, {
    latitude: val.latitude,
    longitude: val.longitude,
    iconPath: myLocation, //视图显示图标 
    width: 48,
    height: 48,
  })
}

const clickItem = (item) => {
  console.log("item", item);
  workDetail.value = item
  uni.navigateTo({
    url: "/pagesFn/work/workDetails",
  })
}

</script>

<template>
  <wd-toast></wd-toast>
  <view class="home_box">
    <view class="top_box" :style="{ paddingTop: safeAreaInsets?.top + 'px', height: safeAreaInsets?.top + 120 + 'px' }">
      <view class="title">首页</view>
      <view class="search_box">
        <view class="search">
          <image class="search_img" src="http://116.62.107.90:8673/images/homeMap/search.png" mode="scaleToFill" />
          <input type="text" placeholder="查线路，地点">
        </view>
        <image class="announcementIcon" src="http://116.62.107.90:8673/images/homeMap/announcement.png"
          mode="scaleToFill" />
      </view>
    </view>
    <view class="map_box">
      <map id="myMap" ref="myMap" show-location :longitude="userMap.longitude" :scale="mapScale"
        :latitude="userMap.latitude" :markers="markers" @markertap="onMarkerTap">
      </map>
      <cover-view class="right_box">
        <cover-image class=right_location src="http://116.62.107.90:8673/images/homeMap/right_location.png"
          @tap="getLocation" />
        <cover-view class="scan_box">
          <!-- fns/qr_img.png -->
          <cover-image class="scan" src="http://116.62.107.90:8673/images/homeMap/scan.png" @tap="scanBtn" />
        </cover-view>
      </cover-view>

      <cover-view class="top_card">
        <cover-view class="card_item">
          <cover-view class="val">{{ newEquip?.total ? newEquip?.total : 0 }}</cover-view>
          <cover-view class="text">待新装</cover-view>
        </cover-view>
        <cover-view class="card_item">
          <cover-view class="val">{{ oldMaintain?.total ? oldMaintain?.total : 0 }}</cover-view>
          <cover-view class="text">待运维</cover-view>
        </cover-view>
      </cover-view>

      <cover-view class="info_card" v-if="cardFlag">
        <cover-view class="top_tit">
          <cover-view class="tit">工单信息</cover-view>
          <cover-view class="navigation">
            <cover-view class="text" @tap="toNavigation(wordcard)">导航</cover-view>
          </cover-view>
          <cover-view class="clickItem">
            <cover-view class="text" @tap="clickItem(wordcard)">查看详情</cover-view>
          </cover-view>
        </cover-view>
        <cover-view class="body_info">
          <cover-view class="item">
            <cover-view class="label">工程师：</cover-view>
            <cover-view class="val">{{ wordcard?.contactName ? wordcard?.contactName : '-' }}</cover-view>
          </cover-view>

          <cover-view class="item">
            <cover-view class="label">联系电话：</cover-view>
            <cover-view class="val">{{ wordcard?.contactPhone ? wordcard?.contactPhone : '-' }}</cover-view>
            <cover-image class="image" src="http://116.62.107.90:8673/images/homeMap/phone.png"
              @tap="makePhoneCall(wordcard?.contactPhone)" />
          </cover-view>

          <cover-view class="item">
            <cover-view class="label">{{ wordcard.orderType == 3 ? '新装设备：' : '运维内容：' }} </cover-view>
            <cover-view class="val" v-if="wordcard.orderType == 3">{{ wordcard?.equipmentName ? wordcard?.equipmentName
              : '-' }}</cover-view>
            <cover-view class="val" v-else>{{ wordcard?.equipmentName ? wordcard?.equipmentName : '-' }}</cover-view>
          </cover-view>

          <cover-view class="item">
            <cover-view class="label">地址：</cover-view>
            <cover-view class="val">{{ wordcard?.address ? wordcard?.address : '-' }}</cover-view>
            <cover-image class="image" src="http://116.62.107.90:8673/images/homeMap/address.png"
              @tap="toNavigation(wordcard)" />
          </cover-view>

          <cover-view class="item">
            <cover-view class="label">{{ wordcard.orderType == 3 ? '设备型号：' : '故障概述：' }}</cover-view>
            <cover-view class="val">{{ wordcard?.contactName ? wordcard?.contactName : '-' }}</cover-view>
          </cover-view>


          <cover-view class="item">
            <cover-view class="label">设备序列号：</cover-view>
            <cover-view class="val">{{ wordcard?.terminalSerial ? wordcard?.terminalSerial : '-' }}</cover-view>
          </cover-view>

        </cover-view>
      </cover-view>
    </view>
  </view>
</template>



<style lang="scss" scoped>
.home_box {
  width: 100%;
  height: 100vh;
  overflow: hidden;

  .top_box {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    padding-bottom: 20rpx;
    background: linear-gradient(90deg, #4557D1 0%, #75DBED 100%);
    box-shadow: 0rpx 5rpx 11rpx 2rpx rgba(0, 0, 0, 0.09);

    .search_box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: calc(100% - 60rpx);
      // height: 100%;
      margin-top: 10rpx;

      .announcementIcon {
        width: 54rpx;
        height: 50rpx;
        margin-left: 20rpx;
      }

      .search {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 611rpx;
        height: 66rpx;
        background: #FBFBFB;
        border: 2rpx solid #F4F4F5;
        border-radius: 30rpx 30rpx 30rpx 30rpx;


        .search_img {
          width: 30rpx;
          height: 30rpx;
          margin: 0 10rpx 0 30rpx;
        }

        input {
          flex: 1;
          height: 100%;
          padding-left: 10rpx;
          font-size: 24rpx;
          color: #333333;
        }
      }

    }

    .title {
      width: 100%;
      height: 60rpx;
      font-size: 33rpx;
      line-height: 60rpx;
      color: #FFFFFF;
      text-align: center;
    }
  }

  .map_box {
    position: relative;
    width: 100%;
    height: calc(100vh - 280rpx);
    overflow: hidden;

    #myMap {
      position: absolute;
      width: 750rpx;
      height: 104%;
    }

    .right_box {
      position: absolute;
      top: 46%;
      right: 10rpx;
      z-index: 99;
      display: flex;
      flex-direction: column;

      .right_location {
        width: 100rpx;
        height: 100rpx;
      }

      .scan_box {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 72rpx;
        height: 72rpx;
        margin-top: 10rpx;
        margin-left: 16rpx;
        background-color: #fff;
        border-radius: 36%;
      }

      .scan {
        width: 40rpx;
        height: 40rpx;
      }
    }

    .top_card {
      position: absolute;
      top: 30rpx;
      left: 0%;
      z-index: 99;
      display: flex;
      flex-wrap: nowrap;
      max-width: 98vw;
      height: 118rpx;

      .card_item {
        display: flex;
        flex-direction: column;
        align-content: center;
        justify-content: center;
        width: 118rpx;
        height: 118rpx;
        margin-left: 30rpx;
        background: #FFFFFF;
        border-radius: 11rpx 11rpx 11rpx 11rpx;
        box-shadow: 0rpx 5rpx 11rpx 2rpx rgba(0, 0, 0, 0.16);

        .val {
          margin-bottom: 6rpx;
          font-size: 40rpx;
          font-weight: bolder;
          color: #F0702D;
          text-align: center;

        }

        .text {
          font-size: 26rpx;
          color: #252525;
          text-align: center;
        }
      }
    }

    // @keyframes axisX {
    //   from {
    //     transform: translateY(150%);
    //   }

    //   to {
    //     transform: translateY(0px);
    //   }
    // }

    // .slide-fade-enter-active {
    //   animation: axisX .6s;
    // }

    // .slide-fade-leave-active {
    //   animation: axisX .8s reverse;
    // }

    .info_card {
      position: absolute;
      bottom: 6%;
      left: 30rpx;
      z-index: 99;
      width: calc(100vw - 60rpx);
      height: 295rpx;
      overflow: hidden;
      background: #FFFFFF;
      border-radius: 10rpx 10rpx 10rpx 10rpx;
      box-shadow: 0rpx 5rpx 11rpx 2rpx rgba(0, 0, 0, 0.16);


      .top_tit {
        display: flex;
        align-content: center;
        width: 100%;
        height: 69rpx;
        background: #1685FF;
        border-radius: 10rpx 10rpx 0rpx 0rpx;

        .tit {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 18rpx;
          font-size: 30rpx;
          font-weight: 500;
          color: #FFFFFF;
        }

        .navigation {
          width: 100rpx;
          height: 47rpx;
          margin-top: 10rpx;
          font-size: 25rpx;
          line-height: 47rpx;
          color: #1685FF;
          text-align: center;
          background: #FFFFFF;
          border-radius: 7rpx 7rpx 7rpx 7rpx;

          .text {
            margin-top: 10rpx;
          }
        }

        .clickItem {
          height: 47rpx;
          width: 130rpx;
          margin-top: 10rpx;
          margin-left: 20rpx;
          font-size: 25rpx;
          line-height: 47rpx;
          color: #1685FF;
          text-align: center;
          background: #FFFFFF;
          border-radius: 7rpx 7rpx 7rpx 7rpx;

          .text {
            margin-top: 10rpx;
          }
        }

      }

      .body_info {
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        height: 226rpx;
        padding: 20rpx 5rpx 30rpx 20rpx;
        background: #fff;

        .item {
          display: flex;
          width: 48%;
          margin: 12rpx 0;

          .label {
            font-size: 26rpx;
            color: #AAAAAA;
          }

          .val {
            flex: 1;
            align-content: center;
            overflow: hidden;
            font-size: 26rpx;
            color: #000000;
          }

          .image {
            width: 30rpx;
            height: 30rpx;
            margin-left: 4rpx;
          }

        }


      }
    }

  }

}

:deep(.amap-logo) {
  display: none !important;
  opacity: 0 !important;
}

:deep(.amap-copyright) {
  display: none !important;
  opacity: 0 !important;
}
</style>
