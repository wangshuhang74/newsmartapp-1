<!-- 电子标识 -->
<template>
	<wd-toast></wd-toast>
	<view class="columnDisBox">
		<navbar :title="'汽车电子标识卡号'" />
		<view class="container columnBoxFlex">
			<view class="view_main">
				<view class="view_tit disBox">电子标识信息</view>
				<view class="view_con">
					<view class="view_rows">
						<view class="disBox">
							<text>汽车电子标识卡号</text>
							<input type="text" class="boxFlex" v-model="tagsInfo.CID" placeholder="自识别" disabled />
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>电子标识安全芯片ID</text>
							<input type="text" class="boxFlex" v-model="tagsInfo.TID" placeholder="自识别" disabled />
						</view>
					</view>
				</view>

				<view class="view_tit disBox">汽车行驶记录仪信息</view>
				<view class="view_con">
					<view class="view_rows">
						<view class="disBox">
							<text>行驶记录仪编号</text>
							<input type="text" class="boxFlex" v-if="!isTagsInfo" v-model="postForm.U1JLYBH" @input="inputChange"
								placeholder="自识别" />
							<input type="text" class="boxFlex" v-else v-model="postForm.U1JLYBH" placeholder="自识别"
								:disabled="isTagsInfo" />
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>行驶记录仪安全芯片ID</text>
							<input type="text" class="boxFlex" v-model="postForm.U1AQXPID" placeholder="自识别" :disabled="isTagsInfo" />
						</view>
					</view>
				</view>

				<view class=" view_tit disBox">车辆信息
				</view>
				<view class="view_con">
					<view class="view_rows">
						<view class="disBox">
							<text>号牌种类</text>
							<wd-picker :columns="carTypeList" label="" v-model="binary.HMZL_binary"
								placeholder="自识别/请输入" /><!--@confirm="handleConfirm"-->
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>省份代码</text>
							<!-- <input type="text" class="boxFlex" v-model="postForm.SFDM" placeholder="请选择" readonly
								 /> -->
							<view class="boxFlex" @tap="openProvince">{{ postForm.U1SFDM ? postForm.U1SFDM : '请选择' }}</view>
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>车牌号码</text>
							<input type="text" class="boxFlex" v-model="postForm.U1HPHMXH" placeholder="自识别/请输入" />
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>发牌代号</text>
							<!-- <input type="text" class="boxFlex" v-model="postForm.FPDH" placeholder="自识别/请输入" /> -->
							<view class="boxFlex" @tap="openFPDH">{{ postForm.U1FPDH ? postForm.U1FPDH : '请选择' }}</view>
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>VIN码</text>
							<input type="text" class="boxFlex" v-model="postForm.vinCode" placeholder="自识别/请输入" />
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>使用性质</text>
							<input type="text" class="boxFlex" v-model="postForm.useType" placeholder="自识别/请输入" />
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>出厂日期</text>
							<wd-calendar use-default-slot v-model="CCRQ_DATE"> <!-- @confirm="handleConfirm"-->
								<input type="text" class="boxFlex" v-model="postForm.productDate" placeholder="自识别/请输入" disabled />
							</wd-calendar>
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>车辆类型</text>
							<input type="text" class="boxFlex" v-model="postForm.carType" placeholder="自识别/请选择" />
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>检验有效期</text>
							<input type="text" class="boxFlex" v-model="postForm.validDate" placeholder="自识别/请输入" />
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>强制报废期</text>
							<input type="text" class="boxFlex" v-model="postForm.scrapDate" placeholder="自识别/请输入" />
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>质量核载</text>
							<input type="text" class="boxFlex" v-model="postForm.loadNum" placeholder="自识别/请输入" />
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>车身颜色</text>
							<input type="text" class="boxFlex" v-model="postForm.carColor" placeholder="自识别/请输入" />
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>排量</text>
							<input type="text" class="boxFlex" v-model="postForm.displaceNum" placeholder="自识别/请输入" />
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>功率</text>
							<input type="text" class="boxFlex" v-model="postForm.powerNum" placeholder="自识别/请输入" />
						</view>
					</view>
				</view>

				<view class="form_btn">
					<button type="default" @tap="confirm">完成</button>
				</view>

			</view>
		</view>
	</view>

	<!--SFDM-->
	<keyboard v-if="showKeyboard" :keyList="keyList" @keyClick="keyClick" @confirm="SFDMConfirm"></keyboard>

	<!--FPDM-->
	<keyboard v-if="showKeyboard2" :keyList="keyList2" @keyClick="keyClick" @confirm="FPDHConfirm"></keyboard>

