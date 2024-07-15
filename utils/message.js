import { ref } from 'vue'
import { auth } from '../api'
import crc32 from 'crc/crc32';


const carNumberLabel = { 'A': '000000', 'B': '000001', 'C': '000010', 'D': '000011', 'E': '000100', 'F': '000101', 'G': '000110', 'H': '000111', 'I': '', 'J': '001001', 'K': '001010', 'L': '001011', 'M': '001100', 'N': '001101', 'O': '', 'P': '001111', 'Q': '010000', 'R': '010001', 'S': '010010', 'T': '010011', 'U': '010100', 'V': '010101', 'W': '010110', 'X': '010111', 'Y': '011000', 'Z': '011001', '0': '011010', '1': '011011', '2': '011100', '3': '011101', '4': '011110', '5': '011111', '6': '100000', '7': '100001', '8': '100010', '9': '100011' };
//解析车牌 32位二进制
export const analysisCarNumber = (carNumber) => {
	let _len = carNumber.length;
	let carNumberArr = carNumber.split('');
	let carNumberTotal = 0;
	carNumberArr.forEach((item, index) => {
		carNumberTotal += parseInt(carNumberLabel[item], 2) * Math.pow(36, _len - index - 1);
	})

	if (_len == 4) {
		carNumberTotal = carNumberTotal;
	} else if (_len == 5) {
		carNumberTotal += Math.pow(36, 4);
	} else if (_len == 6) {
		carNumberTotal += Math.pow(36, 4) + Math.pow(36, 5);
	}

	let carNumberBinary = parseInt(carNumberTotal).toString(2);
	if (carNumberBinary.length < 32) {
		carNumberBinary = addZeroBefore(carNumberBinary, 32)
	}
	return carNumberBinary;

}

//解析行车记录仪编号
export const analysisJlyCID = (jlyCid) => {
	console.log(jlyCid);
	//记录仪编号由5位字母数字编码 + 8位数字编号组成。
	// if (/[A-Z]/.test(jlyCid)) {  //存在字母 true
	let _len = 5;
	let cidFirst = jlyCid.substr(0, 5);
	let cidFirstArr = cidFirst.split('');
	let cidFirstTotal = 0;
	cidFirstArr.forEach((item, index) => {
		cidFirstTotal += parseInt(carNumberLabel[item], 2) * Math.pow(36, _len - index - 1);
	})

	let cidFirstBinary = parseInt(cidFirstTotal).toString(2);
	if (cidFirstBinary.length < 26) {
		cidFirstBinary = addZeroBefore(cidFirstBinary, 26)
	}

	let cidSecondBinary = parseInt(jlyCid.substr(5), 10).toString(2);
	if (cidSecondBinary.length < 27) {
		cidSecondBinary = addZeroBefore(cidSecondBinary, 27)
	}
	return cidFirstBinary + '' + cidSecondBinary;
	// } else {
	// 	return parseInt(jlyCid, 10).toString(2);
	// }
}

//个性化发卡对标签下半区校验
//使用CRC8算法计算获得CRC8校验位。计算校验位算法参数如下:1、顺序按照高位优先的原则进行计算（MSBFirst）（与空口协议规定一致）2、生成多项式为3、初始值FFh
export const crc_high_first = (buffer, len) => {
	var crc = 0xff;            /* 计算的初始crc值 */

	for (var j = 0; j < len; j++) {
		crc ^= buffer[j] & 0xff;               /* 每次先与需要计算的数据异或,计算完指向下一数据 */
		for (var i = 8; i > 0; --i)         /* 下面这段计算过程与计算一个字节crc一样 */ {
			if ((crc & 0x80) != 0)
				crc = ((crc << 1) ^ 0x31) & 0xff;
			else
				crc = (crc << 1) & 0xff;
		}
	}

	return (crc & 0xff);
}

export const binaryToHexArray = (binaryDataStr) => {
	// 确保二进制字符串长度是8的倍数，如果不是，可能需要填充或处理
	if (binaryDataStr.length % 8 !== 0) {
		console.error("二进制字符串长度必须是8的倍数");
		return;
	}

	let hexArray = []; //十六进制数组
	let hexStr = "";//十六进制字符串
	for (let i = 0; i < binaryDataStr.length; i += 8) {
		// 截取8位二进制并转换为16进制
		let hexTmp = parseInt(binaryDataStr.substr(i, 8), 2).toString(16).padStart(2, '0').toUpperCase();
		hexStr = hexStr + '' + hexTmp;
		hexArray.push('0x' + hexTmp);
	}

	let crc8Str = crc_high_first(hexArray, 17);

	hexStr = hexStr + '' + parseInt(crc8Str).toString(16).padStart(2, '0').toUpperCase();//添加crc校验
	return hexStr;
}

//crc32转十进制
export const crc32Decimal = (str) => {
	let crcBinary = crc32(str).toString(2); //crc32 后转二进制
	crcBinary = addZeroBefore(crcBinary, 32); //二进制前面补0 到32位
	crcBinary = "1" + crcBinary; //32位二进制前面补1 到33位
	console.log('crcBinary', crcBinary);
	let crcDec = parseInt(crcBinary, 2); //二进制转10进制
	return crcDec;
}


//二进制不够位，补0
export const addZeroBefore = (binary, num) => {
	while (binary.length < num) {
		binary = '0' + binary;
	}
	return binary;
}