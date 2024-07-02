import { ref } from 'vue'
import { auth } from '../api'
import { storeToRefs } from 'pinia'
import { useTagsStore } from '@/store'
export const currentStatus = ref(0); //识读电子标识三步1
// export const ROStatus = ref(false);//RO状态
export const tipsInfo = ref({});//电子标识解析后的内容
export const secRandom = ref('');//安全模块随机数
export const safeSn = ref('');//安全模块SN  安全模块序列号
export const secRandomSign = ref(''); //安全模块对密管系统生成的随机数RNs的签名值s，128HEX
export const authStatus = ref(false); //双向认证状态
export const writeStatus = ref(false);//私有写状态 true成功 false失败

const frameHead = 126
var recvBuf = new Uint8Array(1024)
var frameLen = 0

//协议参数
const Status = 300
const SelectSpecEvent = 303
const SecPrivateConfigAck = 684
const SecSNAck = 687
const IdentificationAck = 665
const VersionInfoAck = 700

//标签参数类型定义
const P_SelectSpecID = 501;
const P_SpecIndex = 502;
const P_RfSpecID = 503;
const P_AntennaID = 504;
const P_PeakRSSI = 505;
const P_FirstSeenTimestampUTC = 506;
const P_LastSeenTimestampUTC = 507;
const P_TagSeenCount = 508;
const P_AccessSpecID = 509;
const P_GenaralSelectSpecResult = 510;
const P_CustomizedSelectSpecResult = 517;
const P_HbReadSpecResult = 511;
const P_ClientRequestSpecResult = 512;
const P_HbWriteSpecResult = 513;
const P_HbPrivateWriteSpecResult = 514;
const P_HbCustomizedReadSpecResult = 515;
const P_ReadDataInfo = 516;
const P_CID = 1001;
const P_FPDH = 1002;
const P_SYXZ = 1003;
const P_CCRQ = 1004;
const P_CLLX = 1005;
const P_GL = 1006;
const P_PL = 1007;
const P_HPZL = 1008;
const P_HPHMXH = 1009;
const P_JYYXQ = 1010;
const P_QZBFQ = 1011;
const P_ZKZL = 1012;
const P_CSYS = 1013;
const P_DID = 1014;
const P_SFDM = 1015;

function TParamHead () {
	var ParamType = 0;
	var ParamLength = 0;
}

function TU8V () {
	var dataLen = 0;
	var data = new Uint8Array(0);
}

function TParamInfo () {
	var paramHead = new TParamHead();
	var data = new Uint8Array(0);
}

function TSelectSpecResult () {
	var paramHead = new TParamHead();
	var Result = 0;
	var TagData = new TU8V();
}

function VehicleInfo () {
	var TID = "";             //标签TID
	//User0个性化数据，88xx和89xx都是在这里
	var CID = "";                                 //标签CID/DID
	var HPHMXH = "";                              //号牌号码序号
	var HPZL = "";                                //号牌种类
	var CCRQ = "";                                //出厂日期
	var SYXZ = "";                                //使用性质
	var FPDH = "";                                //发牌代号
	var SFDM = "";                                //省份
	var CLLX = "";                                //车辆类型
	var PL = "";                                  //排量  百毫升
	var GL = "";                                  //功率kw/h
	var JYYXQ = "";                               //检验有效期
	var QZBFQ = "";                               //强制报废期
	var CSYS = "";                                //车身颜色
	//当车辆类型为客车时，表示核定载客人数，其他车辆表示总质量，当表示总质量时单位是百千克
	var ZKZL = "";                                //核载质量

	var Count = 0;                                  //识读次数

	var ucSYXZ = 0;
	var ucHPZL = 0;
	var ucSFDM = 0;
	var ucFPDH = 0;
	var wCCRQ = 0;
	var ucCSYS = 0;
	var wJYYXQ = 0;
	var ucQZBFQ = 0;
	var wZKZL = 0;
	var wCLLX = 0;
	var ucGL = 0;
	var ucPL = 0;

	var PlateLicense = "";                        //车牌号=省份 + 发牌代号 + 号牌号码序号

	//user1个性化数据，8axx在这里
	var U1Data = "";                                //User1个性化数据
	var U1PlateLicense = "";                        //车牌号=省份 + 发牌代号 + 号牌号码序号
	var U1HPHMXH = "";                              //号牌号码序号
	var U1HPZL = "";                                //号牌种类
	var U1FPDH = "";                                //发牌代号
	var U1SFDM = "";                                //省份
	var U1AQXPID = "";                              //安全芯片ID
	var U1JLYBH = "";                               //记录仪编号

	//私有写操作结果
	var PrivateWriteAck = 0;                          //私有写应答
	var PrivateWriteResult = 0;                       //私有写结果
	var ResultDescription = "";                       //私有写结果描述
}

const arrProvince = ["", "京", "津", "冀", "晋", "蒙", "辽", "吉", "黑", "沪", "苏", "浙", "皖", "闽", "赣", "鲁", "豫",
	"鄂", "湘", "粤", "桂", "琼", "渝", "川", "贵", "云", "藏", "陕", "甘", "青", "宁", "新", "港", "澳", "台"];

const arrFPDHHPHM = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
	"U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const arrProvinceCode = ["", "11", "12", "13", "14", "15", "21", "22", "23", "31", "32", "33", "34", "35", "36", "37", "41",
	"42", "43", "44", "45", "46", "50", "51", "52", "53", "54", "61", "62", "63", "64", "65", "71", "81",
	"82", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99"];

const arrUseNature = ["", "公路、旅游客运", "公交客运", "出租客运", "货运", "租赁", "", "其它", "非营运", "外卖", "快递", "", "警用", "校车", "危化品运输", "教练车"];

const arrHPZL = ["其他车辆", "大型汽车", "小型汽车", "使馆汽车", "领馆汽车", "境外汽车", "外籍汽车", "低速车", "教练汽车",
	"摩托车", "新能源汽车", "警用汽车", "港澳两地汽车", "武警车辆", "军队车辆"];

const arrCSYS = ["白", "灰", "黄", "粉", "红", "紫", "绿", "蓝", "棕", "黑", "", "", "", "", "", "其他"];

const s_aucCommCrcTable = [
	0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5, 0x60c6, 0x70e7,
	0x8108, 0x9129, 0xa14a, 0xb16b, 0xc18c, 0xd1ad, 0xe1ce, 0xf1ef,
	0x1231, 0x0210, 0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6,
	0x9339, 0x8318, 0xb37b, 0xa35a, 0xd3bd, 0xc39c, 0xf3ff, 0xe3de,
	0x2462, 0x3443, 0x0420, 0x1401, 0x64e6, 0x74c7, 0x44a4, 0x5485,
	0xa56a, 0xb54b, 0x8528, 0x9509, 0xe5ee, 0xf5cf, 0xc5ac, 0xd58d,
	0x3653, 0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6, 0x5695, 0x46b4,
	0xb75b, 0xa77a, 0x9719, 0x8738, 0xf7df, 0xe7fe, 0xd79d, 0xc7bc,
	0x48c4, 0x58e5, 0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823,
	0xc9cc, 0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969, 0xa90a, 0xb92b,
	0x5af5, 0x4ad4, 0x7ab7, 0x6a96, 0x1a71, 0x0a50, 0x3a33, 0x2a12,
	0xdbfd, 0xcbdc, 0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a,
	0x6ca6, 0x7c87, 0x4ce4, 0x5cc5, 0x2c22, 0x3c03, 0x0c60, 0x1c41,
	0xedae, 0xfd8f, 0xcdec, 0xddcd, 0xad2a, 0xbd0b, 0x8d68, 0x9d49,
	0x7e97, 0x6eb6, 0x5ed5, 0x4ef4, 0x3e13, 0x2e32, 0x1e51, 0x0e70,
	0xff9f, 0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a, 0x9f59, 0x8f78,
	0x9188, 0x81a9, 0xb1ca, 0xa1eb, 0xd10c, 0xc12d, 0xf14e, 0xe16f,
	0x1080, 0x00a1, 0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067,
	0x83b9, 0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c, 0xe37f, 0xf35e,
	0x02b1, 0x1290, 0x22f3, 0x32d2, 0x4235, 0x5214, 0x6277, 0x7256,
	0xb5ea, 0xa5cb, 0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d,
	0x34e2, 0x24c3, 0x14a0, 0x0481, 0x7466, 0x6447, 0x5424, 0x4405,
	0xa7db, 0xb7fa, 0x8799, 0x97b8, 0xe75f, 0xf77e, 0xc71d, 0xd73c,
	0x26d3, 0x36f2, 0x0691, 0x16b0, 0x6657, 0x7676, 0x4615, 0x5634,
	0xd94c, 0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9, 0xb98a, 0xa9ab,
	0x5844, 0x4865, 0x7806, 0x6827, 0x18c0, 0x08e1, 0x3882, 0x28a3,
	0xcb7d, 0xdb5c, 0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a,
	0x4a75, 0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0, 0x2ab3, 0x3a92,
	0xfd2e, 0xed0f, 0xdd6c, 0xcd4d, 0xbdaa, 0xad8b, 0x9de8, 0x8dc9,
	0x7c26, 0x6c07, 0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1,
	0xef1f, 0xff3e, 0xcf5d, 0xdf7c, 0xaf9b, 0xbfba, 0x8fd9, 0x9ff8,
	0x6e17, 0x7e36, 0x4e55, 0x5e74, 0x2e93, 0x3eb2, 0x0ed1, 0x1ef0
]