</template>

<script setup>
import { dayjs } from "wot-design-uni"; // ui组件库
import navbar from '@/pages/components/navbar.vue'
import keyboard from '@/pages/components/keyboard.vue'
import { sendCmd, addPrivateWriteAOSpec, ab2hex, writeStatus } from "../../utils/bluetooth";
import { analysisCarNumber, analysisJlyCID, addZeroBefore, binaryToHexArray } from '@/utils/message'
import { storeToRefs } from 'pinia'
import { useTagsStore } from '@/store'
const tagsStore = useTagsStore()
const { tagsInfo, samsn, isReadRules, readRules, writeRules, startAddAO } = storeToRefs(tagsStore) // 识读电子标识的具体内容
import { writeData, getBySerial, update } from '../../api/index'

const showKeyboard = ref(false);
const showKeyboard2 = ref(false);
const isTagsInfo = ref(false);//数据是否是通过读卡获取的
const CCRQ_DATE = ref();//出厂日期
CCRQ_DATE.value = new Date('2024-06-25 00:00:00').getTime();
console.log(Date.now());
console.log(CCRQ_DATE.value);

console.log('tagsInfo', tagsInfo.value);

const keyClick = (e) => {
	showKeyboard.value = e;
	showKeyboard2.value = e;
}

//获取设备唯一标识
let deviceRes = uni.getDeviceInfo();
console.log('获取设备唯一标识', deviceRes.deviceId);

const postForm = ref({
	// CID: '', //电子标签卡号
	// TID: '',//电子标签安全芯片id
	U1JLYBH: '', //行驶记录仪编号
	U1AQXPID: '',//行驶记录仪安全芯片ID
	U1HPZL: '',//号牌种类
	U1SFDM: '',  //省份代码
	U1HPHMXH: '',//车牌号码
	U1FPDH: '', //发牌代号
	vinCode: '', //VIN码
	useType: '',  //使用性质
	productDate: '', //出厂日期
	carType: '',  //车辆类型
	validDate: '', //检验有效期
	scrapDate: '', //强制报废期
	loadNum: '', //质量核载
	carColor: '', //车身颜色
	displaceNum: '', //排量
	powerNum: '', //功率
})
onMounted(() => {
	if (tagsInfo.value.U1JLYBH) { //行车记录仪编号
		isTagsInfo.value = true;
		dataInit(tagsInfo.value.U1JLYBH);
	}
})


//号牌种类
const carTypeList = ref([{ label: '大型汽车', value: '0001' }, { label: '小型汽车', value: '0010' }, { label: '使馆汽车', value: '0011' }, { label: '领馆汽车', value: '0100' }, { label: '境外汽车', value: '0101' }, { label: '外籍汽车', value: '0110' }, { label: '低速车', value: '0111' }, { label: '教练汽车', value: '1000' }, { label: '摩托车', value: '1001' }, { label: '新能源汽车', value: '1010' }, { label: '警用汽车', value: '1011' }, { label: '港澳两地车', value: '1100' }, { label: '武警车辆', value: '1101' }, { label: '军队车辆', value: '1110' }, { label: '其他车辆', value: '0000' }]);

//需要二进制编码的值
const binary = ref({
	'PlateLicense_binary': '',//车牌号码 33
	'SFDM_binary': '', //省份代码  6
	'FPDH_binary': '', //发牌代号  5
	'HMZL_binary': '',//车辆类型', 4
	'jlyID_binary': '',//记录仪安全芯片ID  33
	'jlyCID_binary': '',//行驶记录仪编号 53
});

