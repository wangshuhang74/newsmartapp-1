<!-- 电子标识 -->

<template>
  <wd-toast></wd-toast>
  <view class="columnDisBox container">
    <navbar :title="'电子标识'" />
    <view class="tips_tit" v-if="currentStep < 4">
      <view class="notice_box disBox">
        <view class="boxFlex">
          <view class="disBox notice_item" @tap="nextStep(1)" :class="{ 'active': currentStep == 1 }">
            <text class="notice_index">1</text>
            <view class="notice_title">打开蓝牙</view>
            <image class="notice_img"
              :src="`http://116.62.107.90:8673/images/tips/${currentStep == 1 ? 'arrow_active.png' : 'arrow_default.png'}`"
              mode="scaleToFill" />
          </view>
        </view>
        <view class="boxFlex">
          <view class="disBox notice_item" @tap="nextStep(2)" :class="{ 'active': currentStep == 2 }">
            <text class="notice_index">2</text>
            <view class="notice_title">连接设备</view>
            <image class="notice_img"
              :src="`http://116.62.107.90:8673/images/tips/${currentStep == 2 ? 'arrow_active.png' : 'arrow_default.png'}`"
              mode="scaleToFill" />
          </view>
        </view>
        <view class="boxFlex">
          <view class="disBox notice_item" @tap="nextStep(3)" :class="{ 'active': currentStep == 3 }">
            <text class="notice_index">3</text>
            <view class="notice_title">激活电子车牌</view>
            <image class="notice_img"
              :src="`http://116.62.107.90:8673/images/tips/${currentStep == 3 ? 'arrow_active.png' : 'arrow_default.png'}`"
              mode="scaleToFill" />
          </view>
        </view>
      </view>
    </view>
    <view class="columnBoxFlex">
      <view class="blue_main blue_main1" v-if="currentStep == 1">
        <image src="http://116.62.107.90:8673/images/tips/connect_blue1.png" class="connect_icon" mode="scaleToFill" />
        <view class="next_step">确保手机已经蓝牙后点击下一步</view>
        <view class="open_blue">
          <view class="btn" @tap="openBlue">确认已打开</view>
        </view>
      </view>
      <view class="blue_main blue_main2" v-if="currentStep == 2">
        <image src="http://116.62.107.90:8673/images/tips/connect_blue2.png" class="connect_icon" mode="scaleToFill" />
        <view class="blue_list">
          <view :class="item.active ? 'disBox active' : 'disBox'" v-for="(item, index) in blueList" :key="index">
            <view class="boxFlex">
              <view class="blue_title">设备名称：{{ item.name }}</view>
              <view class="blue_title">设备地址：{{ item.deviceId }}</view>
            </view>
            <button type="default" class="connect_btn" v-if="!item.active" @tap="connectBlue(item)">连接</button>
            <button type="default" class="connect_btn" v-else>已连接</button>
          </view>
          <!-- <view class="disBox active">
            <view class="boxFlex">
              <view class="blue_title">设备名称：TX2000</view>
              <view class="blue_title">设备地址：22.03232</view>
            </view>
            <button type="default" class="connect_btn">已连接</button>
          </view>
          <view class="disBox">
            <view class="boxFlex">
              <view class="blue_title">设备名称：TX2000</view>
              <view class="blue_title">设备地址：22.03232</view>
            </view>
            <button type="default" class="connect_btn">连接</button>
          </view> -->
        </view>
        <view class="open_blue">
          <view class="btn search_btn" v-if="!BluetoothDevicesDiscovery && !BLEConnection" @tap="searchBlue">搜索设备</view>
          <view class="btn search_btn" v-if="BLEConnection && notifyBLEChar" @tap="goAuth">双向认证</view>
          <view class="btn" @tap="nextStep(3)" v-if="BLEConnection && notifyBLEChar">连接成功，下一步</view>
        </view>
      </view>
      <view class="blue_main blue_main1 blue_main3" v-if="currentStep == 3">
        <image src="http://116.62.107.90:8673/images/tips/connect_blue3.png" class="connect_icon" mode="scaleToFill" />
        <view class="next_step">请将电子车牌置于设备上方进行激活<br />正在激活电子车牌，请稍后…</view>
        <view class="open_blue">
          <!-- <view class="btn search_btn" @tap="readRandom">安全模块随机数</view>
          <view class="btn search_btn" @tap="sendCmd(secSNQuery)">安全模块序列号</view> -->
          <view class="btn search_btn" @tap="goActive('user0')">激活电子车牌</view>
          <view class="btn" @tap="goActive('user1')">已激活，下一步</view>
        </view>
      </view>
      <view class="blue_main blue_main1 blue_main4" v-if="currentStep == 4">
        <image src="http://116.62.107.90:8673/images/tips/connect_blue4.png" class="connect_icon" mode="scaleToFill" />
        <view class="next_step">激活成功！</view>
        <view class="open_blue">
          <view class="btn" @tap="goForm" style="margin-bottom: 20rpx;">读写数据</view>
          <view class="btn search_btn" @tap="goBack">返回上一步</view>
        </view>
      </view>
      <view class="blue_main blue_main1 blue_main4 blue_main5" v-if="currentStep == 5">
        <image src="http://116.62.107.90:8673/images/tips/connect_blue4.png" class="connect_icon" mode="scaleToFill" />
        <view class="next_step" style="color:#B90000;">激活失败！</view>
        <view class="contact_btn"><text>联系客服</text></view>
        <view class="open_blue">
          <view class="btn" @tap="nextStep">返回第一步</view>
        </view>
      </view>

    </view>

  </view>