export const comm_llrp_calCrc = (pucData, wLength, wValue) => {
	var ucTemp = 0
	var index = 0
	while (wLength-- != 0) {
		ucTemp = (wValue >> 8) & 0xff;
		wValue <<= 8;
		wValue ^= s_aucCommCrcTable[(ucTemp ^ pucData[index]) & 0xff];
		index++;
	}
	wValue &= 0xffff;
	return (wValue);
}

//版本查询应答
export const VersionQueryAck = (finishData) => {
	var index = 19;
	var resIndex = finishData.length;

	while (index < resIndex) {
		var paramType = finishData[index++];
		paramType = (paramType << 8);
		paramType |= (finishData[index++] & 0xff);
		var paramLen = finishData[index++];
		paramLen = (paramLen << 8);
		paramLen |= (finishData[index++] & 0xff);
		switch (paramType) {
			case Status:
				var configAck = finishData[index];
				configAck = (configAck << 8);
				configAck |= (finishData[index + 1] & 0xff);
				configAck = (configAck << 8);
				configAck |= (finishData[index + 2] & 0xff);
				configAck = (configAck << 8);
				configAck |= (finishData[index + 3] & 0xff);
				index += paramLen;
				break;
			case VersionInfoAck:
				console.log('finishData', finishData);

				var MaxVerInfo = finishData[index];
				var MinVerInfo = finishData[index + 1];
				var SubVerInfo = finishData[index + 2];
				var BuildVerInfo = finishData[index + 3];
				var VersionInfo = "V" + BuildVerInfo + MaxVerInfo + "." + MinVerInfo + "." + SubVerInfo;
				console.log('版本消息：', VersionInfo)
				index += paramLen;
				break;
			default:
				index += paramLen;
				break;
		}
	}

	return resIndex
}

//解析私有配置应答
export const PrivateConfigAck = (finishData) => {
	var index = 19;
	var resIndex = finishData.length;

	while (index < resIndex) {
		var paramType = finishData[index++];
		paramType = (paramType << 8);
		paramType |= (finishData[index++] & 0xff);
		var paramLen = finishData[index++];
		paramLen = (paramLen << 8);
		paramLen |= (finishData[index++] & 0xff);
		switch (paramType) {
			case Status:
				var configAck = finishData[index];
				configAck = (configAck << 8);
				configAck |= (finishData[index + 1] & 0xff);
				configAck = (configAck << 8);
				configAck |= (finishData[index + 2] & 0xff);
				configAck = (configAck << 8);
				configAck |= (finishData[index + 3] & 0xff);
				index += paramLen;
				break;
			case SecPrivateConfigAck:
				var configAckLen = finishData[index++];
				configAckLen = (configAckLen << 8);
				configAckLen |= (finishData[index++] & 0xff);
				var configAckData = new Uint8Array(configAckLen)
				for (var i = 0; i < configAckLen; i++) {
					configAckData[i] = finishData[index++]
				}
				var secPrivateAck = ab2hex(configAckData);
				console.log(secPrivateAck);
				if (secPrivateAck.startsWith('06')) {
					secRandom.value = secPrivateAck.substr(2, 16);
					console.log('接收到私有配置信息(安全模块随机数)：', secRandom.value)
				} else if (secPrivateAck.startsWith('07')) {
					console.log('接收到私有配置信息(step=1)：', secPrivateAck);
					secRandomSign.value = secPrivateAck.substr(2, 128);
					console.log('签名值s，128HEX', secRandomSign.value);
					if (secRandomSign.value) {
						auth({ step: 2, data: secRandomSign.value, samsn: safeSn.value }).then((res) => {
							console.log(res);
							if (res.code == 0) {
								authStatus.value = true;
								console.log(res.message);
							}
						})
					}
				} else {
					console.log('接收到私有配置信息', secPrivateAck)
				}

				index += configAckLen;
				break;
			case SecSNAck:
				var devInfoLen = finishData[index++];
				devInfoLen = (devInfoLen << 8);
				devInfoLen |= (finishData[index++] & 0xff);
				var devinfo = new Uint8Array(devInfoLen)
				for (var i = 0; i < devInfoLen; i++) {
					devinfo[i] = finishData[index++]
				}
				if (devInfoLen == 8) {
					var SMSNHead = new Uint8Array(2)
					for (var i = 0; i < 2; i++) {
						SMSNHead[i] = devinfo[i]
					}
					var SMSNInfo = String.fromCharCode(SMSNHead[0]) + String.fromCharCode(SMSNHead[1])
					var first = devinfo[2];
					var second = devinfo[3];
					second = second << 8;
					second |= (devinfo[4] & 0xff);
					var third = devinfo[5];
					third = third << 8;
					third |= (devinfo[6] & 0xff);
					third = third << 8;
					third |= (devinfo[7] & 0xff);
					SMSNInfo = SMSNInfo + String(first).padStart(2, '0') + String(second).padStart(3, '0') + String(third).padStart(5, '0')
				} else {
					var SMSNInfo = devinfo.toString();
				}
				safeSn.value = SMSNInfo;
				console.log('接收到安全模块SN：', safeSn.value)
				index += devInfoLen;
				break;
			case IdentificationAck:
				devInfoLen = finishData[index++];
				devInfoLen = (devInfoLen << 8);
				devInfoLen |= (finishData[index++] & 0xff);
				var devinfo = new Uint8Array(devInfoLen)
				for (var i = 0; i < devInfoLen; i++) {
					devinfo[i] = finishData[index++]
				}
				var deviceSNInfo = ab2hex(devinfo);
				console.log('接收到设备SN：', deviceSNInfo)
				index += devInfoLen;
				break;
			default:
				index += paramLen;
				break;
		}
	}

	return resIndex;
}

//解析事件通知
const DeviceEventNotification = (finishData) => {
	var index = 19;
	var resIndex = finishData.length;

	while (index < resIndex) {
		var paramType = finishData[index++];
		paramType = (paramType << 8);
		paramType |= (finishData[index++] & 0xff);
		var paramLen = finishData[index++];
		paramLen = (paramLen << 8);
		paramLen |= (finishData[index++] & 0xff);
		switch (paramType) {
			case SelectSpecEvent:
				//0表示RO开始，1表示RO结束
				var roEvent = finishData[index];
				if (roEvent == 0) {
					// ROStatus.value = false;
					console.log('接收到RO开始事件：', roEvent)
				} else {
					// ROStatus.value = true;
					console.log('接收到RO结束事件：', roEvent)
				}

				index += paramLen;
				break;
			default:
				index += paramLen;
				break;
		}
	}

	return resIndex;
}