//初始化数据
const dataInit = (obj) => {
	getBySerial(obj).then((res) => {
		if (res.code == 0) {
			console.log(res);
			binary.value.HMZL_binary = '';
			if (isTagsInfo.value) {  //表示已经是通过读卡获取的数据
				postForm.value.U1JLYBH = tagsInfo.value.U1JLYBH;
				postForm.value.U1AQXPID = tagsInfo.value.U1AQXPID;
				postForm.value.U1HPZL = tagsInfo.value.U1HPZL;
				postForm.value.U1SFDM = tagsInfo.value.U1SFDM;
				postForm.value.U1HPHMXH = tagsInfo.value.U1HPHMXH;
				postForm.value.U1FPDH = tagsInfo.value.U1FPDH;
			} else {
				postForm.value.U1AQXPID = res.data.tpmId;
				postForm.value.U1HPZL = res.data.carCardType;
				postForm.value.U1SFDM = res.data.provinceCode;
				postForm.value.U1HPHMXH = res.data.carPlateShort;
				postForm.value.U1FPDH = res.data.licenseCode;
			}
			postForm.value.vinCode = res.data.vinCode;
			postForm.value.useType = res.data.useType;
			postForm.value.productDate = res.data.productDate;
			postForm.value.carType = res.data.carType;
			postForm.value.validDate = res.data.validDate;
			postForm.value.scrapDate = res.data.scrapDate;
			postForm.value.loadNum = res.data.loadNum;
			postForm.value.carColor = res.data.carColor;
			postForm.value.displaceNum = res.data.displaceNum;
			postForm.value.powerNum = res.data.powerNum;

			//因为获取的是'大型汽车'，需要转value=0001
			if (postForm.value.U1HPZL) {  //U1HPZL 存在 U1HPZL=label'大型汽'
				let temp_HMZL = carTypeList.value.find(item => {
					return item.label == postForm.value.U1HPZL;
				})
				binary.value.HMZL_binary = temp_HMZL.value;
				console.log(temp_HMZL.value);
			}
		}
	})
}

//行车记录仪编号
const inputChange = (e) => {
	console.log(e.detail.value);
	dataInit(e.detail.value);
}

let writeDataArr = []; //需要写入设备的十六进制数组

const keyList = ref([
	[{ name: '京', value: '000001' }, { name: '津', value: '000010' }, { name: '冀', value: '000011' }, { name: '晋', value: '000100' }, { name: '蒙', value: '000101' }, { name: '辽', value: '000110' }, { name: '吉', value: '000111' }, { name: '黑', value: '001000' }, { name: '沪', value: '001001' }],
	[{ name: '苏', value: '001010' }, { name: '浙', value: '001011' }, { name: '皖', value: '001100' }, { name: '闽', value: '001101' }, { name: '赣', value: '001110' }, { name: '鲁', value: '001111' }, { name: '豫', value: '010000' }, { name: '鄂', value: '010001' }, { name: '湘', value: '010010' }],
	[{ name: '粤', value: '010011' }, { name: '桂', value: '010100' }, { name: '琼', value: '010101' }, { name: '渝', value: '010110' }, { name: '川', value: '010111' }, { name: '贵', value: '011000' }, { name: '云', value: '011001' }, { name: '藏', value: '011010' }],
	[{ name: '陕', value: '011011' }, { name: '甘', value: '011100' }, { name: '青', value: '011101' }, { name: '宁', value: '011110' }, { name: '新', value: '011111' }, { name: '港', value: '100000' }, { name: '澳', value: '100001' }]
]);
//SFDM结果编码
const keyListArr = [
	{ name: '京', value: '000001' }, { name: '津', value: '000010' }, { name: '冀', value: '000011' }, { name: '晋', value: '000100' }, { name: '蒙', value: '000101' }, { name: '辽', value: '000110' }, { name: '吉', value: '000111' }, { name: '黑', value: '001000' }, { name: '沪', value: '001001' },
	{ name: '苏', value: '001010' }, { name: '浙', value: '001011' }, { name: '皖', value: '001100' }, { name: '闽', value: '001101' }, { name: '赣', value: '001110' }, { name: '鲁', value: '001111' }, { name: '豫', value: '010000' }, { name: '鄂', value: '010001' }, { name: '湘', value: '010010' },
	{ name: '粤', value: '010011' }, { name: '桂', value: '010100' }, { name: '琼', value: '010101' }, { name: '渝', value: '010110' }, { name: '川', value: '010111' }, { name: '贵', value: '011000' }, { name: '云', value: '011001' }, { name: '藏', value: '011010' },
	{ name: '陕', value: '011011' }, { name: '甘', value: '011100' }, { name: '青', value: '011101' }, { name: '宁', value: '011110' }, { name: '新', value: '011111' }, { name: '港', value: '100000' }, { name: '澳', value: '100001' }
];
//打开SFDM
const openProvince = () => {
	showKeyboard.value = true;
}
const SFDMConfirm = (e) => {
	console.log(e);
	postForm.value.U1SFDM = e.name;
	binary.value.SFDM_binary = e.value;
}