</template>

<script setup>
import { auth } from "../../api/index"
import navbar from '@/pages/components/navbar.vue'
import { sendCmd, dealRecvData, ab2hex, currentStatus, tipsInfo, secRandom, safeSn, authStatus, writeStatus, getDeviceSecConfig, readRandom, addUserSelectSpec } from "../../utils/bluetooth";
import { storeToRefs } from 'pinia'
import { useTagsStore } from '@/store'
const tagsStore = useTagsStore()
const { tagsInfo, blueToothDevices, isOpenOnBlue, samsn, isReadRules, readRules, writeRules, blueToothInit, startAddAO, addROArea } = storeToRefs(tagsStore) // 识读电子标识的具体内容

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
const currentStep = ref(1); //当前步骤step
const blueList = ref([]); //获取蓝牙列表
// const deviceId = ref('');//蓝牙设备id
// const serviceId = ref('0000FFE0-0000-1000-8000-00805F9B34FB')
// const characteristicId = ref('0000FFE9-0000-1000-8000-00805F9B34FB'); //蓝牙write
// const characteristicId_notify = ref('0000FFE4-0000-1000-8000-00805F9B34FB'); //蓝牙notify
const BluetoothAdapter = ref(false); //是否已完成初始化蓝牙成功
const BluetoothDevicesDiscovery = ref(false);//是否已开始搜索
const BLEConnection = ref(false); //是否已连接蓝牙
const notifyBLEChar = ref(false);//是否已开启监听

//页面初始化
onLoad((opt) => {
  tipsInfo.value = {};
  secRandom.value = '';
  safeSn.value = '';
  authStatus.value = false;
  writeStatus.value = false; //私有写结果
})

onUnload(() => {
  //监听页面卸载
  console.log('监听页面卸载');
  if (BLEConnection.value) {
    uni.closeBLEConnection({
      deviceId: blueToothInit.value.deviceId,
      success (res) {
        console.log('断开蓝牙成功', res)
        setTimeout(() => {
          // 关闭蓝牙模块
          if (BluetoothAdapter.value) {
            uni.closeBluetoothAdapter({
              success (res) {
                console.log(res)
              },
            })
          }
        }, 200)
      },
      fail (err) {
        console.log('断开蓝牙失败', err)
      },
    })

    //以下三步清空读写规则的步骤，清空后需要重新下发读写规则
    isReadRules.value = true;
    readRules.value = { deleteRO: false, addRO: false, startRO: false, addAO: true };
    writeRules.value = { deleteRO: false, deleteAO: false, addRO: false, addAO: false, startRO: false }
  } else {
    if (BluetoothAdapter.value) {
      uni.closeBluetoothAdapter({
        success (res) {
          console.log(res)
        },
      })
    }
  }

})