const GetTParamHead = (buff, index, paramHead) => {
	paramHead.ParamType = buff[index++];
	paramHead.ParamType = (paramHead.ParamType << 8);
	paramHead.ParamType |= (buff[index++] & 0xff);
	paramHead.ParamLength = buff[index++];
	paramHead.ParamLength = (paramHead.ParamLength << 8);
	paramHead.ParamLength |= (buff[index++] & 0xff);
	return index;
}

const GetUIntV = (buf, index, data) => {
	data.dataLen = buf[index++];
	data.dataLen = (data.dataLen << 8);
	data.dataLen |= (buf[index++] & 0xff);
	data.data = new Uint8Array(data.dataLen);
	for (var i = 0; i < data.dataLen; i++) {
		data.data[i] = buf[i + index]
	}
	index += data.dataLen;
	return index;
}

const GetTParamInfo = (buf, index, paramInfo) => {
	paramInfo.paramHead = new TParamHead();
	index = GetTParamHead(buf, index, paramInfo.paramHead);
	paramInfo.data = new Uint8Array(paramInfo.paramHead.ParamLength);
	for (var i = 0; i < paramInfo.paramHead.ParamLength; i++) {
		paramInfo.data[i] = buf[i + index]
	}
	index += paramInfo.paramHead.ParamLength;
	return index;
}

//解析510
const GetSelectSpecResult = (buff, index, selectSpecResult) => {
	selectSpecResult.paramHead = new TParamHead();
	index = GetTParamHead(buff, index, selectSpecResult.paramHead);
	var resIndex = index + selectSpecResult.paramHead.ParamLength;

	selectSpecResult.Result = buff[index++];
	if (index < resIndex) {
		selectSpecResult.TagData = new TU8V();
		selectSpecResult.TagData.dataLen = buff[index++];
		selectSpecResult.TagData.dataLen = (selectSpecResult.TagData.dataLen << 8);
		selectSpecResult.TagData.dataLen |= (buff[index++] & 0xff);
		selectSpecResult.TagData.dataLen *= 2;
		if (selectSpecResult.TagData.dataLen > 0) {
			selectSpecResult.TagData.data = new Uint8Array(selectSpecResult.TagData.dataLen);
			for (var i = 0; i < selectSpecResult.TagData.dataLen; i++) {
				selectSpecResult.TagData.data[i] = buff[i + index]
			}
		}
	}

	return resIndex;
}