const keyList2 = ref([
	[{ name: 'A', value: '00000' }, { name: 'B', value: '00001' }, { name: 'C', value: '00010' }, { name: 'D', value: '00011' }, { name: 'E', value: '00100' }, { name: 'F', value: '00101' }, { name: 'G', value: '00110' }, { name: 'H', value: '00111' }, { name: 'I', value: '01000' }],
	[{ name: 'J', value: '01001' }, { name: 'K', value: '01010' }, { name: 'L', value: '01011' }, { name: 'M', value: '01100' }, { name: 'N', value: '01101' }, { name: 'O', value: '01110' }, { name: 'P', value: '01111' }, { name: 'Q', value: '10000' }, { name: 'R', value: '10001' }],
	[{ name: 'S', value: '10010' }, { name: 'T', value: '10011' }, { name: 'U', value: '10100' }, { name: 'V', value: '10101' }, { name: 'W', value: '10110' }, { name: 'X', value: '10111' }, { name: 'Y', value: '11000' }, { name: 'Z', value: '11001' }],
]);
//FPDH结果编码
const keyListArr2 = [
	{ name: 'A', value: '00000' }, { name: 'B', value: '00001' }, { name: 'C', value: '00010' }, { name: 'D', value: '00011' }, { name: 'E', value: '00100' }, { name: 'F', value: '00101' }, { name: 'G', value: '00110' }, { name: 'H', value: '00111' }, { name: 'I', value: '01000' },
	{ name: 'J', value: '01001' }, { name: 'K', value: '01010' }, { name: 'L', value: '01011' }, { name: 'M', value: '01100' }, { name: 'N', value: '01101' }, { name: 'O', value: '01110' }, { name: 'P', value: '01111' }, { name: 'Q', value: '10000' }, { name: 'R', value: '10001' },
	{ name: 'S', value: '10010' }, { name: 'T', value: '10011' }, { name: 'U', value: '10100' }, { name: 'V', value: '10101' }, { name: 'W', value: '10110' }, { name: 'X', value: '10111' }, { name: 'Y', value: '11000' }, { name: 'Z', value: '11001' },
];
//打开FPDH
const openFPDH = () => {
	showKeyboard2.value = true;
}
const FPDHConfirm = (e) => {
	postForm.value.U1FPDH = e.name;
	binary.value.FPDH_binary = e.value;
}

