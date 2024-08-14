<script setup>
import navbar from '@/pages/components/navbar.vue'
import QreviewImage from '../../pages/components/q-previewImage.vue'

import { baseURL } from '@/utils/http'
import { useNotify, useToast, useMessage } from 'wot-design-uni' // ui组件库
import { useWorkStore, useUserStore } from '@/store'
import { appSavePreOrder, appDisposeOrder, complete, appDisposeOrderInfo } from '@/api'
import { pathToBase64, base64ToPath } from "@/utils/tools.js"; // 图片转base64
import dayjs from "dayjs";

// import swItem from '../components/swiper/sw-item.vue'
// import swiperItemRu from '../components/swiper/swiper-item-ru.vue'

const { workHandle } = storeToRefs(useWorkStore()) // 传递过来的工单信息
const Toast = useToast() // 提示框
const segmented = ref(0) // tab切换
const userStore = useUserStore() // 用户信息
const { userInfo, userMap } = storeToRefs(userStore) // 用户信息
const isIos = ref(false) // 是否是ios
const watermarkUrl = ref("https://report.gb19056.com/watermark/") // 水印相机地址
const openWebview = ref(false)  // 是否打开水印相机
const variableList = ref([]) // 需要预览的图片列表
const previewImage = ref(null); // 图片预览dom
const sheetShow = ref(false) // 选择上传方式弹框
const upType = ref(null) // 上传类型
const holdType = ref(null) // 预览类型
const holdIdx = ref(null) // 预览类型
const upIdx = ref(null) // 上传下标



const variableXZ = { //新装
  deviceType: null, // 设备类型 ,
  carPlate: null, // 车牌号码 
  carType: null, // 车辆类型
  beforeApplyPic: [], // 维护前照片 ,
  deviceBrand: null,//设备品牌 ,
  deviceSerial: null,//设备序列号 ,
  tpmId: null,//设备安全芯片ID 
  tpmTime: null,//设备安全芯片时间
  verifyCode: null,//设备安全芯片验证码
  deviceModel: null, // 设备型号
  simNum: null,//sim卡号
  channelType: [],//通道类型 , 
  xzContent: null,// 新装内容
  afterApplyPic: [],//施工后照片 ,
  remark: null, //备注
  // ---------------------------- 附件 ----------------------------
  drivingLicense: [],//行驶证 ,
  recPic: [],// 新车记录仪图片
  driverLicense: [], // 驾驶证 ,
  managerFile: [], // 管理员信息附件 ,
  electricalFile: [],// 电气附件 ,
  busFile: [],//总线附件
  hostPic: [],//主机照片 ,
  attachment: [], //附件检查 ,

}
const variableWH = {//维护
  carPlate: null,  // 车牌号码 
  carType: null, // 车辆类型
  beforeApplyPic: [], // 维护前照片 ,
  faultType: null, // 故障分类
  faultReason: null, // 故障原因 ,
  whType: null, // 维护方式
  whContent: null, //维护内容 ,
  ext1: 0, //主机 
  ext2: 0,//硬盘
  ext3: 0,//U盘 
  ext4: 0,//摄像头
  ext5: 0,// GPS天线 ,
  ext6: 0,//4G天线 
  ext7: 0,//电源线
  ext8: 0,//视频线
  ext9: 0,//显示屏
  ext10: 0,//转接线
  ext11: 0,//机芯 
  ext12: 0,//灯板
  ext13: 0,//防爆管
  ext14: 0,//保险
  ext15: 0,//辅材
  afterApplyPic: [],//施工后照片 ,
  remark: null, //备注

  replacePart: null, // 更换的部件
  deviceBrand: null,//设备品牌 ,
  deviceSerial: null,//设备序列号 ,
  deviceModel: null, // 设备型号
  simNum: null,//sim卡号
  channelType: [],//通道类型 ,
}

const postForm = ref({
  orderId: null, // 工单id
  flowInfo: { // 流程信息
    taskId: null, // 任务id
    instanceId: null // 实例id
  },
  addressInfo: { // 地址核查
    isLocation: 1, // 是否到达现场 0 到达 1 未到达
    address: null, // 地址
    area: null, // 行政区域编码
    areaStr: null, // 行政区域名称(浙江省杭州市西湖区)
    storePic: [] // 门店图片
  },
  applyInfo: [], // 施工信息
  signInfo: { // 签字确认
    engieeSign: null, // 工程师签字
    userSign: null, // 用户签字
  }
})

const postLcForm = ref({
  comment: 1,
  procInsId: null,
  instanceId: null,
  deployId: null,
  taskId: null,
  variables: {
    comment: 1,
  },
})

const selectType = ref('radio') // checkbox radio
const selectPicker = ref(null)// 选择器
const selectColumns = ref([])//选择器选项变量
const selectValue = ref(null) // 选择器选中值
const selectIdx = ref(0)//当前选择器的索引
const selectDataType = ref('')//当前选择器的类型
const openSelect = (item, idx, type) => {
  selectIdx.value = idx
  selectDataType.value = type
  // carType vehicleTypeList
  switch (type) {
    case 'carType':
      selectType.value = 'radio'
      selectColumns.value = vehicleTypeList
      selectValue.value = item.carType
      break;
    // faultType breakdownTypeList 
    case 'faultType':
      selectType.value = 'radio'
      selectColumns.value = breakdownTypeList
      selectValue.value = item.faultType
      break;
    // faultReason failureCauseList 
    case 'faultReason':
      selectType.value = 'radio'
      selectColumns.value = failureCauseList
      selectValue.value = item.faultReason
      break;
    // whType maintenanceMode 
    case 'whType':
      selectType.value = 'radio'
      selectColumns.value = maintenanceMode
      selectValue.value = item.whType
      break;
    //replacePart changeList
    case 'replacePart':
      selectType.value = 'radio'
      selectColumns.value = changeList
      selectValue.value = item.replacePart
      break;
    //deviceBrand equipmentList
    case 'deviceBrand':
      selectType.value = 'radio'
      selectColumns.value = equipmentList
      selectValue.value = item.deviceBrand
      break;
    //channelType aisleList
    case 'channelType':
      selectType.value = 'checkbox'
      selectColumns.value = aisleList
      selectValue.value = item.channelType
      break;
    //deviceType carTypeList
    case 'deviceType':
      selectType.value = 'radio'
      selectColumns.value = carTypeList
      selectValue.value = item.deviceType
      break;
    default:
      break;
  }
  setTimeout(() => {
    selectPicker.value.open()
  }, 100,)
}

const selectClose = (val) => {
  console.log("🚀 ~ selectClose ~ val:", val.value)
  let item;
  setTimeout(() => {
    postForm.value.applyInfo[selectIdx.value][selectDataType.value] = selectValue.value
    item = postForm.value.applyInfo[selectIdx.value]
    switch (selectDataType.value) {
      case 'whType':
        if (val.value == '更换部件') {
          item.whContent = ''  //维护内容
          item.ext1 = 0
          item.ext2 = 0
          item.ext3 = 0
          item.ext4 = 0
          item.ext5 = 0
          item.ext6 = 0
          item.ext7 = 0
          item.ext8 = 0
          item.ext9 = 0
          item.ext10 = 0
          item.ext11 = 0
          item.ext12 = 0
          item.ext13 = 0
          item.ext14 = 0
          item.ext15 = 0
        } else {
          item.replacePart = null // 更换的部件
          item.deviceBrand = null // 设备品牌
          item.deviceSerial = null // 设备序列号
          item.deviceModel = null // 设备型号
          item.simNum = null // sim卡号
          item.channelType = [] // 通道类型
        }
        break;
      case 'deviceType': //车辆类型改变
        if (val.value != '汽车行驶记录仪') {
          item.drivingLicense = []
          item.recPic = []
          item.driverLicense = []
          item.managerFile = []
          item.electricalFile = []
          item.busFile = []
          item.hostPic = []
          item.attachment = []
        } else {
          item.xzContent = ''
          item.beforeApplyPic = []
          item.afterApplyPic = []
        }
        break;

    }
    console.log("🚀 ~ openSelect ~ postForm.value:", postForm.value)
  }, 50,)
}