const GetCLLX = (value) => {
	switch (value) {
		case 0: return "其它";
		case 1: return " 大型普通客车 ";
		case 2: return " 大型双层客车 ";
		case 3: return " 大型卧铺客车 ";
		case 4: return " 大型铰接客车 ";
		case 5: return " 大型越野客车 ";
		case 6: return " 大型轿车 ";
		case 7: return " 大型专用客车 ";
		case 8: return " 大型专用校车 ";
		case 9: return " 中型普通客车 ";
		case 10: return " 中型双层客车 ";
		case 11: return " 中型卧铺客车 ";
		case 12: return " 中型铰接客车 ";
		case 13: return " 中型越野客车 ";
		case 14: return " 中型轿车 ";
		case 15: return " 中型专用车 ";
		case 16: return " 中型专用校车 ";
		case 17: return " 小型普通客车 ";
		case 18: return " 小型越野客车 ";
		case 19: return " 小型轿车 ";
		case 20: return " 小型专用客车 ";
		case 21: return " 小型专用校车 ";
		case 22: return " 小型面包车 ";
		case 23: return " 微型普通客车 ";
		case 24: return " 微型越野客车 ";
		case 25: return " 微型轿车 ";
		case 26: return " 微型面包车 ";

		case 64: return " 重型半挂牵引车 ";
		case 65: return " 重型全挂牵引车 ";
		case 66: return " 中型半挂牵引车 ";
		case 67: return " 中型全挂牵引车 ";
		case 68: return " 轻型半挂牵引车 ";
		case 69: return " 轻型全挂牵引车 ";

		case 80: return " 大型非载货专项作业车 ";
		case 81: return " 大型载货专项作业车 ";
		case 82: return " 中型非载货专项作业车 ";
		case 83: return " 中型载货专项作业车 ";
		case 84: return " 小型非载货专项作业车 ";
		case 85: return " 小型载货专项作业车 ";
		case 86: return " 微型非载货专项作业车 ";
		case 87: return " 微型载货专项作业车 ";
		case 88: return " 重型非载货专项作业车 ";
		case 89: return " 重型载货专项作业车 ";
		case 90: return " 轻型非载货专项作业车 ";
		case 91: return " 轻型载货专项作业车 ";

		case 96: return " 普通正三轮摩托车 ";
		case 97: return " 轻便正三轮摩托车 ";
		case 98: return " 正三轮载客摩托车 ";
		case 99: return " 正三轮载货摩托车 ";
		case 100: return " 侧三轮摩托车 ";
		case 101: return " 普通二轮摩托车 ";
		case 102: return " 轻便二轮摩托车 ";
		case 104: return " 无轨电车 ";
		case 105: return " 有轨电车 ";
		case 106: return " 三轮汽车 ";
		case 107: return " 轮式装载机械 ";
		case 108: return " 轮式挖掘机械 ";
		case 109: return " 轮式平地机械 ";

		case 128: return " 重型普通货车 ";
		case 129: return " 重型厢式货车 ";
		case 130: return " 重型封闭货车 ";
		case 131: return " 重型罐式货车 ";
		case 132: return " 重型平板货车 ";
		case 133: return " 重型集装厢车 ";
		case 134: return " 重型自卸货车 ";
		case 135: return " 重型特殊结构货车 ";
		case 136: return " 重型仓栅式货车 ";
		case 137: return " 重型车辆运输车 ";
		case 138: return " 重型厢式自卸货车 ";
		case 139: return " 重型罐式自卸货车 ";
		case 140: return " 重型平板自卸货车 ";
		case 141: return " 重型集装厢自卸货车 ";
		case 142: return " 重型特殊结构自卸货车 ";
		case 143: return " 重型仓栅式自卸货车 ";

		case 144: return " 中型普通货车 ";
		case 145: return " 中型厢式货车 ";
		case 146: return " 中型封闭货车 ";
		case 147: return " 中型罐式货车 ";
		case 148: return " 中型平板货车 ";
		case 149: return " 中型集装厢车 ";
		case 150: return " 中型自卸货车 ";
		case 151: return " 中型特殊结构货车 ";
		case 152: return " 中型仓栅式货车 ";
		case 153: return " 中型车辆运输车 ";
		case 154: return " 中型厢式自卸货车 ";
		case 155: return " 中型罐式自卸货车 ";
		case 156: return " 中型平板自卸货车 ";
		case 157: return " 中型集装厢自卸货车 ";
		case 158: return " 中型特殊结构自卸货车 ";
		case 159: return " 中型仓栅式自卸货车 ";

		case 160: return " 轻型普通货车 ";
		case 161: return " 轻型厢式货车 ";
		case 162: return " 轻型封闭货车 ";
		case 163: return " 轻型罐式货车 ";
		case 164: return " 轻型平板货车 ";
		case 165: return " 轻型自卸货车 ";
		case 166: return " 轻型特殊结构货车 ";
		case 167: return " 轻型仓栅式货车 ";
		case 168: return " 轻型车辆运输车 ";
		case 169: return " 轻型厢式自卸货车 ";
		case 170: return " 轻型罐式自卸货车 ";
		case 171: return " 轻型平板自卸货车 ";
		case 172: return " 轻型特殊结构自卸货车 ";
		case 173: return " 轻型仓栅式自卸货车 ";
		case 174: return " 微型普通货车 ";
		case 175: return " 微型厢式货车 ";
		case 176: return " 微型封闭货车 ";
		case 177: return " 微型罐式货车 ";
		case 178: return " 微型自卸货车 ";
		case 179: return " 微型特殊结构货车 ";
		case 180: return " 微型仓栅式货车 ";
		case 181: return " 微型车辆运输车 ";
		case 182: return " 微型厢式自卸货车 ";
		case 183: return " 微型罐式自卸货车 ";
		case 184: return " 微型特殊结构自卸货车 ";
		case 185: return " 微型仓栅式自卸货车 ";
		case 186: return " 普通低速货车 ";
		case 187: return " 厢式低速货车 ";
		case 188: return " 罐式低速货车 ";
		case 189: return " 自卸低速货车 ";
		case 190: return " 仓栅式低速货车 ";
		case 191: return " 厢式自卸低速货车 ";
		case 192: return " 罐式自卸低速货车 ";

		case 256: return " 重型普通全挂车 ";
		case 257: return " 重型厢式全挂车 ";
		case 258: return " 重型罐式全挂车 ";
		case 259: return " 重型平板全挂车 ";
		case 260: return " 重型集装箱全挂车 ";
		case 261: return " 重型自卸全挂车 ";
		case 262: return " 重型仓栅式全挂车 ";
		case 263: return " 重型旅居全挂车 ";
		case 264: return " 重型专项作业全挂车 ";
		case 265: return " 重型厢式自卸全挂车 ";
		case 266: return " 重型罐式自卸全挂车 ";
		case 267: return " 重型平板自卸全挂车 ";
		case 268: return " 重型集装箱自卸全挂车 ";
		case 269: return " 重型仓栅式自卸全挂车 ";
		case 270: return " 重型专业作业自卸全挂车 ";
		case 271: return " 中型普通全挂车 ";
		case 272: return " 中型厢式全挂车 ";
		case 273: return " 中型罐式全挂车 ";
		case 274: return " 中型平板全挂车 ";
		case 275: return " 中型集装箱全挂车 ";
		case 276: return " 中型自卸全挂车 ";
		case 277: return " 中型仓栅式全挂车 ";
		case 278: return " 中型旅居全挂车 ";
		case 279: return " 中型专项作业全挂车 ";
		case 280: return " 中型厢式自卸全挂车 ";
		case 281: return " 中型罐式自卸全挂车 ";
		case 282: return " 中型平板自卸全挂车 ";
		case 283: return " 中型集装箱自卸全挂车 ";
		case 284: return " 中型仓栅式自卸全挂车 ";
		case 285: return " 中型专业作业自卸全挂车 ";
		case 286: return " 轻型普通全挂车 ";
		case 287: return " 轻型厢式全挂车 ";
		case 288: return " 轻型罐式全挂车 ";
		case 289: return " 轻型平板全挂车 ";
		case 290: return " 轻型自卸全挂车 ";
		case 291: return " 轻型仓栅式全挂车 ";
		case 292: return " 轻型旅居全挂车 ";
		case 293: return " 轻型专项作业全挂车 ";
		case 294: return " 轻型厢式自卸全挂车 ";
		case 295: return " 轻型罐式自卸全挂车 ";
		case 296: return " 轻型平板自卸全挂车 ";
		case 297: return " 轻型集装箱自卸全挂车 ";
		case 298: return " 轻型仓栅式自卸全挂车 ";
		case 299: return " 轻型专业作业自卸全挂车 ";

		case 384: return " 重型普通半挂车 ";
		case 385: return " 重型厢式半挂车 ";
		case 386: return " 重型罐式半挂车 ";
		case 387: return " 重型平板半挂车 ";
		case 388: return " 重型集装箱半挂车 ";
		case 389: return " 重型自卸半挂车 ";
		case 390: return " 重型特殊结构半挂车 ";
		case 391: return " 重型仓栅式半挂车 ";
		case 392: return " 重型旅居半挂车 ";
		case 393: return " 重型专项作业半挂车 ";
		case 394: return " 重型低平板半挂车 ";
		case 395: return " 重型车辆运输半挂车 ";
		case 396: return " 重型罐式自卸半挂车 ";
		case 397: return " 重型平板自卸半挂车 ";
		case 398: return " 重型集装箱自卸半挂车 ";
		case 399: return " 重型特殊结构自卸半挂车 ";
		case 400: return " 重型仓栅式自卸半挂车 ";
		case 401: return " 重型专业作业自卸半挂车 ";
		case 402: return " 重型低平板自卸半挂车 ";
		case 403: return " 重型中置轴旅居挂车 ";
		case 404: return " 重型中置轴车辆运输车 ";
		case 405: return " 重型中置轴普通挂车 ";

		case 406: return " 中型普通半挂车 ";
		case 407: return " 中型厢式半挂车 ";
		case 408: return " 中型罐式半挂车 ";
		case 409: return " 中型平板半挂车 ";
		case 410: return " 中型集装箱半挂车 ";
		case 411: return " 中型自卸半挂车 ";
		case 412: return " 中型特殊结构半挂车 ";
		case 413: return " 中型仓栅式半挂车 ";
		case 414: return " 中型旅居半挂车 ";
		case 415: return " 中型专项作业半挂车 ";
		case 416: return " 中型低平板半挂车 ";
		case 417: return " 中型车辆运输半挂车 ";
		case 418: return " 中型罐式自卸半挂车 ";
		case 419: return " 中型平板自卸半挂车 ";
		case 420: return " 中型集装箱自卸半挂车 ";
		case 421: return " 中型特殊结构自卸半挂车 ";
		case 422: return " 中型仓栅式自卸半挂车 ";
		case 423: return " 中型专业作业自卸半挂车 ";
		case 424: return " 中型低平板自卸半挂车 ";
		case 425: return " 中型中置轴旅居挂车 ";
		case 426: return " 中型中置轴车辆运输车 ";
		case 427: return " 中型中置轴普通挂车 ";

		case 428: return " 轻型普通半挂车 ";
		case 429: return " 轻型厢式半挂车 ";
		case 430: return " 轻型罐式半挂车 ";
		case 431: return " 轻型平板半挂车 ";
		case 432: return " 轻型自卸半挂车 ";
		case 433: return " 轻型仓栅式半挂车 ";
		case 434: return " 轻型旅居半挂车 ";
		case 435: return " 轻型专项作业半挂车 ";
		case 436: return " 轻型低平板半挂车 ";
		case 437: return " 轻型车辆运输半挂车 ";
		case 438: return " 轻型罐式自卸半挂车 ";
		case 439: return " 轻型平板自卸半挂车 ";
		case 440: return " 轻型集装箱自卸半挂车 ";
		case 441: return " 轻型特殊结构自卸半挂车 ";
		case 442: return " 轻型仓栅式自卸半挂车 ";
		case 443: return " 轻型专业作业自卸半挂车 ";
		case 444: return " 轻型低平板自卸半挂车 ";
		case 445: return " 轻型中置轴旅居挂车 ";
		case 446: return " 轻型中置轴车辆运输车 ";
		case 447: return " 轻型中置轴普通挂车 ";
		default: return "未知" + value;
	}
}