// 查询蓝牙状态
const openBlue = () => {
  if (!BluetoothAdapter.value) {
    uni.openBluetoothAdapter({
      success (res) {
        console.log('初始化蓝牙成功')
        console.log('open', res)
        BluetoothAdapter.value = true;
        currentStep.value = 2;
        uni.showToast({
          title: '初始化蓝牙成功',
        });

        uni.onBluetoothDeviceFound(function (devices) {
          console.log('发现设备', JSON.stringify(devices))
          // showToast('发现设备',JSON.stringify(devices))
          devices.devices.forEach((item, index) => {
            if (item.name.substr(0, 2) == 'ZL' || item.name.substr(0, 7) == 'GOSUNCN') {
              blueList.value.push(devices.devices[0])
            }
          })
        })
      },
      fail (err) {
        console.log('初始化蓝牙失败')
        console.error('open', err)
        // #ifdef APP-PLUS
        // #ifdef APP-ANDROID 
        uni.showModal({
          title: '是否打开蓝牙',
          content: '',
          success: function (res) {
            if (res.confirm) {
              const main = plus.android.runtimeMainActivity()
              const Intent = plus.android.importClass('android.content.Intent')
              const mIntent = new Intent('android.settings.BLUETOOTH_SETTINGS')
              main.startActivity(mIntent)
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          },
        })
        // #endif

        //#else
        uni.showModal({
          title: '请先启用蓝牙',
          showCancel: false,
          content: '',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          },
        })
        // #endif
      },
    })
  } else {
    currentStep.value = 2;
  }
}

// 搜索蓝牙
const searchBlue = () => {
  uni.startBluetoothDevicesDiscovery({
    // services: ['-0000-1000-8000-00805F9B34FB'],
    allowDuplicatesKey: false,
    interval: 0,
    success: (res) => {
      BluetoothDevicesDiscovery.value = true;//设置搜索状态
      console.log('执行搜索成功的回调')
    },
    fail: (error) => {
      console.log(error)
    },
  })
}

// 连接蓝牙
const connectBlue = (item) => {
  if (BLEConnection.value) {
    uni.showToast({
      title: '当前已连接~~~',
      icon: 'error'
    });
    return;
  }
  uni.showLoading({
    title: '设备连接中~~~',
    mask: true
  });
  uni.stopBluetoothDevicesDiscovery({
    success (res) {
      BluetoothDevicesDiscovery.value = false;
      console.log('停止搜索', res)
    },
  })

  //设置长时间未连接成功报失败
  const _timer = setTimeout(function () {
    if (!BLEConnection.value) {
      uni.hideLoading();
      setTimeout(function () {
        uni.showToast({
          title: '连接超时',
          icon: 'error'
        });
      }, 200)
    }
  }, 10000)

  uni.createBLEConnection({
    deviceId: item.deviceId,
    success (res) {
      console.log('蓝牙已连接', res)

      setTimeout(function () {
        item.active = true; //设置连接成功样式
        BLEConnection.value = true;//设置连接成功状态

        //if (!blueToothDevices.value.includes(item.deviceId)) {//存储的已连接过的蓝牙设备id是否包含当前设备id是否一致，包含则不需要重复启动蓝牙监听(readBlueOn)
        if (!isOpenOnBlue.value) { //本次打开应用还没有开启监听 uni.onBLECharacteristicValueChange还没有开启
          notifyBLEChar.value = false; //未连接过蓝牙需要开启监听 
        } else {
          blueToothInit.value.deviceId = item.deviceId;
          notifyBLEChar.value = true; //已连接过蓝牙不需要重新开启监听
        }

        // #ifdef APP-PLUS
        //app 端
        readBlueOn(item.deviceId);//启动蓝牙监听
        // #endif

        // #ifdef MP-WEIXIN
        //微信小程序IOS必须getBLEDeviceServices和getBLEDeviceCharacteristics
        uni.getBLEDeviceServices({
          // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
          deviceId: item.deviceId,
          success (res) {
            uni.getBLEDeviceCharacteristics({
              // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
              deviceId: item.deviceId,
              // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
              serviceId: blueToothInit.value.serviceId,
              success (res) {
                readBlueOn(item.deviceId);//启动蓝牙监听
              },
              fail (res) {
                console.log('获取特征值失败', res)
              },
            })

          },
          fail (res) {
            console.log('获取service失败', res)
          },
        })
        // #endif



      }, 1000)

      // uni.onBLEConnectionStateChange(function (res) {
      //   // 监听蓝牙连接状态的改变事件
      //   console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
      // })
    },
    fail (err) {
      console.log('蓝牙连接失败', err);
      clearTimeout(_timer); //关闭10000连接超时
      uni.hideLoading();
      setTimeout(function () {
        uni.showToast({
          title: '连接失败',
          icon: 'error'
        });
      }, 200)
    }
  })
}

