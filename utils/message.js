import { ref } from 'vue'
import { auth } from '../api'


const carNumberLabel = { 'A': '000000', 'B': '000001', 'C': '000010', 'D': '000011', 'E': '000100', 'F': '000101', 'G': '000110', 'H': '000111', 'I': '', 'J': '001001', 'K': '001010', 'L': '001011', 'M': '001100', 'N': '001101', 'O': '', 'P': '001111', 'Q': '010000', 'R': '010001', 'S': '010010', 'T': '010011', 'U': '010100', 'V': '010101', 'W': '010110', 'X': '010111', 'Y': '011000', 'Z': '011001', '0': '011010', '1': '011011', '2': '011100', '3': '011101', '4': '011110', '5': '011111', '6': '100000', '7': '100001', '8': '100010', '9': '100011' };
//解析车牌
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
	return parseInt(carNumberTotal).toString(2);

}

//解析行车记录仪编号
export const analysisJlyCID = (jlyCid) => {
	console.log(jlyCid);
	if (/[A-Z]/.test(jlyCid)) {  //存在字母 true
		let _len = 5;
		let cidFirst = jlyCid.substr(0, 5);
		let cidFirstArr = cidFirst.split('');
		let cidFirstTotal = 0;
		cidFirstArr.forEach((item, index) => {
			cidFirstTotal += parseInt(carNumberLabel[item], 2) * Math.pow(36, _len - index - 1);
		})

		return parseInt(cidFirstTotal).toString(2) + '' + parseInt(jlyCid.substr(5), 10).toString(2); //需要补0
	} else {
		return parseInt(jlyCid, 10).toString(2);
	}
}