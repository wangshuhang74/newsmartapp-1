<script setup>
import navbar from '@/pages/components/navbar.vue'
import QreviewImage from '../../pages/components/q-previewImage.vue'
import Signature from "../../pages/components/sin-signature.vue";
// import Signature from '../../pages/components/xz-signature/xz-signature.vue'

import { baseURL } from '@/utils/http'
import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库
import { useWorkStore, useUserStore } from '@/store'
import { appDisposeOrder } from '@/api'
import { pathToBase64, base64ToPath } from "@/utils/tools.js"; // 图片转base64
import dayjs from "dayjs";

const { workHandle } = storeToRefs(useWorkStore()) // 传递过来的工单信息
const workInfo = ref({}) // 工单信息
const Toast = useToast() // 提示框
const segmented = ref(0) // tab切换
const userStore = useUserStore() // 用户信息
const { userInfo, userMap } = storeToRefs(userStore) // 用户信息

const watermarkUrl = ref("https://report.gb19056.com/watermark/") // 水印相机地址
const openWebview = ref(false)  // 是否打开水印相机
const previewImage = ref(null); // 图片预览dom
const sheetShow = ref(false) // 选择上传方式弹框
let upType = ref('storePic') // 上传类型

const variableXZ = { //新装
  deviceType: null, // 设备类型 ,
  carPlate: null, // 车牌号码 
  carType: null, // 车辆类型
  beforeApplyPic: null, // 维护前照片 ,
  deviceBrand: null,//设备品牌 ,
  deviceSerial: null,//设备序列号 ,
  deviceModel: null, // 设备型号
  simNum: null,//sim卡号
  channelType: null,//通道类型 ,
  xzContent: null,// 新装内容
  afterApplyPic: null,//施工后照片 ,
  remark: null, //备注
}
const variableWH = {//维护
  carPlate: null,  // 车牌号码 
  carType: null, // 车辆类型
  beforeApplyPic: null, // 维护前照片 ,
  faultType: null, // 故障分类
  faultReason: null, // 故障原因 ,
  whType: null, // 维护方式
  whContent: null, //维护内容 ,
  ext1: 1, //主机 
  ext2: 2,//硬盘
  ext3: 3,//U盘 
  ext4: 4,//摄像头
  ext5: 5,// GPS天线 ,
  ext6: 6,//4G天线 
  ext7: 7,//电源线
  ext8: 8,//视频线
  ext9: 9,//显示屏
  ext10: 10,//转接线
  ext11: 11,//机芯 
  ext12: 12,//灯板
  ext13: 13,//防爆管
  ext14: 14,//保险
  ext15: 15,//辅材
  afterApplyPic: null,//施工后照片 ,
  remark: null, //备注
}
const variableXC = { // 新车记录仪新装
  deviceType: null,// 设备类型 ,
  carPlate: null, // 车牌号码 
  carType: null, // 车辆类型
  beforeApplyPic: null, // 维护前照片 ,
  deviceBrand: null,//设备品牌 ,
  deviceSerial: null,//设备序列号 ,
  deviceModel: null, // 设备型号
  simNum: null,//sim卡号
  channelType: null,//通道类型 ,
  afterApplyPic: null,//施工后照片 ,
  drivingLicense: null,//行驶证 ,
  driverLicense: null, // 驾驶证 ,
  managerFile: null, // 管理员信息附件 ,
  electricalFile: null,// 电气附件 ,
  busFile: null,//总线附件
  hostPic: null,//主机照片 ,
  attachment: null, //附件检查 ,
  remark: null, //备注
}

const postForm = ref({
  orderId: null, // 工单id
  flowInfo: { // 流程信息
    taskId: null, // 任务id
    instanceId: null // 实例id
  },
  addressInfo: { // 地址核查
    isLocation: 0, // 是否到达现场 0否 1是
    address: null, // 地址
    storePic: null,// 门店图片
    storePics: [] // 门店图片
  },
  applyInfo: [], // 施工信息
  signInfo: { // 签字确认
    engieeSign: null, // 工程师签字
    userSign: null, // 用户签字
  }
})