// 读取监听
const readBlueOn = (params) => {
  if (notifyBLEChar.value) {
    console.log(222222);

    // 必须在这里的回调才能获取  uni.notifyBLECharacteristicValueChange 必须单独开启
    uni.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
      deviceId: params,
      // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
      serviceId: blueToothInit.value.serviceId ? blueToothInit.value.serviceId : '0000FFE0-0000-1000-8000-00805F9B34FB',
      // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
      characteristicId: blueToothInit.value.characteristicId_notify ? blueToothInit.value.characteristicId_notify : '0000FFE4-0000-1000-8000-00805F9B34FB',
      success (res) {
        console.log('启用 notify 功能', res)
      },
      fail (res) {
        console.log(res)
      },
    })
    uni.hideLoading();
    setTimeout(function () {
      uni.showToast({
        title: '蓝牙已连接',
      });
    }, 200)
    return;
  }
  console.log(333333);
  console.log('params:' + params);

  console.log('serviceId:', blueToothInit.value.serviceId);
  console.log('characteristicId_notify:' + blueToothInit.value.characteristicId_notify);


  uni.notifyBLECharacteristicValueChange({
    state: true, // 启用 notify 功能
    // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
    deviceId: params,
    // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
    serviceId: blueToothInit.value.serviceId ? blueToothInit.value.serviceId : '0000FFE0-0000-1000-8000-00805F9B34FB',
    // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
    characteristicId: blueToothInit.value.characteristicId_notify ? blueToothInit.value.characteristicId_notify : '0000FFE4-0000-1000-8000-00805F9B34FB',
    success (res) {
      console.log('启用 notify 功能', res)
      notifyBLEChar.value = true;
      blueToothInit.value.deviceId = params;
      // blueToothDevices.value.push(params);
      isOpenOnBlue.value = true;//已开启蓝牙监听，不需要重复开启

      uni.hideLoading();
      setTimeout(function () {
        uni.showToast({
          title: '蓝牙已连接',
        });
      }, 200)

      // 必须在这里的回调才能获取
      uni.onBLECharacteristicValueChange(function (res) {
        const receiveValue = ab2hex(res.value) // 2进制数据转为16进制字符串
        console.log('蓝牙返回数据为：', receiveValue)
        var buffer = new Uint8Array(res.value)

        let result = dealRecvData(buffer, 0, buffer.length)
        if (!result) return;
        console.log('result:' + result);
        if (isReadRules.value) {//当前读取规则
          //读规则步骤  1删除RO-403 2添加RO-401 3启动RO-405
          if (result == '403') {
            console.log('--------read 已完成删除RO 开始删除AO或添加RO-------', '403');
            if (readRules.value.addAO) {  //在写的时后已addAO，读时需要先删除AO，不然设备会滴两声
              console.log('--------read 已添加过AO 需要先执行删除AO-------', '403');
              sendCmd(deleteAccessSpec); //删除AO
            } else {
              console.log('--------read 未添加过AO 直接执行添加RO-------', '403');

              //没有执行过addAO 直接添加RO
              if (addROArea.value == 'user1') {
                addUserSelectSpec(1, 4, 9);
              } else {
                addUserSelectSpec(0, 4, 10);
              }
            }
            readRules.value.deleteRO = true;
            writeRules.value.deleteRO = true;// 同时修改写写入删除RO为true,删除RO不需要重复执行
          } else if (result == '453') {
            console.log('--------read 已完成删除AO 开始执行添加RO或者启动RO-------', '453');
            if (readRules.value.addRO) {
              console.log('--------read 已添加过RO 直接执行启动RO-------', '453');
              sendCmd(startSelectSpec); //启动RO应答
            } else {
              console.log('--------read 未添加过RO 先执行添加RO-------', '453');

              console.log('addROArea', addROArea.value);
              //删除AO后执行添加RO
              if (addROArea.value == 'user1') {
                console.log('1,4,9');
                addUserSelectSpec(1, 4, 9);
              } else {
                console.log('0,4,10');
                addUserSelectSpec(0, 4, 10);
              }
            }
            readRules.value.addAO = false;
          } else if (result == '401') {
            console.log('-------已完成添加RO 开始执行启动RO-------', '401');
            sendCmd(startSelectSpec); //启动RO应答
            readRules.value.addRO = true;
            writeRules.value.addRO = true;// 同时修改写写入添加RO为true,添加RO不需要重复执行
          } else if (result == '405') {
            console.log('--------已完成启动RO End-------');
            readRules.value.startRO = true;
          }
        } else { //isReadRules==false 当前为写入规则
          //写规则步骤  1删除RO-403 2删除AO-453 3添加RO-401 4添加AO-451 5启动RO-405
          //const writeRules = ref({ deleteRO: false, deleteAO: false, addRO: false, addAO: false, startRO: false });
          if (result == '403') {
            console.log('--------完成删除RO 开始删除AO-------', '403');
            sendCmd(deleteAccessSpec); //删除AO
            writeRules.value.deleteRO = true;
          } else if (result == '453') {
            writeRules.value.deleteAO = true;
            console.log('--------完成删除AO 开始添加RO或者添加AO------', '453');
            if (writeRules.value.addRO) { //表示已添加过RO 可直接添加AO
              console.log('--------已添加过RO 直接添加AO------');
              startAddAO.value = true; //在form.vue中监听到startAddAO为true时，会调用addRO方法
            } else {
              console.log('--------未添加过RO 需要先添加RO------');

              //添加RO
              if (addROArea.value == 'user1') {
                addUserSelectSpec(1, 4, 9);
              } else {
                addUserSelectSpec(0, 4, 10);
              }
            }
          } else if (result == '401') {
            console.log('--------完成添加RO 开始添加AO-------', '401');

            startAddAO.value = true;//在form.vue中监听到startAddAO为true时，会调用addRO方法

            writeRules.value.addRO = true;
          } else if (result == '451') {
            console.log('--------完成添加AO 开始启动RO-------', '451');
            sendCmd(startSelectSpec); //启动RO应答
            writeRules.value.addAO = true;
            readRules.value.addAO = true; //此处需要打开read 的addAO，因为再次执行读时，需要先执行删除AO

          } else if (result == '405') {
            console.log('--------已启动写入RO应答End-------');
            writeRules.value.startRO = true;
          }
        }

        if (result == 500) {  //标签上报
          if (!isReadRules.value) {
            console.log('-------执行write后500-------');
            if (writeStatus.value) {  //表示私有写成功
              uni.hideLoading();
              setTimeout(function () {
                uni.showToast({ title: '写入成功', icon: 'success' });
                // currentStep.value = 3;
              }, 100)
            } else {
              closeLoad('写入失败');
            }
            return;
          }
          tagsInfo.value = tipsInfo.value; //接收到RO结束事件
          if (Object.keys(tagsInfo.value).length > 0) {
            clearTimeout(_inventTime); //清除定时器读卡长时间未响应失败10000ms
            uni.showToast({
              title: '读卡成功',
              icon: 'success'
            });
            uni.navigateTo({
              url: '/pagesFn/electronicsTag/form'
            })
          } else {
            clearTimeout(_inventTime);//清除定时器读卡长时间未响应失败10000ms
            uni.showToast({
              title: '读卡失败',
              icon: 'error'
            });
          }
        }



      })
    },
    fail (res) {
      console.log(res)
    },
  })
}