//初始化VehicleInfo
const InitVehicleInfo = () => {
	var vehicle = new VehicleInfo();

	vehicle.TID = "";             //标签TID
	//User0个性化数据，88xx和89xx都是在这里
	vehicle.CID = "";                                 //标签CID/DID
	vehicle.HPHMXH = "";                              //号牌号码序号
	vehicle.HPZL = "";                                //号牌种类
	vehicle.CCRQ = "";                                //出厂日期
	vehicle.SYXZ = "";                                //使用性质
	vehicle.FPDH = "";                                //发牌代号
	vehicle.SFDM = "";                                //省份
	vehicle.CLLX = "";                                //车辆类型
	vehicle.PL = "";                                  //排量  百毫升
	vehicle.GL = "";                                  //功率kw/h
	vehicle.JYYXQ = "";                               //检验有效期
	vehicle.QZBFQ = "";                               //强制报废期
	vehicle.CSYS = "";                                //车身颜色
	//当车辆类型为客车时，表示核定载客人数，其他车辆表示总质量，当表示总质量时单位是百千克
	vehicle.ZKZL = "";                                //核载质量

	//user1个性化数据，8axx在这里
	vehicle.U1Data = "";                                //User1个性化数据
	vehicle.U1PlateLicense = "";                        //车牌号=省份 + 发牌代号 + 号牌号码序号
	vehicle.U1HPHMXH = "";                              //号牌号码序号
	vehicle.U1HPZL = "";                                //号牌种类
	vehicle.U1FPDH = "";                                //发牌代号
	vehicle.U1SFDM = "";                                //省份
	vehicle.U1AQXPID = "";                              //安全芯片ID
	vehicle.U1JLYBH = "";                               //记录仪编号

	return vehicle;
}

//获取车辆信息
const GetVehicleInfo = (vehicle) => {
	return "{" +
		"\"TID\":\"" + vehicle.TID + '\"' +
		",\"卡号\":\"" + vehicle.CID + '\"' +
		", \"号牌号码\":\"" + vehicle.HPHMXH + '\"' +
		", \"号牌种类\":\"" + vehicle.HPZL + '\"' +
		", \"车辆类型\":\"" + vehicle.CLLX + '\"' +
		", \"排量\":\"" + vehicle.PL + '\"' +
		", \"检验有效期\":\"" + vehicle.JYYXQ + '\"' +
		", \"强制报废期\":\"" + vehicle.QZBFQ + '\"' +
		", \"车身颜色\":\"" + vehicle.CSYS + '\"' +
		", \"总质量\":\"" + vehicle.ZKZL + '\"' +
		", \"出厂日期\":\"" + vehicle.CCRQ + '\"' +
		", \"使用性质\":\"" + vehicle.SYXZ + '\"' +
		", \"车牌号\":\"" + vehicle.PlateLicense + '\"' +
		", \"识读次数\":\"" + vehicle.Count + '\"' +

		", \"User1个性化数据\":\"" + vehicle.U1Data + '\"' +
		", \"U1车牌号\":\"" + vehicle.U1PlateLicense + '\"' +
		", \"U1号牌号码序号\":\"" + vehicle.U1HPHMXH + '\"' +
		", \"U1号牌种类\":\"" + vehicle.U1HPZL + '\"' +
		", \"U1发牌代号\":\"" + vehicle.U1FPDH + '\"' +
		", \"U1省份代码\":\"" + vehicle.U1SFDM + '\"' +
		", \"U1安全芯片ID\":\"" + vehicle.U1AQXPID + '\"' +
		", \"U1记录仪编号\":\"" + vehicle.U1JLYBH + '\"' +
		'}';
}

//解析原始个性化数据，包括机动车数据88xx，非机动车数据89xx，User1数据8axx
const GetCustomizedInfo = (data, vehicle) => {
	var index = 0;
	var resIndex = data.length;
	var tshp = "";
	var nExamineExpireDate = 0;
	var month = 0;
	while (index < resIndex) {
		var paramType = data[index++];

		if (paramType > 0) {
			paramType = (data[index++] & 0xff) * 256 + paramType;
			var paramLen = data[index++];
			paramLen = (data[index++] & 0xff) * 256 + paramLen;

			switch (paramType) {
				case 0x8801:            //cid
					vehicle.CLLX = "机动车";
					var cid = new Uint8Array(paramLen);
					for (var i = 0; i < paramLen; i++) {
						cid[i] = data[i + index]
					}

					//解析CID
					var number = ((cid[3] & 0x3f) << 24);
					number |= ((cid[2] & 0xff) << 16);
					number |= ((cid[1] & 0xff) << 8);
					number |= (cid[0] & 0xff);

					//获取省份代号
					var provinceNum = ((cid[3] & 0xff) >> 6);
					provinceNum |= ((cid[4] << 2) & 0xff);

					var scid = arrProvinceCode[provinceNum] + String(number).padStart(10, '0'); //"No." + 
					vehicle.CID = scid;
					break;
				case 0x8802:            //省份代码+发牌代号
					vehicle.UcSFDM = data[index];
					vehicle.UcFPDH = data[index + 1];
					vehicle.SFDM = arrProvince[data[index]];
					vehicle.FPDH = arrFPDHHPHM[data[index + 1]];
					break;
				case 0x8805:            //车辆类型
					var nCLLX = (data[index + 1] * 256);
					nCLLX |= (data[index] & 0xff);
					vehicle.WCLLX = nCLLX;
					vehicle.CLLX = GetCLLX(nCLLX);
					break;
				case 0x8806:            //功率
					vehicle.UcGL = data[index];
					vehicle.GL = data[index] + "千瓦时";
					break;
				case 0x8807:            //排量
					vehicle.UcPL = data[index];
					vehicle.PL = data[index] + "L";
					break;
				case 0x8808:            //号牌种类
					vehicle.UcHPZL = data[index];
					vehicle.HPZL = arrHPZL[data[index]];
					if (data[index] == 8)
						tshp = "学";
					else if (data[index] == 11)
						tshp = "警";
					break;
				case 0x880a:            //检验有效期
					nExamineExpireDate = (data[index + 1] * 256);
					nExamineExpireDate |= (data[index] & 0xff);
					vehicle.WJYYXQ = nExamineExpireDate;
					var jyyxq = (Math.floor(nExamineExpireDate / 12) + 2013) + "-";
					month = (nExamineExpireDate % 12 + 1);
					jyyxq += (month > 9) ? month : ("0" + month);
					vehicle.JYYXQ = jyyxq;
					break;
				case 0x880b:            //强制报废期
					vehicle.UcQZBFQ = data[index];
					var qzbfq = (Math.floor(nExamineExpireDate / 12) + 2013 + data[index]) + "-";
					qzbfq += (month > 9) ? month : ("0" + month);
					vehicle.QZBFQ = qzbfq;
					break;
				case 0x880c:            //核定载客/总质量
					//核定载客/总质量
					var zkzl = (data[index + 1] * 256 + (data[index] & 0xff));
					vehicle.WZKZL = zkzl;
					if (vehicle.CLLX.indexOf("客车") >= 0)
						vehicle.ZKZL = zkzl + "人";
					else
						vehicle.ZKZL = (zkzl / 10) + "吨";

					break;
				case 0x880d:            //车身颜色
					vehicle.UcCSYS = data[index];
					vehicle.CSYS = arrCSYS[data[index]];
					break;

				case 0x8901:
					vehicle.CLLX = "非机动车";
					var did = new Uint8Array(paramLen);
					vehicle.CID = ""
					for (var i = 0; i < paramLen; i++) {
						did[i] = data[i + index]
						vehicle.CID += String.fromCharCode(did[i])
					}
					break;
				case 0x8902:            //号牌号码序号
				case 0x8809:            //号牌号码序号
					var hphmxh = "";
					for (var j = index; j < index + paramLen; j++) {
						hphmxh += arrFPDHHPHM[data[j]];
					}
					vehicle.HPHMXH = hphmxh;
					break;
				case 0x8903:        //省份代码
					vehicle.UcSFDM = data[index];
					vehicle.SFDM = arrProvince[data[index]];
					break;
				case 0x8904:        //发牌代号
					vehicle.UcFPDH = data[index];
					vehicle.FPDH = arrFPDHHPHM[data[index]];
					break;
				case 0x8905:        //号牌种类
					vehicle.UcHPZL = data[index]
					if (data[index] == 1) {
						vehicle.HPZL = "临时号牌";
					} else if (data[index] == 2) {
						vehicle.HPZL = "正式号牌";
					}
					break;
				case 0x8906:        //出厂日期
				case 0x8804:        //出厂日期
					var nProductionDate = (data[index + 1] * 256);
					nProductionDate |= (data[index] & 0xff);
					vehicle.WCCRQ = nProductionDate;
					var ccrq = (Math.floor(nProductionDate / 12) + 1990) + "-";
					month = (nProductionDate % 12 + 1);
					ccrq += (month > 9) ? (month) : ("0" + month);
					vehicle.CCRQ = ccrq;
					break;
				case 0x8907:        //使用性质
				case 0x8803:            //使用性质
					vehicle.UcSYXZ = data[index];
					vehicle.SYXZ = arrUseNature[data[index]];
					break;
				case 0x8a01:        //号牌号码序号
					vehicle.U1Data = ab2hex(data);
					hphmxh = "";
					for (var j = index; j < index + paramLen; j++) {
						hphmxh += String.fromCharCode(data[j]);
					}
					vehicle.U1HPHMXH = hphmxh;
					break;
				case 0x8a02:        //省份代码
					vehicle.U1SFDM = arrProvince[data[index]];
					break;
				case 0x8a03:        //发牌代号
					vehicle.U1FPDH = String.fromCharCode(data[index]);
					break;
				case 0x8a04:        //号牌种类
					vehicle.U1HPZL = arrHPZL[data[index]];
					if (data[index] == 8)
						tshp = "学";
					else if (data[index] == 11)
						tshp = "警";
					break;
				case 0x8a05:        //安全芯片ID
					var secid = new Uint8Array(paramLen);
					vehicle.U1AQXPID = "";
					for (var i = 0; i < paramLen; i++) {
						secid[i] = data[i + index]
						vehicle.U1AQXPID += String.fromCharCode(secid[i])
					}
					break;
				case 0x8a06:        //记录仪编号
					var bianhao = new Uint8Array(paramLen);
					vehicle.U1JLYBH = "";
					for (var i = 0; i < paramLen; i++) {
						bianhao[i] = data[i + index]
						vehicle.U1JLYBH += String.fromCharCode(bianhao[i])
					}
					break;
				default:
					break;
			}
			index += paramLen;
		}
	}

	if (vehicle.HPHMXH != "") {
		var license = vehicle.SFDM + vehicle.FPDH + vehicle.HPHMXH + tshp;
		vehicle.PlateLicense = license;
	}

	if (vehicle.U1HPHMXH != "") {
		var license = vehicle.U1SFDM + vehicle.U1FPDH + vehicle.U1HPHMXH + tshp;
		vehicle.U1PlateLicense = license;
	}
}