onMounted(() => {
  getLocation()
  if (workHandle.value) {
    workInfo.value = workHandle.value
    postForm.value.orderId = workHandle.value.orderId
    postForm.value.signInfo.orderId = workHandle.value.orderId
    postForm.value.flowInfo.taskId = workHandle.value.taskId
    postForm.value.flowInfo.instanceId = workHandle.value.instanceId

    if (workHandle.value.workType == 2) { // 维护
      postForm.value.applyInfo.push(variableWH)
    } else if (workHandle.value.workType == 3) { // 新装
      postForm.value.applyInfo.push(variableXZ)
    } else if (workHandle.value.workType == 4) { // 新车记录仪新装
      postForm.value.applyInfo.push(variableXC)
    }




  } else {
    Toast.warning("没有找到该工单信息")
    setTimeout(() => {
      uni.navigateBack({
        delta: 1
      })
    }, 1000)
  }
})


const submitBtn = async () => {
  console.log("🚀 ~ submitBtn ~ postForm.value:", postForm.value)
  const { code, data, msg } = await appDisposeOrder(postForm.value)
  if (code != 0) return Toast.error(msg)
  Toast.success("提交成功")
  //关闭当前页面 跳转上一个页面
  setTimeout(() => {
    uni.navigateBack({
      delta: 1
    })
  }, 1000)
}



// 获取当前位置
const getLocation = (type) => {
  Toast.loading("定位中...");
  uni.getLocation({
    // type: "wgs84",
    type: "gcj02",
    enableHighAccuracy: true,//高精度
    success: (res) => {
      Toast.close();
      console.log("res定位", res);
      userMap.value.latitude = res.latitude;
      userMap.value.longitude = res.longitude;
      let isLocation = getDistanceFromLatLonInM(
        res.latitude,
        res.longitude,
        Number(workInfo.value.lat),
        Number(workInfo.value.lng)
      )
      isLocation = isLocation.toFixed(2);
      console.log("isLocation", isLocation);
      if (isLocation < 300) {
        postForm.value.addressInfo.isLocation = 0
        if (type) Toast.success("校验成功");
      } else {
        postForm.value.addressInfo.isLocation = 1
        if (type) Toast.error({
          msg: `校验到您可能未到达现场,距离工单处理现场仍有${isLocation}米!`,
          duration: 3000
        });
      }
      getAddress(res.latitude, res.longitude).then((res) => {
        postForm.value.addressInfo.address = res.data.regeocode.formatted_address
      })
    },
    fail: (err) => {
      postForm.value.addressInfo.isLocation = 1
      Toast.close();
      Toast.error("定位失败");
      console.log(err);
    },
  });
};

const getDistanceFromLatLonInM = (lat1, lon1, lat2, lon2) => {
  console.log(lat1, lon1, lat2, lon2);
  if (!lat2 || !lat2) return Toast.error("未获取到工单位置信息!")
  Number.prototype.deg2rad = function (deg) {
    return deg * (Math.PI / 180);
  };
  var R = 6371; // // 是地球半径，单位是千米，这里的6371是千米
  var dLat = (0).deg2rad(lat2 - lat1); // deg2rad below
  var dLon = (0).deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((0).deg2rad(lat1)) *
    Math.cos((0).deg2rad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c * 1000; // Distance in meters
  return d;
};

const tabChange = (index) => { }

const nextStep = (index) => {
  segmented.value = index
}

const checkStep = () => {
  if (segmented.value == 1) {
    if (postForm.value.addressInfo.isLocation == 1 && !postForm.value.addressInfo.address) {
      Toast.error("请填写正确地址")
      // segmented.value == 0
    }

  } else if (segmented.value == 2) {

  }
}

//通过经纬度获取高德地图详细地址
const getAddress = (lat, lng) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `https://restapi.amap.com/v3/geocode/regeo?location=${lng},${lat}&key=5b53822df7d7324e6306268237692ba6&extensions=base`,
      success: (result) => {
        console.log("🚀 ~ returnnewPromise ~ result:", result)
        resolve(result)
      },
      fail: (error) => {
        reject(error)
      }
    });
  })
}