//步骤切换
const nextStep = (obj) => {
  console.log(obj);

  if (obj == 1) {
    currentStep.value = 1;
  }
  if (obj == 2) {
    if (BluetoothAdapter.value) {
      currentStep.value = 2;
    }
  }
  if (obj == 3) {
    if (BluetoothAdapter.value && BLEConnection.value && notifyBLEChar.value) {
      sendCmd(secSNQuery.value);// 获取安全模块序列号
      uni.showLoading({
        title: '双向认证确认中~~~',
        mask: true
      })

      setTimeout(function () {
        console.log('序列号2：' + safeSn.value);
        if (safeSn.value) {  //已获取到安全模块序列号
          samsn.value = safeSn.value; //缓存安全模块序列号
          uni.hideLoading();
          setTimeout(function () {
            uni.showToast({ title: '双向认证成功', icon: 'success' });
            currentStep.value = 3;
          }, 100)
        } else {
          closeLoad('双向认证失败！');
        }
      }, 500)
    }
  }
  if (obj == 4) {

  }
}

//返回第三步
const goBack = () => {
  currentStep.value = 3;
}


//激活电子标签
const goActive = (area) => {
  console.log('原区域', addROArea.value);
  console.log('当前切换区域', area);
  if (addROArea.value != area) {  //切换第一次激活标签和读取标签
    readRules.value = { deleteRO: false, addRO: false, startRO: false, addAO: true };
    writeRules.value = { deleteRO: false, deleteAO: false, addRO: false, addAO: false, startRO: false }
  }
  addROArea.value = area;
  currentStep.value = 4;
}