const AnalyzingOneTagReportData = (frame, index) => {
	var TagReportData = new TParamHead();
	index = GetTParamHead(frame, index, TagReportData);
	var resIndex = index + TagReportData.ParamLength;

	var vehicle = InitVehicleInfo()

	var tid = new TU8V();
	index = GetUIntV(frame, index, tid);
	vehicle.TID = ab2hex(tid.data);
	console.log('vehicle:', vehicle);
	console.log('解析标签TID：', vehicle.TID)
	tipsInfo.value = vehicle;

	while (index < resIndex) {
		var paramType = frame[index];
		paramType = (paramType << 8);
		paramType |= (frame[index + 1] & 0xff);
		var paramInfo = new TParamInfo();
		switch (paramType) {
			case P_SelectSpecID:
				index = GetTParamInfo(frame, index, paramInfo);
				break;
			case P_AccessSpecID:
				index = GetTParamInfo(frame, index, paramInfo);
				break;
			case P_SpecIndex:
				index = GetTParamInfo(frame, index, paramInfo);
				break;
			case P_RfSpecID:
				index = GetTParamInfo(frame, index, paramInfo);
				break;
			case P_AntennaID:
				index = GetTParamInfo(frame, index, paramInfo);
				break;
			case P_PeakRSSI:
				index = GetTParamInfo(frame, index, paramInfo);
				break;
			case P_FirstSeenTimestampUTC:
				index = GetTParamInfo(frame, index, paramInfo);
				break;
			case P_LastSeenTimestampUTC:
				index = GetTParamInfo(frame, index, paramInfo);
				break;
			case P_TagSeenCount:
				index = GetTParamInfo(frame, index, paramInfo);
				var count = paramInfo.data[0];
				count = (count << 8);
				count |= (paramInfo.data[1] & 0xff);
				vehicle.Count = count;
				break;
			case P_GenaralSelectSpecResult:
				var selectSpecResult = new TSelectSpecResult();
				index = GetSelectSpecResult(frame, index, selectSpecResult);
				if (selectSpecResult.Result == 0) {
					var tagdata = ab2hex(selectSpecResult.TagData.data)
					console.log('解析标签数据：', tagdata)
					GetCustomizedInfo(selectSpecResult.TagData.data, vehicle);
					// console.log('标签数据：', GetVehicleInfo(vehicle))
					tipsInfo.value = vehicle;
					console.log('标签数据：', JSON.stringify(vehicle));
				}
				break;
			case P_CustomizedSelectSpecResult:
				index = GetTParamInfo(frame, index, paramInfo);
				break;
			case P_HbReadSpecResult:
				index = GetTParamInfo(frame, index, paramInfo);
				break;
			case P_HbWriteSpecResult:
				index = GetTParamInfo(frame, index, paramInfo);
				break;
			case P_HbPrivateWriteSpecResult:
				console.log('私有写 start');
				index = GetTParamInfo(frame, index, paramInfo);
				vehicle.PrivateWriteAck = 1;
				if (paramInfo.data.length >= 5) {
					vehicle.PrivateWriteResult = paramInfo.data[0];
					var desLen = paramInfo.data[1];
					desLen = (desLen << 8);
					desLen |= (paramInfo.data[2] & 0xff);
					if (desLen > 0) {
						var desinfo = new Uint8Array(desLen);
						vehicle.ResultDescription = ""
						for (var i = 0; i < desLen; i++) {
							desinfo[i] = paramInfo.data[i + 3]
							vehicle.ResultDescription += String.fromCharCode(desinfo[i])
						}
					}
				}
				writeStatus.value = true;
				console.log('私有写结果vehicle' + JSON.stringify(vehicle));
				break;
			case P_HbCustomizedReadSpecResult:
				index = GetTParamInfo(frame, index, paramInfo);
				break;
			default:
				console.log('解析错误的参数类型：', paramType)
				index = GetTParamInfo(frame, index, paramInfo);
				break;
		}
	}

	return resIndex;
}

//解析标签上报
const analysisTagReport = (finishData) => {
	var index = 19;
	var length = finishData.length;
	while (index < length) {
		index = AnalyzingOneTagReportData(finishData, index);
	}
}


//解析Llrp帧
export const analysisLlrpFrame = (finishData) => {
	if (finishData[0] == 90 && finishData[finishData.length - 1] == 165 && finishData.length == 8) {//电量
		var eleData = finishData[finishData.length - 2];
		console.log('接收到电量消息：', eleData)
	} else {
		var msgType = finishData[9] & 0xff;
		msgType = (msgType << 8);
		msgType |= (finishData[10] & 0xff);

		if (msgType == 500) {//标签上报  01f4
			console.log('标签上报：', msgType)
			analysisTagReport(finishData);
		} else if (msgType == 453) {//删除AO应答  01c5
			console.log('删除AO应答：', msgType)
			//AOSpecOption.delAOAck = Success;
		} else if (msgType == 403) {//删除RO应答  0193
			console.log('删除RO应答：', msgType)
			// currentStatus.value = 1;
			//ROSpecOption.delROAck = Success;
		} else if (msgType == 401) {//添加RO应答  0191
			console.log('添加RO应答：', msgType)
			// currentStatus.value = 2;
			//ROSpecOption.addROAck = Success;
		} else if (msgType == 405) {//启动RO应答  0195
			console.log('启动RO应答：', msgType)
			// currentStatus.value = 3;
			//ROSpecOption.startROAck = Success;
		} else if (msgType == 302) {//事件通知  012e
			console.log('事件通知：', msgType)
			DeviceEventNotification(finishData);
		} else if (msgType == 661) {//私有配置应答  0295
			console.log('私有配置应答：', msgType)
			PrivateConfigAck(finishData);
		} else if (msgType == 451) {//添加AO应答  01c3
			console.log('添加AO应答：', msgType)
			//AOSpecOption.AddAOAck(finishData);
		} else if (msgType == 701) {//查询版本应答  02bd
			console.log('查询版本应答：', msgType)
			VersionQueryAck(finishData);
		}
		return msgType; //返回消息类型

	}
}