const upBtn = (type) => {
  upType.value = type // 当前上传类型
  if (userInfo.value.userType == 2) { // 如果是主管 可以选择性上传
    sheetShow.value = true
  } else { // 如果是工程师 只能现场拍照
    upImgFn()
  }
}

const sheetSelect = ({ index }) => { // 选择上传方式
  sheetShow.value = false
  if (index == 0) { //现场拍照
    upImgFn()
  } else { // 上传相册的图片
    uni.chooseImage({
      count: 9,
      sizeType: ["original", "compressed"],
      sourceType: ["album"],
      success: (res) => {
        let tempFilePaths = res.tempFilePaths;
        tempFilePaths.forEach((item) => {
          uploadFileApi(item)
        });
      },
    });
  }
}


const upImgFn = () => { // 上传图片水印
  let platform = uni.getSystemInfoSync().platform;
  if (platform === "ios") {
    // 苹果
    console.log("苹果可以使用相机相册");
    watermarkOk();
  } else if (platform === "android") {
    console.log("安卓");
    // 安卓
    //软件获取相机权限
    plus.android.requestPermissions(["android.permission.CAMERA"], (e) => {
      console.log("相机权限");
      if (e.deniedAlways.length > 0) {
        // 弹出提示框解释为何需要权限，引导用户打开设置页面开启
        uni.showModal({
          title: "提示",
          content:
            "请打开手机相机相册功能（点击确定后在权限中授权相机相册功能）",
          // showCancel: false, // 不显示取消按钮
          success(res) {
            if (res.confirm) {
              var Intent = plus.android.importClass(
                "android.content.Intent"
              );
              var Settings = plus.android.importClass(
                "android.provider.Settings"
              );
              var Uri = plus.android.importClass("android.net.Uri");
              var mainActivity = plus.android.runtimeMainActivity();
              var intent = new Intent();
              intent.setAction(
                Settings.ACTION_APPLICATION_DETAILS_SETTINGS
              );
              var uri = Uri.fromParts(
                "package",
                mainActivity.getPackageName(),
                null
              );
              intent.setData(uri);
              mainActivity.startActivity(intent);
            }
          },
        });
      } else if (e.deniedPresent.length > 0) {
        //权限被临时拒绝
        // 弹出提示框解释为何需要权限，可再次调用plus.android.requestPermissions申请权限
        uni.showModal({
          title: "提示",
          content: "请打开手机相机功能（点击确定后在权限中授权相机功能）",
          // showCancel: false, // 不显示取消按钮
          success(res) {
            if (res.confirm) {
              var Intent = plus.android.importClass(
                "android.content.Intent"
              );
              var Settings = plus.android.importClass(
                "android.provider.Settings"
              );
              var Uri = plus.android.importClass("android.net.Uri");
              var mainActivity = plus.android.runtimeMainActivity();
              var intent = new Intent();
              intent.setAction(
                Settings.ACTION_APPLICATION_DETAILS_SETTINGS
              );
              var uri = Uri.fromParts(
                "package",
                mainActivity.getPackageName(),
                null
              );
              intent.setData(uri);
              mainActivity.startActivity(intent);
            }
          },
        });
      } else {
        plus.android.requestPermissions(
          ["android.permission.READ_EXTERNAL_STORAGE"],
          (e) => {
            if (e.deniedAlways.length > 0) {
              //权限被永久拒绝
              // 弹出提示框解释为何需要权限，引导用户打开设置页面开启
              uni.showModal({
                title: "提示",
                content:
                  "请打开相册存储功能（点击确定后在权限中授权相册存储功能）",
                // showCancel: false, // 不显示取消按钮
                success(res) {
                  if (res.confirm) {
                    var Intent = plus.android.importClass(
                      "android.content.Intent"
                    );
                    var Settings = plus.android.importClass(
                      "android.provider.Settings"
                    );
                    var Uri = plus.android.importClass("android.net.Uri");
                    var mainActivity = plus.android.runtimeMainActivity();
                    var intent = new Intent();
                    intent.setAction(
                      Settings.ACTION_APPLICATION_DETAILS_SETTINGS
                    );
                    var uri = Uri.fromParts(
                      "package",
                      mainActivity.getPackageName(),
                      null
                    );
                    intent.setData(uri);
                    mainActivity.startActivity(intent);
                  }
                },
              });
            } else if (e.deniedPresent.length > 0) {
              //权限被临时拒绝
              // 弹出提示框解释为何需要权限，可再次调用plus.android.requestPermissions申请权限
              uni.showModal({
                title: "提示",
                content:
                  "请打开相册存储功能（点击确定后在权限中授权相册存储功能）",
                // showCancel: false, // 不显示取消按钮
                success(res) {
                  if (res.confirm) {
                    var Intent = plus.android.importClass(
                      "android.content.Intent"
                    );
                    var Settings = plus.android.importClass(
                      "android.provider.Settings"
                    );
                    var Uri = plus.android.importClass("android.net.Uri");
                    var mainActivity = plus.android.runtimeMainActivity();
                    var intent = new Intent();
                    intent.setAction(
                      Settings.ACTION_APPLICATION_DETAILS_SETTINGS
                    );
                    var uri = Uri.fromParts(
                      "package",
                      mainActivity.getPackageName(),
                      null
                    );
                    intent.setData(uri);
                    mainActivity.startActivity(intent);
                  }
                },
              });
            } else {
              // console.log("安卓可以使用相机相册");
              watermarkOk();
            }
          }
        );
      }
    });
  }
}