onMounted(() => {
  if (workHandle.value) {
    postForm.value.orderId = workHandle.value.orderId
    postForm.value.signInfo.orderId = workHandle.value.orderId
    postForm.value.flowInfo.taskId = workHandle.value.taskId
    postForm.value.flowInfo.instanceId = workHandle.value.procInsId

    postLcForm.value.procInsId = workHandle.value.procInsId
    postLcForm.value.instanceId = workHandle.value.procInsId
    postLcForm.value.taskId = workHandle.value.taskId
    postLcForm.value.deployId = workHandle.value.deployId
    if ([5,].some(rule => userInfo.value.rules.includes(rule))) {
      postLcForm.value.variables.isManager = 1
    }


    console.log("🚀 ~ onMounted ~ workHandle.value.orderType:", workHandle.value)
    if (workHandle.value.orderType == 2) { // 维护
      postForm.value.applyInfo.push(JSON.parse(JSON.stringify({ ...variableWH })))
    } else if (workHandle.value.orderType == 3) { // 新装
      postForm.value.applyInfo.push(JSON.parse(JSON.stringify({ ...variableXZ })))
    }
  } else {
    Toast.warning("没有找到该工单信息")
    setTimeout(() => {
      uni.navigateBack({
        delta: 1
      })
    }, 1000)
  }
  uni.$on('sign', (data) => { // 签名页面返回
    if (data.upType == 'engieeSign') postForm.value.signInfo.engieeSign = data.url
    if (data.upType == 'userSign') postForm.value.signInfo.userSign = data.url
  });

  uni.getSystemInfoSync().platform == "ios" ? isIos.value = true : isIos.value = false
  appDisposeOrderInfoFn()
})



//页面销毁时
onUnmounted(() => {
  uni.$off('sign')
  if (isSubmitted.value == false) appDisposeOrderFn(postForm.value) // 页面销毁时保存工单
})

const appDisposeOrderInfoFn = async () => {
  uni.showToast({
    title: '加载中...',
    icon: 'loading',
    duration: 2000
  });
  const { code, data, msg } = await appDisposeOrderInfo({
    orderId: workHandle.value.orderId
  })
  if (code != 0) {
    verifyErr(msg)
    uni.hideToast()
  } else {
    uni.hideToast()
    console.log("data", data);
    postForm.value.addressInfo.storePic = data.addressInfo.storePic ? data.addressInfo.storePic : postForm.value.addressInfo.storePic
    postForm.value.applyInfo = data.applyInfo ? data.applyInfo : postForm.value.applyInfo
    postForm.value.signInfo = data.signInfo ? data.signInfo : postForm.value.signInfo
    getLocation()
  }
}

const submitBtn = async () => { // 提交工单
  console.log("🚀 ~ appDisposeOrderInfoFn ~ postForm.value:", postForm.value)
  const verify = verifyForm()
  if (!verify) return
  Toast.loading("提交中...");
  const DisposeFlag = await appDisposeOrderFn()
  console.log("🚀 ~ submitBtn ~ DisposeFlag:", DisposeFlag)
  if (!DisposeFlag) return
  const { code, data, msg } = await appDisposeOrder(postForm.value)
  if (code != 0) {
    verifyErr(msg)
    Toast.close()
  } else {
    const { code, data, msg } = await complete(postLcForm.value)
    if (code != 0) {
      verifyErr(msg)
      Toast.close()
    } else {
      Toast.success("提交成功")
      Toast.close()

      setTimeout(() => {
        console.log("🚀 ~ appDisposeOrderInfoFn ~ data:", data)
        uni.navigateBack({
          delta: 1
        })
      }, 1000)
    }
  }
}
const isSubmitted = ref(false) // 是否是提交过
const appDisposeOrderFn = async (value) => {
  isSubmitted.value = true // 如果为 isSubmitted  true 页面销毁时 不会再调 appDisposeOrderFn 接口
  return new Promise(async (resolve, reject) => {
    const { code, data, msg } = await appSavePreOrder({
      orderId: workHandle.value.orderId,
      applyInfo: JSON.parse(JSON.stringify(postForm.value.applyInfo))
    })
    if (code != 0) {
      verifyErr(msg)
      reject(false);
    } else {
      resolve(true);
    }
  });
}

const addWorkBtn = () => { // 添加施工信息
  if (workHandle.value.orderType == 2) { // 维护
    postForm.value.applyInfo.push(JSON.parse(JSON.stringify({ ...variableWH })))
  } else if (workHandle.value.orderType == 3) { // 新装
    postForm.value.applyInfo.push(JSON.parse(JSON.stringify({ ...variableXZ })))
  }
  workCurrent.value = postForm.value.applyInfo.length - 1
}

const delWorkBtn = (idx) => { // 删除施工信息
  postForm.value.applyInfo.splice(idx, 1)
  if (postForm.value.applyInfo.length > 1) {
    workCurrent.value = postForm.value.applyInfo.length - 1
  } else {
    workCurrent.value = 0
  }
}



// 获取当前位置
const getLocation = (type) => {
  postForm.value.addressInfo.address = null
  postForm.value.addressInfo.areaStr = null
  postForm.value.addressInfo.area = null
  //Toast.loading("定位中...");
  uni.getLocation({
    // type: "wgs84",
    type: "gcj02",
    enableHighAccuracy: true,//高精度
    success: (res) => {
      //Toast.close();
      console.log("res定位", res);
      userMap.value.latitude = res.latitude;
      userMap.value.longitude = res.longitude;
      let isLocation = getDistanceFromLatLonInM(
        res.latitude,
        res.longitude,
        Number(workHandle.value.lat),
        Number(workHandle.value.lng)
      )
      isLocation = isLocation.toFixed(2);
      console.log("isLocation", isLocation);
      if (isLocation < 300) {
        postForm.value.addressInfo.isLocation = 0
        if (type) Toast.success("校验成功");
      } else {
        postForm.value.addressInfo.isLocation = 1
        if (type) verifyErr(`校验到您可能未到达现场,距离工单处理现场仍有${isLocation}米!`);
      }
      getAddress(res.latitude, res.longitude).then((res) => {
        const addressInfo = res.data.regeocode
        postForm.value.addressInfo.address = addressInfo.formatted_address
        postForm.value.addressInfo.area = addressInfo.addressComponent.adcode
        postForm.value.addressInfo.areaStr = addressInfo.addressComponent.province + addressInfo.addressComponent.city + addressInfo.addressComponent.district
      })
    },
    fail: (err) => {
      postForm.value.addressInfo.isLocation = 1
      //Toast.close();
      verifyErr("定位失败");
      console.log(err);
    },
  });
};