//解析整帧
export const analysisFrame = (frame) => {
	var receiveValue = ab2hex(frame)
	var circleData = new Uint8Array(1024)
	var j = 0
	for (var i = 3; i < (frame.length - 1); i++) {
		switch (frame[i]) {
			case 125:
				if (frame[i + 1] == 93) {
					circleData[j++] = 125
				} else if (frame[i + 1] == 94) {
					circleData[j++] = 126
				}
				i++
				break
			default:
				circleData[j++] = frame[i]
				break
		}
	}

	var finishData = new Uint8Array(j - 2)
	for (var i = 0; i < finishData.length; i++) {
		finishData[i] = circleData[i]
	}

	//计算数据crc
	var crc = comm_llrp_calCrc(finishData, finishData.length, 0)
	var crcsrc = (circleData[j - 2] << 8) & 0xffff;
	crcsrc |= (circleData[j - 1] & 0xff);
	if (crc != crcsrc) {
		console.log('crc校验失败，生成crc值：', crc)
		return
	}

	return analysisLlrpFrame(finishData)
}

//处理蓝牙接收数据
export const dealRecvData = (buffer, offset, len) => {
	// 解析蓝牙接收数据
	if (offset >= len)
		return;

	if (frameLen == 0) {
		for (var i = offset; i < len; i++) {
			if (buffer[i] == frameHead) {
				recvBuf[0] = frameHead
				frameLen = 1
				offset++
				dealRecvData(buffer, offset, len)
				break
			}
		}
	}
	else {
		for (var i = offset; i < len; i++) {
			if (buffer[i] == frameHead && frameLen > 5) {
				recvBuf[frameLen] = frameHead
				frameLen++
				var frame = new Uint8Array(frameLen)
				for (var j = 0; j < frameLen; j++) {
					frame[j] = recvBuf[j]
				}

				frameLen = 0
				offset++
				dealRecvData(buffer, offset, len)

				return analysisFrame(frame)
				break
			}
			else if (buffer[i] == frameHead) {
				recvBuf[0] = frameHead
				frameLen = 1
				offset++
				dealRecvData(buffer, offset, len)
				break
			} else {
				recvBuf[frameLen] = buffer[i]
				frameLen++
				offset++
			}
		}
	}
}

//获取安全模块生成的随机数
//获取设备配置(安全模块私有配置)
const getDeviceConfig = [0xaa, 0xbb, 0xcc, 0xdd, 0x11, 0x22, 0x33, 0x44, 0x01, 0x02, 0x94, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0xee, 0x0b, 0x00, 0x02, 0xac, 0x00, 0x00, 0x00, 0x00];

//发送指令缓存
var SendFrame = new Uint8Array(1024)
var SendLen = 0
//获取安全模块私有配置
export const getDeviceSecConfig = (privateinfo) => {
	SendLen = 0;
	SendFrame = new Uint8Array(1024)
	var msgLenIndex = 11;
	var paramLenIndex = 23;
	var arrayLenIndex = 25;
	//zllrp帧
	var frame = new Uint8Array(getDeviceConfig.length + privateinfo.length)
	for (var i = 0; i < getDeviceConfig.length; i++) {
		frame[i] = getDeviceConfig[i]
	}
	for (var i = 0; i < privateinfo.length; i++) {
		frame[i + getDeviceConfig.length] = privateinfo[i]
	}

	setLenthRegion(frame, arrayLenIndex, privateinfo.length, 2)
	setLenthRegion(frame, paramLenIndex, privateinfo.length + 2, 2)
	setLenthRegion(frame, msgLenIndex, frame.length - 19, 4)

	comm_llrp_encodeRS(frame, frame.length)
	var senddata = new Uint8Array(SendLen);
	for (var i = 0; i < SendLen; i++) {
		senddata[i] = SendFrame[i]
	}

	var sdata = ab2hex(senddata)
	console.log('发送数据帧：', sdata)

	sendCmd(senddata);
}

//设置长度区域
const setLenthRegion = (buff, index, len, size) => {
	for (var i = 0; i < size; i++) {
		buff[index++] = (len >> (size - i - 1) * 8) & 0xff;
	}
}

//获取安全模块随机数
export const readRandom = () => {
	var privateinfo = new Uint8Array(2)
	privateinfo[0] = 0x62
	privateinfo[1] = 0x0
	getDeviceSecConfig(privateinfo)
}

//添加User区 RO识读 0,4,10为user0  1,4,9为user1
export const addUserSelectSpec = (memback, offset, length) => {
	var inventreadro = [0xaa, 0xbb, 0xcc, 0xdd, 0x11, 0x22, 0x33, 0x44, 0x01, 0x01, 0x90, 0x00, 0x00, 0x00, 0x43, 0x00, 0x00, 0x00, 0xcf,
		0x01, 0x90, 0x00, 0x3f, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x91, 0x00, 0x01, 0x00, 0x01, 0x94, 0x00, 0x05, 0x00, 0x00, 0x00, 0x00, 0x00,
		0x01, 0x95, 0x00, 0x1d, 0x00, 0x01, 0x01, 0x01, 0x96, 0x00, 0x05, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x98, 0x00, 0x0d, 0x00, 0x00, 0x00, 0x01,
		0x01, 0x99, 0x00, 0x05, 0x00, 0x00, 0x04, 0x00, 0x0a, 0x01, 0x9a, 0x00, 0x05, 0x02, 0x00, 0x00, 0xdf, 0x80];

	var membackindex = 72;

	inventreadro[membackindex] = memback;
	inventreadro[membackindex + 2] = offset;
	inventreadro[membackindex + 4] = length;

	comm_llrp_encodeRS(inventreadro, inventreadro.length);

	var sendDataUp = new Uint8Array(SendLen);
	for (var i = 0; i < SendLen; i++) {
		sendDataUp[i] = SendFrame[i]
	}

	sendCmd(sendDataUp);
}

//添加AO读规则
//添加User区 AO识读 0, 4, 10为user0  1, 4, 9为user1
export const addAOReadSpec = (memback, offset, length) => {
	var addTagReadAO = [
		0xaa, 0xbb, 0xcc, 0xdd, 0x11, 0x22, 0x33, 0x44, 0x01, 0x01, 0xc2, 0x00, 0x00, 0x00, 0x4a, 0x00, 0x00, 0x00, 0xd0, //19
		0x01, 0xc2, 0x00, 0x46, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x01, 0x01, 0x00, 0x80, 0x01, 0xc3, 0x00, 0x03, 0x00, 0x00,       //40
		0x01, 0x01, 0xc4, 0x00, 0x2b, 0x01, 0xc5, 0x00, 0x1c, 0x01, 0xc6, 0x00, 0x18, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00,       //60
		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0xe8, 0x99, 0x00, 0x05, 0x08, 0x2c, 0x78, 0x78, //77
		0x01, 0xc7, 0x00, 0x07, 0x00, 0x05, 0x00, 0x00, 0x04, 0x00, 0x0a, 0x01, 0xc9, 0x00, 0x01, 0x00];

	var frame = new Uint8Array(addTagReadAO.length);
	for (var i = 0; i < addTagReadAO.length; i++) {
		frame[i] = addTagReadAO[i]
	}

	var membankIndex = 83;
	var offsetIndex = 85;
	var lengthIndex = 87;
	setLenthRegion(frame, lengthIndex, length, 1);
	setLenthRegion(frame, offsetIndex, offset, 1);
	setLenthRegion(frame, membankIndex, memback, 1);

	comm_llrp_encodeRS(frame, frame.length);
	if (SendLen > 0) {
		var senddata = new Uint8Array(SendLen);
		for (var i = 0; i < SendLen; i++) {
			senddata[i] = SendFrame[i]
		}

		var sdata = ab2hex(senddata)
		console.log('发送AO读数据帧：', sdata)

		sendCmd(senddata);
	}
}