const watermarkOk = () => { //调用水印相机
  console.log("安卓可以使用相机相册");
  let watermarkInfo = JSON.stringify({
    location: "经纬度: " + userMap.value.longitude + "N, " + userMap.value.latitude + "E",
    name: "施工人员: " + userInfo.value.userName,
    time: "时间: " + dayjs().format("YYYY-MM-DD HH:mm:ss"),
    address: "地址: " + postForm.value.addressInfo.address ? postForm.value.addressInfo.address : workInfo.value.address,
    titleStr: upObj[upType.value],
  });
  watermarkUrl.value = `https://report.gb19056.com/watermark/?watermarkInfo=${watermarkInfo}&`;
  openWebview.value = true;
}

const handleMessage = (event) => { // 水印相机返回的数据
  openWebview.value = false;
  // let watermarkInfo = JSON.parse(event.detail.data[0].query.watermarkInfo);
  let watermarkImgs = event.detail.data[0].imgs;
  if (watermarkImgs && watermarkImgs.length > 0) {
    watermarkImgs.forEach((item) => {
      base64ToPath(item)
        .then((path) => {
          uploadFileApi(path)
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }
}

const upUrl = baseURL + "sysFile/uploadFile"
const uploadFileApi = async (path) => { //上传图片接口
  uni.uploadFile({
    url: upUrl,
    filePath: path,
    name: "file",
    formData: {
      type: "",
      fileName: "工单图片",
      linkedId: "",
    },
    success: (uploadFileRes) => {
      const { data } = JSON.parse(uploadFileRes.data);
      if (upType.value == "storePic") { //  门店图片
        postForm.value.addressInfo.storePics.push(data.url)
      }
    },
  });
}
const upObj = { // 上传图片类型映射表
  "storePic": "门店图片",
  "workPic": "施工图片"
}

const sheetActions = [ // 选择上传方式
  {
    name: '现场拍照',
    subname: '水印相机'
  },
  {
    name: '手机相册上传',
  }
]

const variableList = ref([]) // 需要预览的图片列表
const onLongpress = e => { // 图片预览长按事件
  console.log('当前长按的图片是' + e);
  uni.showActionSheet({
    itemList: ['删除', '保存到手机'],
    success: function (res) {
      if (res.tapIndex == 0) {
        variableList.value.forEach((item, idx) => {
          if (item == e) {
            variableList.value.splice(idx, 1);
            postForm.value.addressInfo.storePics.splice(idx, 1);
            previewImage.value.open(variableList.value[0]);
          }
        });
      } else if (res.tapIndex == 1) {
        //保存到手机
        uni.downloadFile({
          url: e, // 这里是你的图片url
          success: (downloadResult) => {
            if (downloadResult.statusCode === 200) {
              uni.saveImageToPhotosAlbum({
                filePath: downloadResult.tempFilePath,
                success: () => {
                  uni.showToast({
                    title: '保存成功!',
                    icon: 'success',
                    duration: 2000
                  });
                },
                fail: (err) => {
                  uni.showToast({
                    title: '保存失败!',
                    icon: 'error',
                    duration: 2000
                  });
                }
              });
            }
          },
          fail: (err) => {
            console.log('下载失败', err);
          }
        });
      }
    },
    fail: function (res) {
      console.log(res.errMsg);
    }
  });
}

const lookover = (urls, urlIdx,) => { // 点击图片预览
  variableList.value = urls.map(item => baseURL + item)
  setTimeout(() => {
    previewImage.value.open(baseURL + urls[urlIdx]); // 传入当前选中的图片地址(小程序必须添加$nextTick，解决组件首次加载无图)
  }, 100)
}

const engieeSignRef = ref(null)
// --------------------------------------------------签名 --------------------------------------
const ClearSign = (e) => {
  postForm.value.signInfo[e] = null;
  if (e == 'engieeSign') {
    engieeSignRef.value.clear() // undo 上一步 clear 清空 

  } else {

  }
}
const SaveSign = (e) => {
  if (e == 'engieeSign') {
    engieeSignRef.value.canvasToTempFilePath({ //save 保存
      success: (res) => {
        // 是否为空画板 无签名
        console.log(res.isEmpty)
        if (res.isEmpty) return Toast.error('请签字')
        // 生成图片的临时路径
        // H5 生成的是base64
        // this.url = res.tempFilePath
        postForm.value.signInfo.engieeSign = res.tempFilePath
        console.log("🚀 ~ ClearSign ~ res.tempFilePath:", res.tempFilePath)
      }
    })

  } else {

  }
}
const getSignUrl = (e) => {
  console.log("🚀 ~ getSignUrl ~ e:", e)
  postForm.value.signInfo[e.field] = e.path;
}

const goSign = (e) => {
  uni.navigateTo({
    url: `/pagesFn/work/signWork?field=${e}`
  })
}


</script>
<template>
  <wd-toast></wd-toast>
  <view class="handleWork">
    <navbar :title="'处理工单'" />
    <view class="details_center">
      <view class="top_segmented">
        <wd-tabs v-model="segmented" @change="tabChange">
          <block>
            <wd-tab title="地址核查">
            </wd-tab>
          </block>
          <block>
            <wd-tab title="施工信息">
            </wd-tab>
          </block>
          <block>
            <wd-tab title="签字确认">
            </wd-tab>
          </block>
        </wd-tabs>
      </view>

      <scroll-view scroll-y :show-scrollbar="false" class="segmented_center ">
        <view class="center center1" v-show="segmented == 0">
          <view class="verifyInfo">
            <view class="label">位置校验：</view>
            <button class="verifyBtn" @tap="getLocation(true)">点击校验</button>
          </view>
          <wd-radio-group v-model="postForm.addressInfo.isLocation" shape="dot" inline @change="getLocation">
            <wd-radio :value="0">真实</wd-radio>
            <wd-radio :value="1" class="isErr">有误</wd-radio>
          </wd-radio-group>

          <view class="correct_address">
            <view class="label">正确地址：</view>
            <view class="textarea_box">
              <image class="address_img" src="http://116.62.107.90:8673/images/icons/address.png" mode="scaleToFill" />
              <textarea v-model="postForm.addressInfo.address" placeholder="请输入正确的地址"></textarea>
            </view>
          </view>

          <view class="upImg_box">
            <view class="label">门店图片:<text class="up_tip">请上传jpg、png格式图片</text></view>
            <view class="img_box">
              <view class="img_item" v-for="(item, idx) in postForm.addressInfo.storePics"
                @tap="lookover(postForm.addressInfo.storePics, idx)">
                <image class="img" :src="baseURL + item" :key="idx" mode="scaleToFill" />
              </view>
              <view class="img_item up_btn" @tap="upBtn('storePic')">
                <image class="up_img" src="http://116.62.107.90:8673/images/fns/up_img.png" mode="scaleToFill" />
              </view>
            </view>
            <view class="up_tip">请打开手机「隐私权限」</view>
          </view>

        </view>

        <view class="center center2" v-show="segmented == 1">
          <view v-for="item in 110">{{ item }}</view>
        </view>

        <view class="center center3" v-show="segmented == 2">
          <view class="list-item">
            <view class="list-item-top">
              <view class="name">
                <view class="tag"></view>
                <text>运维签字</text>
              </view>
              <view class="btns">
                <button class="btn" @tap="ClearSign('engieeSign')">清除</button>
                <button class="btn" @tap="SaveSign('engieeSign')">保存</button>
              </view>
            </view>
            <view class="sign">
              <!-- <Signature type="native" landscape height="100%" bgc="f4f4f4" v-model="postForm.signInfo.engieeSign"
                v-if="!postForm.signInfo.engieeSign" @save="getSignUrl" />
              <image class="sign_img" :src="postForm.signInfo.engieeSign" mode="scaleToFill" /> -->
              <!-- <Signature ref="engieeSign" v-model="postForm.signInfo.engieeSign" @sign="getSignUrl"
                :field="'engieeSign'" /> -->
              <l-signature landscape ref="engieeSignRef"></l-signature>
            </view>
          </view>

          <view class="list-item">
            <view class="list-item-top">
              <view class="name">
                <view class="tag"></view>
                <text>用户签字</text>
              </view>
              <view class="btns" v-if="postForm.signInfo.usersign">
                <button class="btn" @tap="ClearSign('usersign')">清除</button>
                <button class="btn" @tap="SaveSign('usersign')">保存</button>
              </view>
            </view>
            <view class="sign">
              <l-signature landscape></l-signature>
              <!-- <Signature landscape height="100%" bgc="f4f4f4" v-model="postForm.signInfo.usersign" @save="getSignUrl" /> -->
              <!-- <Signature ref="usersign" v-model="postForm.signInfo.usersign" @sign="getSignUrl" :field="'usersign'" /> -->
            </view>
          </view>
        </view>

        <button class="foot_btn" v-if="segmented == 2">提交工单</button>
        <button class="foot_btn" v-else-if="segmented == 0" @tap="nextStep(1)">下一步</button>
        <button class="foot_btn" v-else-if="segmented == 1" @tap="nextStep(2)">下一步</button>
      </scroll-view>
    </view>
    <web-view ref="mywebview" :src="watermarkUrl" @message="handleMessage" @onPostMessage="handleMessage"
      class="webview" :fullscreen="false" v-if="openWebview" />
    <QreviewImage ref="previewImage" :urls="variableList" @onLongpress="onLongpress" />
    <wd-action-sheet v-model="sheetShow" :actions="sheetActions" @select="sheetSelect" />
  </view>
</template>
<style lang="scss" scoped>
.webview {
  width: 100vw;
  height: 100vh;
}

:deep(.signature__operation) {
  margin: 0 !important;
}

:deep(.lime-signature) {
  width: 100% !important;
  height: 100% !important;

  .lime-signature__canvas {
    width: 100% !important;
    height: 100% !important;

    uni-resize-sensor {
      width: 100% !important;
      height: 100% !important;
    }

    * {
      width: 100% !important;
      height: 100% !important;
    }
  }
}

.handleWork {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f7f7fc;

  .details_center {
    flex: 1;
    padding: 30rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 88%;

    .segmented_center {
      width: 100%;
      flex: 1;
    }

    .center {
      background-color: #fff;
      box-shadow: 0rpx 5rpx 11rpx 2rpx rgba(0, 0, 0, 0.09);
      border-radius: 14rpx 14rpx 14rpx 14rpx;
      padding: 30rpx;
      box-sizing: border-box;

      .label {
        font-size: 24rpx;
        color: #AAAAAA;
        margin-right: 10rpx;

      }

      .up_tip {
        font-size: 18rpx;
        color: #AAAAAA;
      }

      .upImg_box {
        width: 100%;
        min-height: 160rpx;
        margin: 30rpx 0;

        .img_box {
          width: 100%;
          min-height: 120rpx;
          padding-top: 10rpx;
          display: flex;
          flex-wrap: wrap;
          box-sizing: border-box;

          .img_item {
            width: 116rpx;
            height: 116rpx;
            margin: 0 10rpx 10rpx 0;

            .img {
              width: 116rpx;
              height: 116rpx;
            }

          }

          .up_btn {
            display: flex;
            justify-content: center;
            align-items: center;
            background: #F4F4F4;
            border-radius: 7rpx 7rpx 7rpx 7rpx;

            .up_img {
              width: 43rpx;
              height: 33rpx;
            }
          }
        }
      }

    }

    .center1 {
      width: 100%;
      min-height: 600rpx;

      :deep(.wd-radio-group) {
        margin-left: 150rpx;
        height: 60rpx;
        line-height: 60rpx;

        .isErr {
          .wd-radio__label {
            color: #FF0000;
          }

          .wd-radio__shape {
            border-color: #FF0000;
            background-color: #FF0000;
          }
        }
      }

      .correct_address {
        width: 100%;
        height: 180rpx;
        display: flex;
        flex-direction: column;
        margin: 30rpx 0;

        .textarea_box {
          width: 100%;
          height: 139rpx;
          background: #F4F4F4;
          margin-top: 10rpx;
          border-radius: 7rpx 7rpx 7rpx 7rpx;
          padding: 10rpx;
          box-sizing: border-box;
          font-size: 24rpx;
          position: relative;
          overflow: hidden;

          .address_img {
            width: 24rpx;
            height: 32rpx;
            position: absolute;
            right: 10rpx;
            bottom: 10rpx;
          }

          textarea {
            font-size: 24rpx;

            &::placeholder {
              font-size: 24rpx;
            }
          }
        }
      }

      .verifyInfo {
        width: 100%;
        height: 40rpx;
        display: flex;
        align-items: center;

        .label {
          line-height: 40rpx;
        }

        .verifyBtn {
          min-width: 120rpx;
          height: 40rpx;
          font-size: 22rpx;
          line-height: 40rpx;
          color: #FFFFFF;
          background: linear-gradient(90deg, #4557D1 0%, #75DBED 100%);
          border-radius: 7rpx 7rpx 7rpx 7rpx;
          margin-left: 40rpx;
        }

      }
    }

    .center2 {}


    .center3 {
      min-height: 800rpx;

      .list-item {
        margin-bottom: 30rpx;

        .list-item-top {
          display: flex;
          height: 80rpx;
          justify-content: space-between;
          align-items: center;

          .name {
            display: flex;
            align-items: center;
          }

          .tag {
            width: 10rpx;
            height: 32rpx;
            background: #1082ff;
            margin-right: 10rpx;
          }

          .btns {
            display: flex;
            align-items: center;
          }

          .btn {
            width: 120rpx;
            height: 48rpx;
            font-size: 24rpx;
            line-height: 48rpx;
            color: #FFFFFF;
            background: linear-gradient(90deg, #4557D1 0%, #75DBED 100%);
            border-radius: 7rpx 7rpx 7rpx 7rpx;
            margin: 0 20rpx 0 0;
          }
        }

        .sign {
          width: 100%;
          height: 240rpx;
          background: #f4f4f4;
          border-radius: 10rpx;
          overflow: hidden;

          .sign_img {
            width: 100%;
            height: 100%;
          }
        }

        .title::before {
          left: -30rpx;
        }
      }
    }

    .foot_btn {
      width: 90%;
      height: 90rpx;
      font-size: 36rpx;
      color: #FFFFFF;
      margin: 100rpx auto 100rpx auto;
      background: linear-gradient(90deg, #1082FF 0%, #5FA9FF 100%);
      border-radius: 14rpx 14rpx 14rpx 14rpx;
    }


    .top_segmented {
      width: 100%;
      height: 90rpx;
      background: #FFFFFF;
      box-shadow: 0rpx 4rpx 7rpx 2rpx rgba(0, 0, 0, 0.16);
      border-radius: 9rpx 9rpx 9rpx 9rpx;
      padding: 0 30rpx;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      margin-bottom: 30rpx;

      :deep(.wd-tabs) {
        .is-active {
          color: #1082FF !important;
        }

        .wd-tabs__nav-item {
          font-size: 28rpx;
          color: #9B9B9B;
        }

        .wd-tabs__line {
          background: #1082FF;
        }
      }

    }


  }

}
</style>