//删除RO规则
const deleteSelectSpec = [0x7e, 0x00, 0x00, 0xaa, 0xbb, 0xcc, 0xdd, 0x11, 0x22, 0x33, 0x44, 0x01, 0x01, 0x92, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0xce, 0x00, 0x00, 0x00, 0x00, 0xab, 0x00, 0x7e];
//启动RO规则
const startSelectSpec = [0x7e, 0x00, 0x00, 0xaa, 0xbb, 0xcc, 0xdd, 0x11, 0x22, 0x33, 0x44,
  0x01, 0x01, 0x94, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0xd0, 0x00, 0x00, 0x00, 0x01, 0xff, 0xb8, 0x7e];

//删除AO规则
const deleteAccessSpec = [0x7e, 0x00, 0x00, 0xaa, 0xbb, 0xcc, 0xdd, 0x11, 0x22, 0x33, 0x44,
  0x01, 0x01, 0xc4, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0xcd, 0x00, 0x00, 0x00, 0x00, 0x86, 0xdd, 0x7e];

//获取安全模块序列号
const secSNQuery = ref([0x7e, 0x00, 0x00, 0xaa, 0xbb, 0xcc, 0xdd, 0x11, 0x22, 0x33, 0x44, 0x01, 0x02, 0x94, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x69, 0x0c, 0x00, 0xef, 0x86, 0x7e]);