const getDistanceFromLatLonInM = (lat1, lng1, lat2, lng2) => { // 计算两点之间的距离
  console.log(lat1, lng1, lat2, lng2);
  if (!lat2 || !lat2) return verifyErr("未获取到工单位置信息!")
  Number.prototype.deg2rad = function (deg) {
    return deg * (Math.PI / 180);
  };
  var R = 6371; // // 是地球半径，单位是千米，这里的6371是千米
  var dLat = (0).deg2rad(lat2 - lat1); // deg2rad below
  var dLon = (0).deg2rad(lng2 - lng1);
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


const upBtn = (type, idx) => {
  upType.value = type // 当前上传类型
  upIdx.value = idx
  const typeList = ['drivingLicense', 'driverLicense', "recPic",
    'managerFile', 'electricalFile', 'busFile', 'hostPic', 'attachment']

  if (typeList.includes(type)) { // 如果是附件上传 可以选择性上传
    sheetShow.value = true
  } else if (workHandle.value.ext1) { // 如果不是附件上传，判断有没有权限上传 
    sheetShow.value = true // 如果是用 可以选择性上传
  } else { // 只能现场拍照
    upImgFn()
    //upAlbum()
  }

}

const sheetSelect = ({ index }) => { // 选择上传方式
  sheetShow.value = false
  if (index == 0) { //现场拍照
    upImgFn()
  } else { // 上传相册的图片
    upAlbum()
  }
}

const upAlbum = () => {
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
    address: "地址: " + postForm.value.addressInfo.address ? postForm.value.addressInfo.address : workHandle.value.address,
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

const uploadFileApi = async (path) => { //上传图片接口
  uni.uploadFile({
    url: baseURL + "sysFile/uploadFile",
    filePath: path,
    name: "file",
    formData: {
      fileName: "工单图片",
    },
    success: (uploadFileRes) => {
      const typeList = ['beforeApplyPic', 'afterApplyPic', 'drivingLicense', 'recPic', 'driverLicense',
        'managerFile', 'electricalFile', 'busFile', 'hostPic', 'attachment']
      const { data } = JSON.parse(uploadFileRes.data);
      if (upType.value == "storePic") { //  门店图片
        postForm.value.addressInfo.storePic.push(data.url)
      } else if (typeList.includes(upType.value)) { // 施工信息图片
        if (!Array.isArray(postForm.value.applyInfo[upIdx.value][upType.value])) {
          postForm.value.applyInfo[upIdx.value][upType.value] = []
        }
        postForm.value.applyInfo[upIdx.value][upType.value].push(data.url)
      }
    },
  });
}


const onLongpress = e => { // 图片预览长按事件
  console.log('当前长按的图片是' + e);
  uni.showActionSheet({
    itemList: ['删除', '保存到手机'],
    success: function (res) {
      if (res.tapIndex == 0) {
        variableList.value.forEach((item, idx) => {
          if (item == e) {
            console.log("holdIdx.value", holdIdx.value);
            console.log("holdType.value", holdType.value);
            variableList.value.splice(idx, 1);
            if (holdType.value == 'storePic') {
              postForm.value.addressInfo.storePic.splice(idx, 1);
            } else {
              postForm.value.applyInfo[holdIdx.value][holdType.value].splice(idx, 1);
            }

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

const lookover = (urls, urlIdx, ylIdx, hold) => { // 点击图片预览
  console.log("🚀 ~ lookover ~ ylIdx:", ylIdx)
  holdType.value = hold //预览图片的类型
  holdIdx.value = ylIdx //预览图片的下标

  variableList.value = urls.map(item => baseURL + item)
  setTimeout(() => {
    previewImage.value.open(baseURL + urls[urlIdx]); // 传入当前选中的图片地址(小程序必须添加$nextTick，解决组件首次加载无图)
  }, 100)
}

// --------------------------------------------------签名 --------------------------------------

const goSign = (e) => {
  uni.navigateTo({
    url: `/pagesFn/work/signature?upType=${e}`
  })
}

const upObj = { // 上传图片类型映射表
  "storePic": "门店图片",
  "beforeApplyPic": "施工前照片",
  "afterApplyPic": "施工后照片",
  "drivingLicense": "行驶证",
  "driverLicense": "驾驶证",
  "managerFile": "管理员信息附件",
  "electricalFile": "电气附件",
  "busFile": "总线附件",
  "hostPic": "主机照片",
  "attachment": "附件检查",
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

// --------------------------------------------------工单维护选项信息 --------------------------------------
const vehicleTypeList = [// 车辆类型
  {//       
    label: '专业工程运输车',
    value: '专业工程运输车'
  },
  {
    label: '渣土车',
    value: '渣土车'
  },
  {
    label: '牵引车',
    value: '牵引车'
  },
  {
    label: '挂车',
    value: '挂车'
  },
  {
    label: '罐车',
    value: '罐车'
  },
  {
    label: '单位自用',
    value: '单位自用'
  },
  {
    label: '工程车',
    value: '工程车'
  },
  {
    label: '重型货车',
    value: '重型货车'
  },
  {
    label: '中型货车',
    value: '中型货车'
  },
  {
    label: '小型货车',
    value: '小型货车'
  },
  {
    label: '其他',
    value: '其他'
  },

]


const breakdownTypeList = [  // 故障分类
  {
    label: '丢里程',
    value: '丢里程'
  },
  {
    label: '无信号',
    value: '无信号'
  },
  {
    label: '无定位',
    value: '无定位'
  },
  {
    label: '终端离线',
    value: '终端离线'
  },
  {
    label: '终端漂移',
    value: '终端漂移'
  },
  {
    label: '画面闪烁',
    value: '画面闪烁'
  },
  {
    label: '主机重启',
    value: '主机重启'
  },
  {
    label: '更换硬盘',
    value: '更换硬盘'
  },
  {
    label: '更换Sim卡',
    value: '更换Sim卡'
  },
  {
    label: '更换摄像头',
    value: '更换摄像头'
  },
  {
    label: '天线安装异常',
    value: '天线安装异常'
  },
  {
    label: '终端安装异常',
    value: '终端安装异常'
  },
  {
    label: '其他',
    value: '其他'
  },
]
const failureCauseList = [ //故障原因
  {
    label: '使用不当',
    value: '使用不当'
  },
  {
    label: '设备质量问题',
    value: '设备质量问题'
  },
  {
    label: '人为原因',
    value: '人为原因'
  },
  {
    label: '正常损坏',
    value: '正常损坏'
  },
  {
    label: 'sim卡原因',
    value: 'sim卡原因'
  },
  {
    label: '主机故障',
    value: '主机故障'
  },
  {
    label: '摄像头故障',
    value: '摄像头故障'
  },
  {
    label: '线路故障',
    value: '线路故障'
  },
  {
    label: '存储故障',
    value: '存储故障'
  },
  {
    label: '灯板故障',
    value: '灯板故障'
  },
  {
    label: '辅材故障',
    value: '辅材故障'
  },
  {
    label: '天线故障',
    value: '天线故障'
  },
  {
    label: '其他',
    value: '其他'
  },
]
const maintenanceMode = [
  {
    label: '维护处理',
    value: '维护处理'
  },
  {
    label: '更换部件',
    value: '更换部件'
  },
]
const changeList = [
  {
    label: '主机',
    value: '主机'
  },
  {
    label: '摄像机硬盘',
    value: '摄像机硬盘'
  },
  {
    label: '储存卡',
    value: '储存卡'
  },
  {
    label: '通讯模块',
    value: '通讯模块'
  },
  {
    label: '定位模块',
    value: '定位模块'
  },
  {
    label: '通讯天线',
    value: '通讯天线'
  },
  {
    label: '定位天线',
    value: '定位天线'
  },
  {
    label: '物联卡',
    value: '物联卡'
  },
]
const equipmentList = [
  {
    label: '大华',
    value: '大华'
  },
  {
    label: '海康',
    value: '海康'
  },
  {
    label: '其他',
    value: '其他'
  }
]

const aisleList = [
  {
    label: "通道1",
    value: '通道1',
  },
  {
    label: "通道2",
    value: '通道2',
  },
  {
    label: "通道3",
    value: '通道3',
  },
  {
    label: "通道4",
    value: '通道4',
  },
  {
    label: "通道5",
    value: '通道5',
  },
  {
    label: "通道6",
    value: '通道6',
  },
  {
    label: "通道7",
    value: '通道7',
  },
  {
    label: "通道8",
    value: '通道8',
  },
  {
    label: "通道9",
    value: '通道9',
  },
  {
    label: "通道10",
    value: '通道10',
  },
  {
    label: "通道11",
    value: '通道11',
  },
  {
    label: "通道12",
    value: '通道12',
  },
  {
    label: "通道13",
    value: '通道13',
  },
  {
    label: "通道14",
    value: '通道14',
  },
  {
    label: "通道15",
    value: '通道15',
  },
  {
    label: "通道16",
    value: '通道16',
  },
]
// --------------------------------------------------工单新装选项信息 --------------------------------------

const carTypeList = [// 车辆类型
  {
    label: '定位终端',
    value: '定位终端'
  },
  {
    label: '视频终端',
    value: '视频终端'
  },
  {
    label: '场地监控',
    value: '场地监控'
  },
  {
    label: '通用设备',
    value: '通用设备'
  },
  {
    label: '汽车行驶记录仪',
    value: '汽车行驶记录仪'
  },
]


const segmentedCenter = ref(null);
const verifyErr = (msg) => {
  // uni.showToast({
  //   title: msg,
  //   icon: 'error',
  // })
  Toast.error(msg)
  // segmentedCenter.value.scrollTo(0, 2);
}

const verifyForm = () => {
  if (postForm.value.addressInfo.isLocation == 1 && !postForm.value.addressInfo.address) {
    verifyErr("请输入正确地址")
    return false
  }
  if (workHandle.value.orderType == 2) { //维护
    const isValid = postForm.value.applyInfo.some((item, idx) => {
      if (!item.faultType) {
        verifyErr(`施工信息 ${idx + 1} - 请选择故障分类!`)
        workCurrent.value = idx
        return true
      }
      if (!item.faultReason) {
        verifyErr(`施工信息 ${idx + 1} - 请选择故障原因!`)
        workCurrent.value = idx
        return true
      }
      if (!item.whType) {
        verifyErr(`施工信息 ${idx + 1} - 请选择维护方式!`)
        workCurrent.value = idx
        return true
      }

      if (item.whType == '维护处理') {
        if (!item.whContent) {
          verifyErr(`施工信息 ${idx + 1} - 请输入维护内容!`)
          workCurrent.value = idx
          return true
        }
      } else if (item.whType == '更换部件') {
        if (!item.replacePart) {
          verifyErr(`施工信息 ${idx + 1} - 请选择更换部件!`)
          workCurrent.value = idx
          return true
        }
        if (!item.deviceBrand) {
          verifyErr(`施工信息 ${idx + 1} - 请选择设备品牌!`)
          workCurrent.value = idx
          return true
        }
        if (!item.deviceSerial) {
          verifyErr(`施工信息 ${idx + 1} - 请选择设备序列号!`)
          workCurrent.value = idx
          return true
        }

        if (!item.deviceModel) {
          verifyErr(`施工信息 ${idx + 1} - 请选择设备型号!`)
          workCurrent.value = idx
          return true
        }
        if (!item.simNum) {
          verifyErr(`施工信息 ${idx + 1} - 请输入SIM卡号!`)
          workCurrent.value = idx
          return true
        }
      }
    })
    if (!isValid) {
      console.log("全部校验通过", !isValid);
      // return true
    } else {
      console.log("校验不通过", !isValid);
      return false
    }
  } else if (workHandle.value.orderType == 3) { //新装
    const isValid = postForm.value.applyInfo.some((item, idx) => {

      if (!item.deviceType) {
        verifyErr(`施工信息 ${idx + 1} - 请选择设备类型!`)
        workCurrent.value = idx
        return true
      }

      //if (!item.carPlate) {
      //  verifyErr(`施工信息 ${idx + 1} - 请输入车牌号码/VIN码!`)
      //  workCurrent.value = idx
      //  return true
      //}

      if (!item.carType) {
        verifyErr(`施工信息 ${idx + 1} - 请选择车辆类型!`)
        workCurrent.value = idx
        return true
      }

      if (!item.deviceBrand) {
        verifyErr(`施工信息 ${idx + 1} - 请选择设备品牌!`)
        workCurrent.value = idx
        return true
      }
      if (!item.deviceSerial) {
        verifyErr(`施工信息 ${idx + 1} - 请选择设备序列号!`)
        workCurrent.value = idx
        return true
      }

      if (!item.deviceModel) {
        verifyErr(`施工信息 ${idx + 1} - 请选择设备型号!`)
        workCurrent.value = idx
        return true
      }
      if (!item.simNum) {
        verifyErr(`施工信息 ${idx + 1} - 请输入SIM卡号!`)
        workCurrent.value = idx
        return true
      }

      if (item.deviceType == '汽车行驶记录仪') {
        if (!item.tpmId) {
          verifyErr(`施工信息 ${idx + 1} - 请选择设备安全芯片ID!`)
          workCurrent.value = idx
          return true
        }
        if (!item.tpmTime) {
          verifyErr(`施工信息 ${idx + 1} - 请选择设备安全芯片时间!`)
          workCurrent.value = idx
          return true
        }
        if (!item.verifyCode) {
          verifyErr(`施工信息 ${idx + 1} - 请选择实时验证码!`)
          workCurrent.value = idx
          return true
        }
        if (!item.recPic || item.recPic.length == 0) {
          verifyErr(`施工信息 ${idx + 1} - 请上传新车记录仪图片!`)
          workCurrent.value = idx
          return true
        }

        if (!item.recPic || item.recPic.length == 0) {
          verifyErr(`施工信息 ${idx + 1} - 请上传行驶证图片!`)
          workCurrent.value = idx
          return true
        }
        if (!item.drivingLicense || item.drivingLicense.length == 0) {
          verifyErr(`施工信息 ${idx + 1} - 请上传行驶证附件!`)
          workCurrent.value = idx
          return true
        }
        if (!item.driverLicense || item.driverLicense.length == 0) {
          verifyErr(`施工信息 ${idx + 1} - 请上传驾驶证附件!`)
          workCurrent.value = idx
          return true
        }
        if (!item.managerFile || item.managerFile.length == 0) {
          verifyErr(`施工信息 ${idx + 1} - 请上管理员信息附件!`)
          workCurrent.value = idx
          return true
        }
        if (!item.electricalFile || item.electricalFile.length == 0) {
          verifyErr(`施工信息 ${idx + 1} - 请上传电气附件!`)
          workCurrent.value = idx
          return true
        }
        if (!item.busFile || item.busFile.length == 0) {
          verifyErr(`施工信息 ${idx + 1} - 请上传>总线附件!`)
          workCurrent.value = idx
          return true
        }
        if (!item.hostPic || item.hostPic.length == 0) {
          verifyErr(`施工信息 ${idx + 1} - 请上传主机照片附件!`)
          workCurrent.value = idx
          return true
        }
        if (!item.attachment || item.attachment.length == 0) {
          verifyErr(`施工信息 ${idx + 1} - 请上传附件检查照片!`)
          workCurrent.value = idx
          return true
        }

        if (!item.afterApplyPic || item.afterApplyPic.length == 0) {
          verifyErr(`施工信息 ${idx + 1} - 请上传施工后照片!`)
          workCurrent.value = idx
          return true
        }

      }

    })
    if (!isValid) {
      console.log("全部校验通过", !isValid);
      // return true
    } else {
      console.log("校验不通过", !isValid);
      return false
    }
  }
  console.log("postForm.value.signInfo.engieeSign", postForm.value.signInfo.engieeSign);
  if (!postForm.value.signInfo.engieeSign) {
    verifyErr("运维人员签名不能为空")
    return false
  }
  if (!postForm.value.signInfo.userSign) {
    verifyErr("用户签名不能为空")
    return false
  }


  return true
}

const workCurrent = ref(0)
const animationfinish = (e) => {
  workCurrent.value = e.detail.current;
}

const onswiperchange = (e) => {
  // #ifndef APP-PLUS || H5 || MP-WEIXIN || MP-QQ
  let index = e.target.current || e.detail.current;
  // this.tabsChange(index);
  workCurrent.value = index;
  // #endif
}

const bluetoothBtn = (item) => {
  console.log("🚀 ~ bluetoothBtn ~ item:", item)
  uni.navigateTo({
    url: '/pagesFn/electronicsTag/index',
  })
}


</script>
<template>
  <wd-toast></wd-toast>
  <view class="handleWork">
    <navbar :title="'处理工单'" />
    <view class="details_center">
      <view class="top_segmented">
        <view class="operate_box" v-if="segmented == 1">
          <image class="operate_img" @tap="addWorkBtn" src="http://116.62.107.90:8673/images/icons/addWork.png"
            mode="scaleToFill" />
        </view>
        <wd-tabs v-model="segmented" @change="tabChange">
          <block>
            <wd-tab title="地址核查"></wd-tab>
          </block>
          <block>
            <wd-tab title="施工信息"></wd-tab>
          </block>
          <block>
            <wd-tab title="签字确认"></wd-tab>
          </block>
        </wd-tabs>
      </view>

      <scroll-view scroll-y :show-scrollbar="false" class="segmented_center" ref="segmentedCenter">
        <view class="center center1" v-show="segmented == 0">
          <view class="verifyInfo">
            <view class="label">位置校验：</view>
            <button class="verifyBtn" @tap="getLocation(true)">点击校验</button>
          </view>
          <wd-radio-group v-model="postForm.addressInfo.isLocation" shape="dot" inline @change="getLocation">
            <wd-radio :value="0">真实</wd-radio>
            <wd-radio :value="1" class="isErr">有误</wd-radio>
          </wd-radio-group>

          <view class="correct_text" v-if="postForm.addressInfo.isLocation == 1">
            <view class="label requiredLabel">正确地址：</view>
            <view class="textarea_box">
              <image class="address_img" src="http://116.62.107.90:8673/images/icons/address.png" mode="scaleToFill" />
              <textarea v-model="postForm.addressInfo.address" placeholder="请输入正确的地址"></textarea>
            </view>
          </view>

          <view class="upImg_box">
            <view class="label">门店图片:<text class="up_tip">请上传jpg、png格式图片</text></view>
            <view class="img_box">
              <view class="img_item" v-for="(img, idx) in postForm.addressInfo.storePic"
                @tap="lookover(postForm.addressInfo.storePic, idx, 0, 'storePic')">
                <image class="img" :src="baseURL + img" :key="idx" mode="scaleToFill" />
              </view>
              <view class="img_item up_btn" @tap.stop="upBtn('storePic', 0)">
                <image class="up_img" src="http://116.62.107.90:8673/images/fns/up_img.png" mode="scaleToFill" />
              </view>
            </view>
            <view class="up_tip">请打开手机「隐私权限」</view>
          </view>
        </view>

        <view class="center center2" v-show="segmented == 1">
          <view class="workCurrent_box" v-if="postForm.applyInfo.length > 1">
            <view class="currentIndex" v-for="(item, idx) in postForm.applyInfo" :key="idx"
              :class="{ active: workCurrent == idx }" @tap="workCurrent = idx">
              {{ '施工信息-' + (idx + 1) }}
              <!-- <view class="bor"></view> -->
            </view>
          </view>
          <swiper :disable-touch="postForm.applyInfo.length <= 1" class="my_swiper" :current="workCurrent"
            @animationfinish="animationfinish" @change="onswiperchange" v-if="workHandle.orderType == 2">
            <swiper-item class="form_center" v-for="(item, idx) in postForm.applyInfo" :key="idx"
              :class="{ ios: isIos }">
              <scroll-view scroll-y :show-scrollbar="false" style="width: 100%;height: 100%;position: relative;">
                <view class="work_del_btn">
                  <image class="operate_img" @tap="delWorkBtn(idx)" v-if="postForm.applyInfo.length > 1"
                    src="http://116.62.107.90:8673/images/icons/delWork1.png" mode="scaleToFill" />
                </view>
                <wd-input type="text" v-model="item.carPlate" label="车牌号码/VIN码:" placeholder="请输入" />
                <view class="inp_item">
                  <view class="label">车辆类型:</view>
                  <view class="inp_value" @tap="openSelect(item, idx, 'carType')">
                    <view class="val">{{ item.carType ? item.carType : '请选择' }}</view>
                    <image class="select_icon" src="http://116.62.107.90:8673/images/icons/select_icon.png"
                      mode="scaleToFill" />
                  </view>
                </view>
                <view class="upImg_box">
                  <view class="label">施工前照片:</view>
                  <view class="img_box">
                    <view class="img_item" v-for="(img, index) in item.beforeApplyPic"
                      @tap="lookover(item.beforeApplyPic, index, idx, 'beforeApplyPic')">
                      <image class="img" :src="baseURL + img" :key="index" mode="scaleToFill" />
                    </view>
                    <view class="img_item up_btn" @tap="upBtn('beforeApplyPic', idx)">
                      <image class="up_img" src="http://116.62.107.90:8673/images/fns/up_img.png" mode="scaleToFill" />
                    </view>
                  </view>
                </view>
                <view class="inp_item">
                  <view class="label requiredLabel">故障分类:</view>
                  <view class="inp_value" @tap="openSelect(item, idx, 'faultType')">
                    <view class="val">{{ item.faultType ? item.faultType : '请选择' }}</view>
                    <image class="select_icon" src="http://116.62.107.90:8673/images/icons/select_icon.png"
                      mode="scaleToFill" />
                  </view>
                </view>
                <view class="inp_item">
                  <view class="label requiredLabel">故障原因:</view>
                  <view class="inp_value" @tap="openSelect(item, idx, 'faultReason')">
                    <view class="val">{{ item.faultReason ? item.faultReason : '请选择' }}</view>
                    <image class="select_icon" src="http://116.62.107.90:8673/images/icons/select_icon.png"
                      mode="scaleToFill" />
                  </view>
                </view>
                <view class="inp_item">
                  <view class="label requiredLabel">维护方式:</view>
                  <view class="inp_value" @tap="openSelect(item, idx, 'whType')">
                    <view class="val">{{ item.whType ? item.whType : '请选择' }}</view>
                    <image class="select_icon" src="http://116.62.107.90:8673/images/icons/select_icon.png"
                      mode="scaleToFill" />
                  </view>
                </view>

                <view v-if="item.whType == '维护处理'">
                  <view class="correct_text">
                    <view class="label requiredLabel">维护内容:</view>
                    <view class="textarea_box">
                      <textarea v-model="item.whContent" placeholder="请输入维护内容"></textarea>
                    </view>
                  </view>
                  <view class="usePart">
                    <view class="label">使用部件:</view>
                    <view class="parts">
                      <view class="input_number">
                        <view class="label">主机:</view>
                        <wd-input-number :min="0" v-model="item.ext1" />
                      </view>

                      <view class="input_number">
                        <view class="label">硬盘:</view>
                        <wd-input-number :min="0" v-model="item.ext2" />
                      </view>
                      <view class="input_number">
                        <view class="label">U盘:</view>
                        <wd-input-number :min="0" v-model="item.ext3" />
                      </view>

                      <view class="input_number">
                        <view class="label">摄像头:</view>
                        <wd-input-number :min="0" v-model="item.ext4" />
                      </view>

                      <view class="input_number">
                        <view class="label">GPS天线:</view>
                        <wd-input-number :min="0" v-model="item.ext5" />
                      </view>

                      <view class="input_number">
                        <view class="label">4G天线:</view>
                        <wd-input-number :min="0" v-model="item.ext6" />
                      </view>

                      <view class="input_number">
                        <view class="label">电源线:</view>
                        <wd-input-number :min="0" v-model="item.ext7" />
                      </view>
                      <view class="input_number">
                        <view class="label">视频线:</view>
                        <wd-input-number :min="0" v-model="item.ext8" />
                      </view>

                      <view class="input_number">
                        <view class="label">显示屏:</view>
                        <wd-input-number :min="0" v-model="item.ext9" />
                      </view>

                      <view class="input_number">
                        <view class="label">转接线:</view>
                        <wd-input-number :min="0" v-model="item.ext10" />
                      </view>

                      <view class="input_number">
                        <view class="label">机芯:</view>
                        <wd-input-number :min="0" v-model="item.ext11" />
                      </view>

                      <view class="input_number">
                        <view class="label">灯板:</view>
                        <wd-input-number :min="0" v-model="item.ext12" />
                      </view>
                      <view class="input_number">
                        <view class="label">防爆管:</view>
                        <wd-input-number :min="0" v-model="item.ext13" />
                      </view>

                      <view class="input_number">
                        <view class="label">保险:</view>
                        <wd-input-number :min="0" v-model="item.ext14" />
                      </view>

                      <view class="input_number input_long">
                        <view class="label">辅材(金属变径,紧缩变径,波纹管等):</view>
                        <wd-input-number :min="0" v-model="item.ext15" />
                      </view>

                    </view>
                  </view>
                </view>
                <view v-else-if="item.whType == '更换部件'">
                  <view class="inp_item">
                    <view class="label requiredLabel">更换部件:</view>
                    <view class="inp_value" @tap="openSelect(item, idx, 'replacePart')">
                      <view class="val">{{ item.replacePart ? item.replacePart : '请选择' }}</view>
                      <image class="select_icon" src="http://116.62.107.90:8673/images/icons/select_icon.png"
                        mode="scaleToFill" />
                    </view>
                  </view>
                  <view class="inp_item">
                    <view class="label requiredLabel">设备品牌:</view>
                    <view class="inp_value" @tap="openSelect(item, idx, 'deviceBrand')">
                      <view class="val">{{ item.deviceBrand ? item.deviceBrand : '请选择' }}</view>
                      <image class="select_icon" src="http://116.62.107.90:8673/images/icons/select_icon.png"
                        mode="scaleToFill" />
                    </view>
                  </view>
                  <wd-input type="text" v-model="item.deviceSerial" label="设备序列号:" placeholder="请输入" required />
                  <wd-input type="text" v-model="item.deviceModel" label="设备型号:" placeholder="请输入" required />
                  <wd-input type="text" v-model="item.simNum" label="SIM卡号:" placeholder="请输入" required />

                  <view class="inp_item">
                    <view class="label">通道类型:</view>
                    <view class="inp_value" @tap="openSelect(item, idx, 'channelType')">
                      <view class="val">{{ item.channelType &&
                        item.channelType.length ?
                        item.channelType.join(',') : '请选择'
                        }}</view>
                      <image class="select_icon" src="http://116.62.107.90:8673/images/icons/select_icon.png"
                        mode="scaleToFill" />
                    </view>
                  </view>

                </view>
                <view style="height: 10rpx;" />
                <view class="upImg_box">
                  <view class="label">施工后照片:</view>
                  <view class="img_box"> <!-- afterApplyPic -->
                    <view class="img_item" v-for="(img, index) in item.afterApplyPic"
                      @tap="lookover(item.afterApplyPic, index, idx, 'afterApplyPic')">
                      <image class="img" :src="baseURL + img" :key="index" mode="scaleToFill" />
                    </view>
                    <view class="img_item up_btn" @tap="upBtn('afterApplyPic', idx)">
                      <image class="up_img" src="http://116.62.107.90:8673/images/fns/up_img.png" mode="scaleToFill" />
                    </view>
                  </view>
                </view>

                <view class="correct_text" style="border: none;">
                  <view class="label">备注:</view>
                  <view class="textarea_box">
                    <textarea v-model="item.remark" placeholder="请输入备注"></textarea>
                  </view>
                </view>
              </scroll-view>
            </swiper-item>
          </swiper>

          <swiper :disable-touch="postForm.applyInfo.length <= 1" class="my_swiper" :current="workCurrent"
            @animationfinish="animationfinish" @change="onswiperchange" v-if="workHandle.orderType == 3">
            <swiper-item class="form_center" v-for="(item, idx) in postForm.applyInfo" :key="idx"
              :class="{ ios: isIos }">
              <scroll-view scroll-y :show-scrollbar="false" style="width: 100%;height: 100%;position: relative;">
                <view class="work_del_btn">
                  <image class="operate_img" @tap="delWorkBtn(idx)" v-if="postForm.applyInfo.length > 1"
                    src="http://116.62.107.90:8673/images/icons/delWork1.png" mode="scaleToFill" />
                </view>

                <view class="inp_item">
                  <view class="label requiredLabel">设备类型:</view>
                  <view class="inp_value" @tap="openSelect(item, idx, 'deviceType')">
                    <view class="val">{{ item.deviceType ? item.deviceType : '请选择' }}</view>
                    <image class="select_icon" src="http://116.62.107.90:8673/images/icons/select_icon.png"
                      mode="scaleToFill" />
                  </view>
                </view>
                <wd-input type="text" v-model="item.carPlate" label="车牌号码/VIN码:" placeholder="请输入" />

                <view class="inp_item">
                  <view class="label">车辆类型:</view>
                  <view class="inp_value" @tap="openSelect(item, idx, 'carType')">
                    <view class="val">{{ item.carType ? item.carType : '请选择' }}</view>
                    <image class="select_icon" src="http://116.62.107.90:8673/images/icons/select_icon.png"
                      mode="scaleToFill" />
                  </view>
                </view>

                <view class="upImg_box" v-if="item.deviceType && item.deviceType != '汽车行驶记录仪'">
                  <view class="label">施工前照片:</view>
                  <view class="img_box">
                    <view class="img_item" v-for="(img, index) in item.beforeApplyPic"
                      @tap="lookover(item.beforeApplyPic, index, idx, 'beforeApplyPic')">
                      <image class="img" :src="baseURL + img" :key="index" mode="scaleToFill" />
                    </view>
                    <view class="img_item up_btn" @tap="upBtn('beforeApplyPic', idx)">
                      <image class="up_img" src="http://116.62.107.90:8673/images/fns/up_img.png" mode="scaleToFill" />
                    </view>
                  </view>
                </view>

                <view class="inp_item">
                  <view class="label requiredLabel">设备品牌:</view>
                  <view class="inp_value" @tap="openSelect(item, idx, 'deviceBrand')">
                    <view class="val">{{ item.deviceBrand ? item.deviceBrand : '请选择' }}</view>
                    <image class="select_icon" src="http://116.62.107.90:8673/images/icons/select_icon.png"
                      mode="scaleToFill" />
                  </view>
                </view>


                <view class="inp_item" v-if="item.deviceType && item.deviceType == '汽车行驶记录仪'">
                  <view class="label requiredLabel">设备序列号:</view>
                  <view class="inp_value inp_box">
                    <view class="bluetooth_box" @tap="bluetoothBtn(item)">
                      <image class="bluetooth_img" src="http://116.62.107.90:8673/images/icons/bluetooth.png"
                        mode="scaleToFill" />
                      <text>蓝牙连接</text>
                    </view>
                    <input class="input_val" type="text" placeholder="请输入" v-model="item.deviceSerial">
                  </view>
                </view>

                <wd-input type="text" v-else v-model="item.deviceSerial" label="设备序列号:" placeholder="请输入" required />
                <wd-input type="text" v-if="item.deviceType && item.deviceType == '汽车行驶记录仪'" v-model="item.tpmId"
                  label="设备安全芯片ID:" placeholder="请输入" required />

                <wd-input type="text" v-if="item.deviceType && item.deviceType == '汽车行驶记录仪'" v-model="item.tpmTime"
                  label="安全芯片时间:" placeholder="请输入" required />

                <wd-input type="text" v-if="item.deviceType && item.deviceType == '汽车行驶记录仪'" v-model="item.verifyCode"
                  label="实时验证码:" placeholder="请输入" required />

                <wd-input type="text" v-model="item.deviceModel" label="设备型号:" placeholder="请输入" required />
                <wd-input type="text" v-model="item.simNum" label="SIM卡号:" placeholder="请输入" required />

                <view class="inp_item">
                  <view class="label">通道类型:</view>
                  <view class="inp_value" @tap="openSelect(item, idx, 'channelType')">
                    <view class="val">{{ item.channelType &&
                      item.channelType.length ?
                      item.channelType.join(',') : '请选择'
                      }}</view>
                    <image class="select_icon" src="http://116.62.107.90:8673/images/icons/select_icon.png"
                      mode="scaleToFill" />
                  </view>
                </view>

                <view class="correct_text" style="border: none;" v-if="item.deviceType && item.deviceType != '汽车行驶记录仪'">
                  <view class="label">新装内容:</view>
                  <view class="textarea_box">
                    <textarea v-model="item.xzContent" placeholder="请输入新装内容"></textarea>
                  </view>
                </view>

                <view class="upImg_box" v-if="item.deviceType && item.deviceType != '汽车行驶记录仪'">
                  <view class="label">施工后照片:</view>
                  <view class="img_box"> <!-- afterApplyPic -->
                    <view class="img_item" v-for="(img, index) in item.afterApplyPic"
                      @tap="lookover(item.afterApplyPic, index, idx, 'afterApplyPic')">
                      <image class="img" :src="baseURL + img" :key="index" mode="scaleToFill" />
                    </view>
                    <view class="img_item up_btn" @tap="upBtn('afterApplyPic', idx)">
                      <image class="up_img" src="http://116.62.107.90:8673/images/fns/up_img.png" mode="scaleToFill" />
                    </view>
                  </view>
                </view>


                <view class="up_list" v-if="item.deviceType == '汽车行驶记录仪'">

                  <view class="upImg_box">
                    <view class="label requiredLabel">新车记录仪图片:<text class="up_tip">含设备序列号、安全芯片ID、安全芯片时间、实时验证码。</text>
                    </view>
                    <view class="img_box">
                      <view class="img_item" v-for="(img, index) in item.recPic"
                        @tap="lookover(item.recPic, index, idx, 'recPic')">
                        <image class="img" :src="baseURL + img" :key="index" mode="scaleToFill" />
                      </view>
                      <view class="img_item up_btn" @tap="upBtn('recPic', idx)">
                        <image class="up_img" src="http://116.62.107.90:8673/images/fns/up_img.png"
                          mode="scaleToFill" />
                      </view>
                    </view>
                  </view>

                  <view class="upImg_box">
                    <view class="label requiredLabel">行驶证附件:</view>
                    <view class="img_box">
                      <view class="img_item" v-for="(img, index) in item.drivingLicense"
                        @tap="lookover(item.drivingLicense, index, idx, 'drivingLicense')">
                        <image class="img" :src="baseURL + img" :key="index" mode="scaleToFill" />
                      </view>
                      <view class="img_item up_btn" @tap="upBtn('drivingLicense', idx)">
                        <image class="up_img" src="http://116.62.107.90:8673/images/fns/up_img.png"
                          mode="scaleToFill" />
                      </view>
                    </view>
                  </view>

                  <view class="upImg_box">
                    <view class="label requiredLabel">驾驶证附件:</view>
                    <view class="img_box">
                      <view class="img_item" v-for="(img, index) in item.driverLicense"
                        @tap="lookover(item.driverLicense, index, idx, 'driverLicense')">
                        <image class="img" :src="baseURL + img" :key="index" mode="scaleToFill" />
                      </view>
                      <view class="img_item up_btn" @tap="upBtn('driverLicense', idx)">
                        <image class="up_img" src="http://116.62.107.90:8673/images/fns/up_img.png"
                          mode="scaleToFill" />
                      </view>
                    </view>
                  </view>

                  <view class="upImg_box">
                    <view class="label requiredLabel">管理员信息附件:</view>
                    <view class="img_box">
                      <view class="img_item" v-for="(img, index) in item.managerFile"
                        @tap="lookover(item.managerFile, index, idx, 'managerFile')">
                        <image class="img" :src="baseURL + img" :key="index" mode="scaleToFill" />
                      </view>
                      <view class="img_item up_btn" @tap="upBtn('managerFile', idx)">
                        <image class="up_img" src="http://116.62.107.90:8673/images/fns/up_img.png"
                          mode="scaleToFill" />
                      </view>
                    </view>
                  </view>

                  <view class="upImg_box">
                    <view class="label requiredLabel">电气附件:</view>
                    <view class="img_box">
                      <view class="img_item" v-for="(img, index) in item.electricalFile"
                        @tap="lookover(item.electricalFile, index, idx, 'electricalFile')">
                        <image class="img" :src="baseURL + img" :key="index" mode="scaleToFill" />
                      </view>
                      <view class="img_item up_btn" @tap="upBtn('electricalFile', idx)">
                        <image class="up_img" src="http://116.62.107.90:8673/images/fns/up_img.png"
                          mode="scaleToFill" />
                      </view>
                    </view>
                  </view>

                  <view class="upImg_box">
                    <view class="label requiredLabel">总线附件:</view>
                    <view class="img_box">
                      <view class="img_item" v-for="(img, index) in item.busFile"
                        @tap="lookover(item.busFile, index, idx, 'busFile')">
                        <image class="img" :src="baseURL + img" :key="index" mode="scaleToFill" />
                      </view>
                      <view class="img_item up_btn" @tap="upBtn('busFile', idx)">
                        <image class="up_img" src="http://116.62.107.90:8673/images/fns/up_img.png"
                          mode="scaleToFill" />
                      </view>
                    </view>
                  </view>

                  <view class="upImg_box">
                    <view class="label requiredLabel">主机照片:</view>
                    <view class="img_box">
                      <view class="img_item" v-for="(img, index) in item.hostPic"
                        @tap="lookover(item.hostPic, index, idx, 'hostPic')">
                        <image class="img" :src="baseURL + img" :key="index" mode="scaleToFill" />
                      </view>
                      <view class="img_item up_btn" @tap="upBtn('hostPic', idx)">
                        <image class="up_img" src="http://116.62.107.90:8673/images/fns/up_img.png"
                          mode="scaleToFill" />
                      </view>
                    </view>
                  </view>

                  <view class="upImg_box">
                    <view class="label requiredLabel">附件检查:</view>
                    <view class="img_box">
                      <view class="img_item" v-for="(img, index) in item.attachment"
                        @tap="lookover(item.attachment, index, idx, 'attachment')">
                        <image class="img" :src="baseURL + img" :key="index" mode="scaleToFill" />
                      </view>
                      <view class="img_item up_btn" @tap="upBtn('attachment', idx)">
                        <image class="up_img" src="http://116.62.107.90:8673/images/fns/up_img.png"
                          mode="scaleToFill" />
                      </view>
                    </view>
                  </view>


                  <view class="upImg_box">
                    <view class="label requiredLabel">施工后照片:</view>
                    <view class="img_box">
                      <view class="img_item" v-for="(img, index) in item.afterApplyPic"
                        @tap="lookover(item.afterApplyPic, index, idx, 'afterApplyPic')">
                        <image class="img" :src="baseURL + img" :key="index" mode="scaleToFill" />
                      </view>
                      <view class="img_item up_btn" @tap="upBtn('afterApplyPic', idx)">
                        <image class="up_img" src="http://116.62.107.90:8673/images/fns/up_img.png"
                          mode="scaleToFill" />
                      </view>
                    </view>
                  </view>

                </view>

                <view class="correct_text" style="border: none;">
                  <view class="label">备注:</view>
                  <view class="textarea_box">
                    <textarea v-model="item.remark" placeholder="请输入备注"></textarea>
                  </view>
                </view>

                <view class="RFID_box" @tap="bluetoothBtn(item)" v-if="item.deviceType == '汽车行驶记录仪'">
                  <view class="icon"></view>
                  <view class="tit">电子标识连接</view>
                  <image class="tag_img" src="http://116.62.107.90:8673/images/icons/item_arrow_f.png"
                    mode="scaleToFill" />
                </view>
              </scroll-view>
            </swiper-item>
          </swiper>

        </view>

        <view class="center center3" v-show="segmented == 2">
          <view class="list-item">
            <view class="list-item-top">
              <view class="name">
                <view class="tag"></view>
                <text>运维签字</text>
              </view>
            </view>
            <view class="sign" @tap="goSign('engieeSign')">
              <image class="sign_img" v-if="postForm.signInfo.engieeSign" :src="baseURL + postForm.signInfo.engieeSign"
                mode="scaleToFill" />
            </view>
          </view>

          <view class="list-item">
            <view class="list-item-top">
              <view class="name">
                <view class="tag"></view>
                <text>用户签字</text>
              </view>
              <!-- <view class="btns" v-if="userSign">
                <button class="btn" @tap="ClearSign('userSign')">清除</button>
                <button class="btn" @tap="SaveSign('userSign')"
                  v-if="!postForm.signInfo.userSign || userSign">保存</button>
              </view> -->
            </view>
            <view class="sign" @tap="goSign('userSign')">
              <image class="sign_img" v-if="postForm.signInfo.userSign" :src="baseURL + postForm.signInfo.userSign"
                mode="scaleToFill" />
            </view>
          </view>
        </view>

        <button class="foot_btn" v-if="segmented == 2" @tap="submitBtn">提交工单</button>
        <button class="foot_btn" v-else-if="segmented == 0" @tap="nextStep(1)">下一步</button>
        <button class="foot_btn" v-else-if="segmented == 1" @tap="nextStep(2)">下一步</button>
      </scroll-view>
    </view>
    <!-- @onPostMessage="handleMessage" -->
    <web-view ref="mywebview" :src="watermarkUrl" @message="handleMessage" class="webview" :fullscreen="false"
      v-if="openWebview" />
    <QreviewImage ref="previewImage" :urls="variableList" @onLongpress="onLongpress" />
    <wd-action-sheet v-model="sheetShow" :actions="sheetActions" @select="sheetSelect" />
    <wd-select-picker use-default-slot ref="selectPicker" filterable :type="selectType" :columns="selectColumns"
      v-model="selectValue" @confirm="selectClose" />
  </view>
</template>
<style lang="scss" scoped>
.webview {
  width: 100vw;
  height: 100vh;
}

:deep(.wd-popup) {
  z-index: 9999;
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
  }
}



.handleWork {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  // overflow: hidden;
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

      padding: 30rpx;
      box-sizing: border-box;

      .label {
        font-size: 24rpx;
        color: #AAAAAA;
        margin-right: 10rpx;
        padding-left: 6rpx;
        box-sizing: border-box;
        flex-shrink: 0; // 不缩小
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

      .correct_text {
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

    }

    .center1 {
      width: 100%;
      min-height: 600rpx;
      background-color: #fff;
      box-shadow: 0rpx 5rpx 11rpx 2rpx rgba(0, 0, 0, 0.09);
      border-radius: 14rpx 14rpx 14rpx 14rpx;

      :deep(.wd-radio-group) {
        margin-left: 150rpx;
        height: 60rpx;
        line-height: 60rpx;

        .is-checked {
          &.isErr {
            .wd-radio__label {
              color: #FF0000;
            }

            .wd-radio__shape {
              border-color: #FF0000;
              background-color: #FF0000;
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

    .center2 {
      width: 100%;
      min-height: 1200rpx;
      padding: 0;

      .workCurrent_box {
        width: 100%;
        margin-bottom: 20rpx;
        background: #FFFFFF;
        box-shadow: 0rpx 4rpx 7rpx 2rpx rgba(0, 0, 0, 0.16);
        border-radius: 9rpx 9rpx 9rpx 9rpx;

        .currentIndex {
          width: calc(100% / 4);
          height: 66rpx;
          color: #9B9B9B;
          display: inline-block;
          font-size: 26rpx;
          line-height: 60rpx;
          text-align: center;
          box-sizing: border-box;

          &.active {
            color: #55A4FF;
            position: relative;

            .bor {
              width: 80%;
              height: 4rpx;
              background-color: #55A4FF;
              position: absolute;
              bottom: 4rpx;
              left: 10%;
            }
          }
        }
      }

      .my_swiper {
        width: 100%;
        height: 1200rpx;
        background-color: #fff;
        padding: 0 20rpx 20rpx 20rpx;
        box-sizing: border-box;
        box-shadow: 0rpx 5rpx 11rpx 2rpx rgba(0, 0, 0, 0.09);
        border-radius: 14rpx 14rpx 14rpx 14rpx;
      }

      .up_list {
        width: 100%;
      }

      .work_del_btn {
        width: 100%;
        min-height: 2rpx;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .operate_img {
          width: 42rpx;
          height: 42rpx;
        }
      }


      .form_center {
        width: 100%;
        height: 100%;
        margin-bottom: 30rpx;
        position: relative;

        &.ios {
          :deep(.wd-popup) {
            width: 90%;
            left: 5%;
            z-index: 9999;
          }
        }
      }

      :deep(.wd-input) {
        padding: 18rpx 10rpx 8rpx 0 !important;
        height: 60rpx;
        border-bottom: 2rpx solid #EFEFEF;

        .wd-input__label-inner {
          font-size: 24rpx;
          color: #AAAAAA;
        }

        .wd-input__inner {
          text-align: right;
          padding-right: 36rpx;
          box-sizing: border-box;
        }

        .uni-input-placeholder {
          font-size: 24rpx;
          color: #000000;
        }


      }

      .inp_item {
        width: 100%;
        height: 60rpx;
        padding: 12rpx 0;
        display: flex;
        align-items: center;
        border-bottom: 2rpx solid #EFEFEF;

        .inp_value {
          font-size: 24rpx;
          color: #000000;
          flex: 1;
          box-sizing: border-box;
          // padding-right: 50rpx;

          display: flex;
          align-items: center;

          .select_icon {
            width: 24rpx;
            height: 13rpx;
            flex-shrink: 0;
            padding-right: 12rpx;
          }

          .val {
            text-align: right;
            flex: 1;
            box-sizing: border-box;
            padding-right: 10rpx;
            //溢出显示省略号
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .inp_box {
          display: flex;
          align-items: center;

          .bluetooth_box {
            width: 160rpx;
            height: 42rpx;
            background: #4099FF;
            border-radius: 7rpx 7rpx 7rpx 7rpx;
            font-size: 24rpx;
            color: #FFFFFF;
            text-align: center;
            margin: 0 10rpx 0 6rpx;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;

            .bluetooth_img {
              width: 16rpx;
              height: 28rpx;
              margin-right: 8rpx;
            }
          }

          .input_val {
            text-align: right;
            font-size: 24rpx;
            color: #000000;
            flex: 1;
            box-sizing: border-box;
            padding-right: 50rpx;

            .input-placeholder {
              font-size: 24rpx;
              color: #000000;
            }


          }

        }

      }


      .upImg_box {
        margin: 20rpx 0 0 0;
        padding-bottom: 10rpx;
        border-bottom: 2rpx solid #EFEFEF;
      }

      .correct_text {
        margin: 20rpx 0 0 0;
        padding-bottom: 20rpx;
        border-bottom: 2rpx solid #EFEFEF;
      }

      .usePart {
        width: 100%;
        height: 780rpx;
        margin: 20rpx 0;
        padding-bottom: 20rpx;
        background-color: #fff;

        .parts {
          width: 100%;
          height: 780rpx;
          background: #F4F4F4;
          border-radius: 7rpx 7rpx 7rpx 7rpx;
          margin-top: 10rpx;
          display: flex;
          flex-wrap: wrap;
          padding: 20rpx 10rpx;
          box-sizing: border-box;

          .input_number {
            width: 50% !important;
            height: 66rpx;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 20rpx;
            box-sizing: border-box;
            flex-wrap: nowrap;

            .label {
              color: #000000;
            }

            &.input_long {
              width: 100% !important;

              .label {}
            }
          }

          :deep(.wd-input-number) {
            //不换行
            white-space: nowrap;

            .wd-input-number__action {
              width: 50rpx;
              height: 50rpx;
              border-radius: 50%;
              overflow: hidden;
              background-color: #55A4FF;
              color: #fff;
              transform: scale(.7);

              // &::before{
              //   font-size: 22rpx !important;
              // }
            }

            .wd-input-number__action-icon {
              // font-size: 20rpx !important;
              // line-height: 24rpx !important;
              // text-align: center;
            }

            .wd-input-number__inner {
              border: 2rpx solid #55A4FF;
              box-sizing: border-box;
              border-radius: 4rpx;
              padding: 0 3rpx;
            }
          }
        }
      }

      .RFID_box {
        width: 100%;
        height: 60rpx;
        margin-top: 10rpx;
        background: linear-gradient(87deg, #4557D1 0%, #72D2EB 93%, #75DBED 100%);
        border-radius: 12rpx;

        box-sizing: border-box;
        padding: 0 20rpx;
        display: flex;
        align-items: center;

        .icon {
          width: 7rpx;
          height: 34rpx;
          background: #FFFFFF;
          border-radius: 7rpx 7rpx 7rpx 7rpx;
          margin-right: 20rpx;
        }

        .tit {
          font-size: 28rpx;
          color: #ffffff;
          line-height: 34rpx;
        }

        .tag_img {
          width: 12rpx;
          height: 24rpx;
          margin-left: 40rpx;
          margin-top: 4 rpx;
        }


      }
    }


    .center3 {
      min-height: 800rpx;
      background-color: #fff;
      box-shadow: 0rpx 5rpx 11rpx 2rpx rgba(0, 0, 0, 0.09);
      border-radius: 14rpx 14rpx 14rpx 14rpx;

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
            font-size: 26rpx;
            color: #191919;
            font-weight: bold;
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

    .operate_img {
      width: 36rpx;
      height: 36rpx;
      margin-left: 6rpx;
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
      position: relative;

      .operate_box {
        width: 80rpx;
        height: 100%;
        position: absolute;
        right: 30%;
        top: 0;
        display: flex;
        align-items: center;
        z-index: 9;
      }

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

  .requiredLabel {
    position: relative;
    margin-left: 16rpx;

    &::before {
      content: '*';
      color: #fa4350;
      position: absolute;
      left: -15rpx;
      top: -6rpx;
      // transform: scale(1.5);
      font-size: 18px;
    }
  }
}

:deep(.uni-scroll-view-content) {
  height: 90% !important;
}

// :deep(.wd-transition) {
//   width: 100vw;
//   height: 100vh;
//   z-index: 99999;

//   .wd-popup {
//     width: 100vw;
//     height: 100vh;
//     z-index: 99999;
//   }
// }</style>