//将llrp协议数据编码
export const comm_llrp_encodeRS = (frame, len) => {
	SendLen = 0;
	SendFrame[SendLen++] = 0x7e;
	SendFrame[SendLen++] = 0x0;
	SendFrame[SendLen++] = 0x0;
	for (var i = 0; i < len; i++) {
		switch (frame[i]) {
			case 0x7d://125
				SendFrame[SendLen++] = 0x7d;
				SendFrame[SendLen++] = 0x5d;
				break;
			case 0x7e:
				SendFrame[SendLen++] = 0x7d;
				SendFrame[SendLen++] = 0x5e;
				break;
			default:
				SendFrame[SendLen++] = frame[i];
				break;
		}
	}

	var crc = comm_llrp_calCrc(frame, len, 0);

	var crcHigh = (crc >> 8) & 0xff;
	if (crcHigh == 0x7d) {
		SendFrame[SendLen++] = 0x7d;
		SendFrame[SendLen++] = 0x5d;
	}
	else if (crcHigh == 0x7e) {
		SendFrame[SendLen++] = 0x7d;
		SendFrame[SendLen++] = 0x5e;
	}
	else {
		SendFrame[SendLen++] = crcHigh;
	}

	var crcLow = crc & 0xff;
	if (crcLow == 0x7d) {
		SendFrame[SendLen++] = 0x7d;
		SendFrame[SendLen++] = 0x5d;
	}
	else if (crcLow == 0x7e) {
		SendFrame[SendLen++] = 0x7d;
		SendFrame[SendLen++] = 0x5e;
	}
	else {
		SendFrame[SendLen++] = crcLow;
	}

	SendFrame[SendLen++] = 0x7e;

	return SendLen;
}

//添加私有写AO规则 tid写标签tid Uint8Array privateWriteData私有写数据 Uint8Array
//写入--即writeRules 添加AO addAO 
export const addPrivateWriteAOSpec = (tid, privateWriteData) => {
	//私有写AO规则
	var addPrivateWriteAO = [0xaa, 0xbb, 0xcc, 0xdd, 0x11, 0x22, 0x33, 0x44, 0x01, 0x01, 0xc2, 0x00, 0x00, 0x00, 0x6a, 0x00, 0x00, 0x00, 0xd0, 0x01,
		0xc2, 0x00, 0x66, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x01, 0x01, 0x00, 0x80, 0x01, 0xc3, 0x00, 0x03, 0x00, 0x00,
		0x01, 0x01, 0xc4, 0x00, 0x4b, 0x01, 0xc5, 0x00, 0x1c, 0x01, 0xc6, 0x00, 0x18, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0xff,
		0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x00, 0x40, 0xe8, 0x99, 0x00, 0x05, 0x08, 0x2c, 0x78, 0x78, 0x01, 0xcb, 0x00,
		0x27, 0x00, 0x04, 0x00, 0x00, 0x11, 0x01, 0xc9, 0x00, 0x01, 0x00];

	var frame = new Uint8Array(addPrivateWriteAO.length + privateWriteData.length);
	for (var i = 0; i < addPrivateWriteAO.length; i++) {
		frame[i] = addPrivateWriteAO[i]
	}

	for (var i = 0; i < 5; i++) {
		frame[i + frame.length - 5] = addPrivateWriteAO[i + addPrivateWriteAO.length - 5]
	}

	for (var i = 0; i < privateWriteData.length; i++) {
		frame[i + addPrivateWriteAO.length - 5] = privateWriteData[i]
	}

	var msgLenIndex = 11;
	var param450lenIndex = 21;
	var param452lenIndex = 43;
	var tidIndex = 69;
	var param459lenIndex = 79;
	var arraylenIndex = 84;
	setLenthRegion(frame, arraylenIndex, privateWriteData.length / 2, 2);
	setLenthRegion(frame, param459lenIndex, privateWriteData.length + arraylenIndex - param459lenIndex, 2);
	setLenthRegion(frame, param452lenIndex, privateWriteData.length + arraylenIndex - param452lenIndex, 2);
	setLenthRegion(frame, param450lenIndex, frame.length - 23, 2);
	setLenthRegion(frame, msgLenIndex, frame.length - 19, 4);

	for (var i = 0; i < 8; i++) {
		frame[i + tidIndex] = tid[i]
	}

	comm_llrp_encodeRS(frame, frame.length);
	if (SendLen > 0) {
		var senddata = new Uint8Array(SendLen);
		for (var i = 0; i < SendLen; i++) {
			senddata[i] = SendFrame[i]
		}

		var sdata = ab2hex(senddata)
		console.log('发送私有写数据帧：', sdata)

		sendCmd(senddata);
	}
}



// ArrayBuffer转16进度字符串示例
export const ab2hex = (buffer) => {
	const hexArr = Array.prototype.map.call(new Uint8Array(buffer), function (bit) {
		return ('00' + bit.toString(16)).slice(-2)
	})
	return hexArr.join('')
}


/**
 * 
 *发送蓝牙指令 指令分包发送  start
 */

let tagsStore = ''; //获取store里面的blueToothInit
//写入蓝牙
export const sendCmd = (data) => {
	const buffer = new ArrayBuffer(data.length)

	const dataView = new DataView(buffer)
	data.forEach((item, index) => {
		dataView.setUint8(index, item)
	})

	tagsStore = useTagsStore()
	// const {blueToothInit } = storeToRefs(tagsStore) // 识读电子标识的具体内容

	writeFun(buffer);
}

//分包写入
const writeFun = (buffer) => {
	const packageSize = 20 //分包大小
	if (buffer.byteLength <= packageSize) { //如果小于20直接发送，不再继续调用
		console.log('~~执行发送指令Last~~');

		uni.writeBLECharacteristicValue({
			// 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
			deviceId: tagsStore.blueToothInit.deviceId,
			// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
			serviceId: tagsStore.blueToothInit.serviceId ? tagsStore.blueToothInit.serviceId : '0000FFE0-0000-1000-8000-00805F9B34FB',
			// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
			characteristicId: tagsStore.blueToothInit.characteristicId ? tagsStore.blueToothInit.characteristicId : '0000FFE9-0000-1000-8000-00805F9B34FB',
			// 这里的value是ArrayBuffer类型
			value: buffer,
			success (res) {
				console.log('writeBLECharacteristicValue success', res.errMsg)
			},
			fail (err) {
				console.log(err);

			}
		})
	} else {
		console.log('~~执行发送指令~~');

		const newData = buffer.slice(packageSize)
		const writeBuffer = buffer.slice(0, packageSize)
		uni.writeBLECharacteristicValue({
			// 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
			deviceId: tagsStore.blueToothInit.deviceId,
			// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
			serviceId: tagsStore.blueToothInit.serviceId ? tagsStore.blueToothInit.serviceId : '0000FFE0-0000-1000-8000-00805F9B34FB',
			// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
			characteristicId: tagsStore.blueToothInit.characteristicId ? tagsStore.blueToothInit.characteristicId : '0000FFE9-0000-1000-8000-00805F9B34FB',
			// 这里的value是ArrayBuffer类型
			value: writeBuffer,
			success (res) {
				console.log('writeBLECharacteristicValue success', res.errMsg)
				setTimeout(() => {
					writeFun(newData);
				}, 200)
			},
		})
	}
}

/**
 * 
 *发送蓝牙指令 指令分包发送  end
 */