let writeTimeout = null;
//提交写入信息
const confirm = () => {
	console.log(JSON.stringify(postForm.value));
	writeStatus.value = false;//初始化私有写状态
	if (postForm.value.U1HPHMXH) {  //车牌号码
		let HPHMXH = postForm.value.U1HPHMXH.toUpperCase();
		binary.value.PlateLicense_binary = analysisCarNumber(HPHMXH);
		console.log('车牌号码' + binary.value.PlateLicense_binary);
	} else {
		openToast('请输入车牌号码');
		return;
	}


	if (postForm.value.U1SFDM) {  //省份代码
		keyListArr.find(item => {
			if (item.name == postForm.value.U1SFDM) {
				binary.value.SFDM_binary = item.value;
				return;
			}
		})
		console.log('省份代码' + binary.value.SFDM_binary);
	} else {
		openToast('请选择省份代码');
		return;
	}

	if (postForm.value.U1FPDH) {  //发牌代号
		keyListArr2.find(item => {
			if (item.name == postForm.value.U1FPDH) {
				binary.value.FPDH_binary = item.value;
				return;
			}
		})
		console.log('发牌代号' + binary.value.FPDH_binary);
	} else {
		openToast('请选择发牌代号');
		return;
	}

	console.log('车辆类型' + binary.value.HMZL_binary);
	if (!binary.value.HMZL_binary) {
		openToast('请选择车辆类型');
		return;
	}

	if (postForm.value.U1AQXPID) {  //行驶记录仪行驶记录仪安全芯片ID 33位
		console.log('行驶记录仪安全芯片ID' + postForm.value.U1AQXPID);
		let jlyID = parseInt(postForm.value.U1AQXPID, 10).toString(2);
		if (jlyID.length < 33) {
			jlyID = addZeroBefore(jlyID, 33);
		}
		binary.value.jlyID_binary = jlyID;
		console.log('安全芯片' + binary.value.jlyID_binary);
	} else {
		openToast('请输入行车记录仪安全芯片ID');
		return;
	}

	if (postForm.value.U1JLYBH) {  //行驶记录仪编号53位
		let jlyCID = postForm.value.U1JLYBH.toUpperCase();
		jlyCID = analysisJlyCID(jlyCID);
		binary.value.jlyCID_binary = jlyCID
		console.log('行驶记录仪编号' + binary.value.jlyCID_binary);
	} else {
		openToast('请输入行车记录仪编号');
		return;
	}

	let binaryDataStr = binary.value.PlateLicense_binary + '' + binary.value.SFDM_binary + '' + binary.value.FPDH_binary + '' + binary.value.HMZL_binary + '' + binary.value.jlyID_binary + '' + binary.value.jlyCID_binary + '000';
	console.log(binaryDataStr);

	let hexStr = binaryToHexArray(binaryDataStr);
	console.log(hexStr);
	let tid = tagsInfo.value.TID.toUpperCase();
	writeData({ tid: tid, data1: hexStr, data2: '', samsn: samsn.value }).then((res) => {
		if (res.code == 0) {
			console.log('接口请求成功', res.message);
			writeDataArr = hexStringToByteArray(res.message);

			console.log(writeDataArr);
			uni.showLoading({
				title: '正在写入电子标签~~~',
				mask: true
			})
			inventRead();

			writeTimeout = setTimeout(function () {
				closeLoad('写入失败');
			}, 5000)
		}
		// else {
		// 	uni.showToast({
		// 		title: res.data.message,
		// 		icon: 'none'
		// 	})
		// }
	})
}

//监听

//startAddAO 监听是否可以添加AO
watch(() => {
	return [startAddAO.value, writeStatus.value];
}, ([newStartAddAO, newWriteStatus], [oldStartAddAO, oldWriteStatus]) => {
	if (newStartAddAO != oldStartAddAO && newStartAddAO == true) { //监听是否可以添加AO true可以添加AO 
		let tid = tagsInfo.value.TID.toUpperCase();
		console.log('tid', tid);
		tid = hexStringToByteArray(tid);
		console.log('tid2：', tid);
		addPrivateWriteAOSpec(tid, writeDataArr);//开始添加AO
	}
	if (newWriteStatus != oldWriteStatus && newWriteStatus == true) {  //监听写入状态 if写入成功 需要关闭定时器 writeTimeout
		writeTimeout ? clearTimeout(writeTimeout) : '';

		//推送日志
		let temp_update = JSON.parse(JSON.stringify(postForm.value));//临时变量 存储update
		temp_update.tpmId = postForm.value.U1AQXPID;
		temp_update.carCardType = postForm.value.U1HPZL;
		temp_update.provinceCode = postForm.value.U1SFDM;
		temp_update.carPlateShort = postForm.value.U1HPHMXH;
		temp_update.licenseCode = postForm.value.U1FPDH;
		temp_update.serial = postForm.value.U1JLYBH;
		temp_update.imeiId = deviceRes.deviceId;//设备唯一标识
		console.log(temp_update);
		update(temp_update).then((res) => {
			console.log(res);
			if (res.code == 0) {
				// uni.showToast({
				// 	title: '日志推送成功',
				// 	icon: 'success'
				// });
			}

		})
	}

})


