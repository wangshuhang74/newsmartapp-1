<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<script setup>
import myLocation from '@/static/images/homeMap/location.png'
import marker1 from '@/static/images/homeMap/marker1.png'
import marker1_active from '@/static/images/homeMap/marker1_active.png'
import marker2 from '@/static/images/homeMap/marker2.png'
import marker2_active from '@/static/images/homeMap/marker2_active.png'
import { toNavigation, makePhoneCall } from '@/utils'

import { useUserStore } from '@/store'
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

const wordList = ref([
  {
    id: '1',
    engineerName: '张1',
    engineerPhone: '12345678901',
    equipmentName: '行车记录仪1',
    name: '测试地址',
    address: '北京市东城区东直门',
    equipmentType: 'X001',
    equipmentCode: '23432234',
    longitude: '119.969352',
    latitude: '30.530828',
    workType: 1,
  },
  {
    id: '2',
    engineerName: '李2',
    engineerPhone: '12345678901',
    equipmentName: '行车记录仪2',
    name: '测试地址',
    address: '北京市东城区东直门',
    equipmentType: 'X001',
    equipmentCode: '23432234',
    longitude: '119.974166',
    latitude: '30.532901',
    workType: 2,
  },
  {
    id: '3',
    engineerName: '张三',
    engineerPhone: '12345678901',
    equipmentName: '行车记录仪3',
    name: '测试地址',
    address: '人民医院',
    equipmentType: 'X001',
    equipmentCode: '23432234',
    longitude: '119.962743',
    latitude: '30.536422',
    workType: 1,

  },
  {
    id: '4',
    engineerName: '李四',
    engineerPhone: '12345678901',
    equipmentName: '行车记录仪4',
    name: '测试地址',
    address: '北京市东城区东直门',
    equipmentType: 'X001',
    equipmentCode: '23432234',
    longitude: '119.968168',
    latitude: '30.539877',
    workType: 1,
  },
  {
    id: '5',
    engineerName: '李5',
    engineerPhone: '12345678901',
    equipmentName: '行车记录仪5',
    name: '测试地址',
    address: '中医药',
    equipmentType: 'X001',
    equipmentCode: '23432234',
    longitude: '119.970842',
    latitude: '30.530335',
    workType: 2,
  },
  {
    id: '6',
    engineerName: '李6',
    engineerPhone: '12345678901',
    equipmentName: '行车记录仪6',
    name: '测试地址',
    address: '实验学校',
    equipmentType: 'X001',
    equipmentCode: '23432234',
    longitude: '119.971624',
    latitude: '30.523604',
    workType: 2,
  },
  {
    id: '7',
    engineerName: '张7',
    engineerPhone: '546734576547',
    equipmentName: '行车记录仪7',
    name: '测试地址',
    address: '东城时代',
    equipmentType: 'X001',
    equipmentCode: '23432234',
    longitude: '120.001324',
    latitude: '30.538259',
    workType: 1,
  },
  {
    id: '8',
    engineerName: '张8',
    engineerPhone: '7565745',
    equipmentName: '行车记录仪8',
    name: '测试地址',
    address: '沃尔玛',
    equipmentType: 'X001',
    equipmentCode: '124',
    longitude: '119.968017',
    latitude: '30.535847',
    workType: 1,
  },
])
const wordListMap = ref(new Map())
const activeMarker = ref(null)
onShow(() => {
  userStore.isLoginFn()
  getLocation()
})
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



onMounted(() => {
  mapCtx.value = uni.createMapContext('myMap', this)
  console.log("mapCtx", mapCtx.value);


  addMarkers(wordList.value)
})

const addMarkers = (list) => {
  markers.value = list.map((item) => {
    return {
      id: item.id,
      latitude: item.latitude,
      longitude: item.longitude,
      width: 48,
      height: 48,
      iconPath: item.workType == 1 ? marker1 : marker2, //视图显示图标 
      item
    }
  })
  markers.value.forEach((item) => {
    wordListMap.value.set(item.id, item)
  });
}