//标签识读
let _inventTime;
const inventRead = () => {
  // currentStatus.value = 0; //当前状态 读取电子标签需要三步
  isReadRules.value = true;//当前状态 读取电子标签需要三步
  tipsInfo.value = {}; //清空ts响应
  tagsInfo.value = {}; //清空store 存储
  console.log(readRules.value);
  if (!readRules.value.deleteRO) {
    sendCmd(deleteSelectSpec); //删除RO应答
  } else if (readRules.value.deleteRO && readRules.value.addAO) {
    //因为执行write写时，添加过AO，需要先删除
    console.log('-------执行write写时,添加过AO,需要先删除AO--------', 'deleteAO');
    sendCmd(deleteAccessSpec); //删除AO
  } else if (readRules.value.deleteRO && !readRules.value.addRO) {
    console.log('--------添加RO应答Start-------', 'add');
    if (addROArea.value == 'user1') {
      addUserSelectSpec(1, 4, 9);
    } else {
      addUserSelectSpec(0, 4, 10);
    }

  } else {
    console.log('--------启动RO应答Start-------', 'add');
    sendCmd(startSelectSpec); //启动RO应答
  }

  _inventTime = setTimeout(function () {
    if (Object.keys(tagsInfo.value).length === 0) {
      uni.hideLoading();
      setTimeout(function () {
        uni.showToast({
          title: '读卡失败',
          icon: 'error'
        });
      })
    }
  }, 5000)
}

//读写数据
const goForm = () => {
  uni.showLoading({
    title: '正在读取电子标签~~~',
    mask: true
  })

  inventRead();//读取电子标签
  // uni.navigateTo({
  //   url: '/pagesFn/electronicsTag/form'
  // })
}

//设备双向认证
const goAuth = () => {
  console.log('随机数secRandom' + secRandom.value);
  uni.showLoading({
    title: '正在进行设备双向认证~~~',
    mask: true
  })
  readRandom();//获取安全模块随机数

  setTimeout(function () {
    if (secRandom.value) {  //已获取到安全模块随机数
      console.log('随机数0:' + secRandom.value);
      sendCmd(secSNQuery.value);// 获取安全模块序列号

      setTimeout(function () {
        console.log('序列号1：' + safeSn.value);
        if (safeSn.value) {  //已获取到安全模块序列号

          auth({ step: 1, data: secRandom.value, samsn: safeSn.value }).then((res) => {
            console.log(res);
            if (res.code == 0) {
              let byteArray = hexStringToByteArray(res.message);
              getDeviceSecConfig(byteArray);

              setTimeout(function () {
                if (!authStatus.value) {  ////双向认证状态 true 为成功
                  closeLoad('双向认证失败-3');
                } else {
                  uni.hideLoading();
                  setTimeout(function () {
                    uni.showToast({ title: '双向认证成功', icon: 'success' });
                  }, 100)
                }
              }, 10000)
            } else if (res.code == '-93') {
              closeLoad('安全模块未备案');
            } else {
              closeLoad('双向认证失败-4');
            }
          })
        } else {
          closeLoad('双向认证失败-2');
        }
      }, 1000)

    } else {
      closeLoad('双向认证失败-1');
    }
  }, 1000)
}

//字符串转十六进制数组
const hexStringToByteArray = (hexString) => {
  let byteArray = [];
  for (let i = 0; i < hexString.length; i += 2) {
    let byte = parseInt(hexString.substr(i, 2), 16);
    byteArray.push(byte);
  }
  var sdata = ab2hex(byteArray);
  console.log('十六进制：' + sdata);
  return byteArray;
}

//关闭加载loading
const closeLoad = (title) => {
  uni.hideLoading();
  setTimeout(function () {
    uni.showToast({ title: title, icon: 'error' });
  }, 100)
}

</script>

<style lang="scss" scoped>
.disBox {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;

  .boxFlex {
    display: block;
    flex-grow: 1;
    /*决定如何分配剩余空间*/
    flex-shrink: 1;
    /*项目自动缩小*/
  }
}

.columnDisBox {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  height: 100vh;
  background-color: #F7F7FC;

  .columnBoxFlex {
    display: block;
    flex: 1;
    height: 100%;
    overflow-y: auto;
  }
}