//删除RO规则
const deleteSelectSpec = [0x7e, 0x00, 0x00, 0xaa, 0xbb, 0xcc, 0xdd, 0x11, 0x22, 0x33, 0x44, 0x01, 0x01, 0x92, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0xce, 0x00, 0x00, 0x00, 0x00, 0xab, 0x00, 0x7e];
//删除AO规则
const deleteAccessSpec = [0x7e, 0x00, 0x00, 0xaa, 0xbb, 0xcc, 0xdd, 0x11, 0x22, 0x33, 0x44, 0x01, 0x01, 0xc4, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0xcd, 0x00, 0x00, 0x00, 0x00, 0x86, 0xdd, 0x7e];

//标签写入
// let _inventTime;
const inventRead = () => {
	console.log(23333);
	isReadRules.value = false;//当前状态 写入电子标签需要五步
	startAddAO.value = false;//是否可以添加AO 使用监听
	// tipsInfo.value = {}; //清空ts响应
	// tagsInfo.value = {}; //清空store 存储
	console.log("readRules:" + JSON.stringify(readRules.value));
	console.log("writeRules:" + JSON.stringify(writeRules.value));
	if (writeRules.value.deleteRO) {  //已经删除RO
		//已经删除RO，可直接删除AO
		console.log('已经删除RO，可直接删除AO');
		sendCmd(deleteAccessSpec); //删除AO
	} else {
		console.log('未删除RO，先删除RO');
		sendCmd(deleteSelectSpec); //删除RO应答
	}
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

//toast提示框
const openToast = (title) => {
	uni.showToast({ title: title, icon: 'none' });
}

</script>


<style lang="scss" scoped>
.disBox {
	display: flex;
	justify-content: space-between;
	flex-flow: row nowrap;
	align-items: center;

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
	justify-content: space-between;
	flex-flow: column nowrap;
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
	// min-height: 100vh;

	.view_main {
		padding: 0 29rpx;

		.view_tit {
			color: #000000;
			font-size: 29rpx;
			font-weight: bold;
			justify-content: flex-start;
			padding: 31rpx 0 22rpx;

			&:before {
				content: "";
				display: inline-block;
				width: 9rpx;
				height: 31rpx;
				background-color: #4099FF;
				margin-right: 16rpx;
			}
		}

		.view_con {
			background-color: #fff;
			border-radius: 14rpx;
			box-shadow: 0rpx 5rpx 11rpx 2rpx rgba(0, 0, 0, 0.09);

			.view_rows {
				&:after {
					content: "";
					display: block;
					height: 1px;
					background-color: #EFEFEF;
					margin: 0 27rpx 0 20rpx;
				}

				&:last-child {
					&:after {
						height: 0;
					}
				}

				.disBox {
					text {
						color: #AAAAAA;
						font-size: 24rpx;
						margin-left: 25rpx;
					}

					.boxFlex {
						height: 76rpx;
						line-height: 76rpx;
						color: #000;
						font-size: 24rpx;
						text-align: right;
						padding: 0 28rpx;

					}
				}
			}


		}

		.form_btn {
			padding: 42rpx 30rpx;

			button {
				display: block;
				width: 100%;
				height: 88rpx;
				color: #FFFFFF;
				font-size: 36rpx;
				text-align: center;
				background: linear-gradient(90deg, #1082FF 0%, #5FA9FF 100%);
				border-radius: 14rpx;
			}
		}
	}

	:deep(.wd-picker) {
		.wd-picker__value {
			color: #333;
			margin-right: 0;
		}

		.wd-picker__placeholder {
			color: #888;
		}
	}
}
</style>