const onMarkerTap = (e) => {
  // uni.navigateTo({
  //   url: `/pagesFn/newInstall/index`
  // })
  // uni.switchTab({
  //   url: `/pages/fn/index`
  // })
  const marker = wordListMap.value.get(e.detail.markerId)
  if (activeMarker.value && activeMarker.value.id == marker.id) { //点击了相同的marker 
    activeMarkerClickNo()
    activeMarker.value = null
  } else {
    activeMarkerClickNo()
    activeMarkerClickYes(marker)
  }
}

const activeMarkerClickNo = () => {
  if (!activeMarker.value) return
  cardFlag.value = false
  activeMarker.value.iconPath = activeMarker?.value?.item.workType == 1 ? marker1 : marker2
  activeMarker.value.width = 48
  activeMarker.value.height = 48
  wordcard.value = activeMarker?.value?.item
}

const activeMarkerClickYes = (marker,) => {
  cardFlag.value = true
  wordcard.value = marker.item
  marker.iconPath = marker.item.workType == 1 ? marker1_active : marker2_active
  marker.width = 66
  marker.height = 66
  console.log("wordcard.value", wordcard.value);
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
      setMyMarker(res)
      mapScale.value = 16

    },
    fail: (err) => {
      console.log(err);
    },
  });
};

// 获取屏幕边界到安全区域距离

const setMyMarker = (val) => {
  console.log("markers", val);
  markers.value.splice(markers.value.length - 1, 1, {
    latitude: val.latitude,
    longitude: val.longitude,
    iconPath: myLocation, //视图显示图标 
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
          <cover-image class="scan" src="http://116.62.107.90:8673/images/homeMap/scan.png" @tap="scanBtn" />
        </cover-view>
      </cover-view>

      <cover-view class="top_card">
        <cover-view class="card_item">
          <cover-view class="val">25</cover-view>
          <cover-view class="text">待新装</cover-view>
        </cover-view>
        <cover-view class="card_item">
          <cover-view class="val">25</cover-view>
          <cover-view class="text">待运维</cover-view>
        </cover-view>
      </cover-view>

      <cover-view class="info_card" v-if="cardFlag">
        <cover-view class="top_tit">
          <cover-view class="tit">工单信息</cover-view>
          <cover-view class="navigation">
            <cover-view class="text" @tap="toNavigation(wordcard)">导航</cover-view>
          </cover-view>
        </cover-view>
        <cover-view class="body_info">
          <cover-view class="item">
            <cover-view class="label">工程师：</cover-view>
            <cover-view class="val">{{ wordcard?.engineerName ? wordcard?.engineerName : '-' }}</cover-view>
          </cover-view>

          <cover-view class="item">
            <cover-view class="label">联系电话：</cover-view>
            <cover-view class="val">{{ wordcard?.engineerPhone ? wordcard?.engineerPhone : '-' }}</cover-view>
            <cover-image class="image" src="http://116.62.107.90:8673/images/homeMap/phone.png"
              @tap="makePhoneCall(19815103583)" />
          </cover-view>

          <cover-view class="item">
            <cover-view class="label">新装设备：</cover-view>
            <cover-view class="val">{{ wordcard?.equipmentName ? wordcard?.equipmentName : '-' }}</cover-view>
          </cover-view>

          <cover-view class="item">
            <cover-view class="label">地址：</cover-view>
            <cover-view class="val">{{ wordcard?.address ? wordcard?.address : '-' }}</cover-view>
            <cover-image class="image" src="http://116.62.107.90:8673/images/homeMap/address.png"
              @tap="toNavigation(wordcard)" />
          </cover-view>

          <cover-view class="item">
            <cover-view class="label">设备型号：</cover-view>
            <cover-view class="val">{{ wordcard?.equipmentType ? wordcard?.equipmentType : '-' }}</cover-view>
          </cover-view>


          <cover-view class="item">
            <cover-view class="label">设备序列号：</cover-view>
            <cover-view class="val">{{ wordcard?.equipmentCode ? wordcard?.equipmentCode : '-' }}</cover-view>
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