.container {
  .tips_tit {
    padding: 36rpx 29rpx 0rpx;

    .notice_box {
      padding: 42rpx 0 40rpx;
      background-color: #ffffff;
      border-radius: 9rpx;
      box-shadow: 0rpx 4rpx 7rpx 2rpx rgba(0, 0, 0, 0.16);

      .notice_item {
        justify-content: flex-start;

        &.active {
          .notice_index {
            color: #ffffff;
            background-color: #4099FF;
          }

          .notice_title {
            color: #4099FF;
          }
        }
      }

      .notice_index {
        display: inline-block;
        width: 34rpx;
        height: 34rpx;
        margin-left: 12rpx;
        font-size: 22rpx;
        line-height: 34rpx;
        color: #9B9B9B;
        text-align: center;
        background-color: #E6E6E6;
        border-radius: 100px;
      }

      .notice_title {
        margin-left: 7rpx;
        font-size: 25rpx;
        color: #9B9B9B;
      }

      .notice_img {
        width: 13rpx;
        height: 22rpx;
        margin-left: 27rpx;
      }
    }
  }

  .blue_main {
    .btn {
      height: 72rpx;
      font-size: 32rpx;
      line-height: 72rpx;
      color: #FFFFFF;
      text-align: center;
      background-color: #4099FF;
      border-radius: 14rpx;

      &.search_btn {
        margin-bottom: 20rpx;
        color: #4099FF;
        background-color: #fff;
        border: 1px solid #4099FF;
      }
    }

  }

  .blue_main1 {
    padding-top: 96rpx;

    .connect_icon {
      display: block;
      width: 590rpx;
      height: 522rpx;
      margin: 0px auto;
    }

    .next_step {
      width: 590rpx;
      padding: 30rpx 0;
      margin: 0px auto;
      margin-bottom: 158rpx;
      font-size: 25rpx;
      font-weight: bold;
      color: #000;
      text-align: center;
      background-color: #E4EEFC;
      border-radius: 14rpx;
    }

    .open_blue {
      padding: 0 60rpx;
    }
  }

  .blue_main2 {
    padding: 68rpx 29rpx 0;

    .connect_icon {
      display: block;
      width: 615rpx;
      height: 454rpx;
      margin: 0px auto;
    }

    .blue_list {
      margin-bottom: 63rpx;
      background-color: #FFFFFF;
      border-radius: 9rpx;
      box-shadow: 0rpx 4rpx 7rpx 2rpx rgba(0, 0, 0, 0.16);

      .disBox {
        padding: 21rpx 30rpx 20rpx;

        .blue_title {
          font-size: 25rpx;
          color: #9B9B9B;
        }

        .connect_btn {
          width: 121rpx;
          height: 58rpx;
          padding: 0;
          font-size: 33rpx;
          line-height: 58rpx;
          color: #FFFFFF;
          text-align: center;
          background-color: #4099FF;
          border: 0;
        }

        &.active {
          background-color: #4099FF;
          border-radius: 14rpx;

          .connect_btn {
            color: #4099FF;
            background-color: #fff;
          }

          .blue_title {
            color: #ffffff;
          }
        }
      }
    }

    .open_blue {
      padding: 0 30rpx;
    }
  }

  .blue_main3 {
    .connect_icon {
      width: 628rpx;
      height: 450rpx;
    }

    .next_step {
      width: 628rpx;
    }
  }

  .blue_main4 {
    padding-top: 67rpx;

    .connect_icon {
      width: 533rpx;
      height: 478rpx;
    }

    .next_step {
      width: 533rpx;
      margin-bottom: 200rpx;
    }
  }

  .blue_main5 {
    .next_step {
      margin-bottom: 30rpx;
    }

    .contact_btn {
      margin-bottom: 132rpx;
      font-size: 25rpx;
      color: #4099FF;
      text-align: center;

      text {
        text-decoration: underline;
      }
    }
  }
}
</style>
