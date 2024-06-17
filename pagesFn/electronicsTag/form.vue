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
							<input type="text" class="boxFlex" v-model="tagsInfo.CID" placeholder="自识别" />
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>电子标识安全芯片ID</text>
							<input type="text" class="boxFlex" v-model="tagsInfo.TID" placeholder="自识别" />
						</view>
					</view>
				</view>

				<view class="view_tit disBox">汽车行驶记录仪信息</view>
				<view class="view_con">
					<view class="view_rows">
						<view class="disBox">
							<text>行驶记录仪编号</text>
							<input type="text" class="boxFlex" v-model="tagsInfo.jlyCID" placeholder="自识别" />
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>行驶记录仪安全芯片ID</text>
							<input type="text" class="boxFlex" v-model="tagsInfo.jlyID" placeholder="自识别" />
						</view>
					</view>
				</view>

				<view class="view_tit disBox">车辆信息</view>
				<view class="view_con">
					<view class="view_rows">
						<view class="disBox">
							<text>车牌类型</text>
							<input type="text" class="boxFlex" placeholder="自识别" />
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>省份代码</text>
							<!-- <input type="text" class="boxFlex" v-model="tagsInfo.SFDM" placeholder="请选择" readonly
								 /> -->
							<view class="boxFlex" @tap="openProvince">{{ tagsInfo.SFDM ? tagsInfo.SFDM : '请选择' }}</view>
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>车牌号码</text>
							<input type="text" class="boxFlex" v-model="tagsInfo.PlateLicense" placeholder="自识别/请输入" />
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>发牌代号</text>
							<!-- <input type="text" class="boxFlex" v-model="tagsInfo.FPDH" placeholder="自识别/请输入" /> -->
							<view class="boxFlex" @tap="openFPDH">{{ tagsInfo.FPDH ? tagsInfo.FPDH : '请选择' }}</view>
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>VIN码</text>
							<input type="text" class="boxFlex" placeholder="自识别/请输入" />
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>使用性质</text>
							<input type="text" class="boxFlex" v-model="tagsInfo.SYXZ" placeholder="自识别/请输入" />
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>出厂日期</text>
							<input type="text" class="boxFlex" v-model="tagsInfo.CCRQ" placeholder="自识别/请输入" />
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>车辆类型</text>
							<!-- <input type="text" class="boxFlex" v-model="tagsInfo.CLLX" placeholder="自识别/请选择" /> -->
							<wd-picker :columns="carTypeList" label="" v-model="tagsInfo.CLLX" @confirm="handleConfirm"
								placeholder="自识别/请输入" />
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>检验有效期</text>
							<input type="text" class="boxFlex" v-model="tagsInfo.JYYXQ" placeholder="自识别/请输入" />
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>强制报废期</text>
							<input type="text" class="boxFlex" v-model="tagsInfo.QZBFQ" placeholder="自识别/请输入" />
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>质量核载</text>
							<input type="text" class="boxFlex" v-model="tagsInfo.ZKZL" placeholder="自识别/请输入" />
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>车身颜色</text>
							<input type="text" class="boxFlex" v-model="tagsInfo.CSYS" placeholder="自识别/请输入" />
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>排量</text>
							<input type="text" class="boxFlex" v-model="tagsInfo.PL" placeholder="自识别/请输入" />
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>功率</text>
							<input type="text" class="boxFlex" v-model="tagsInfo.GL" placeholder="自识别/请输入" />
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
import navbar from '@/pages/components/navbar.vue'
import keyboard from '@/pages/components/keyboard.vue'
import { storeToRefs } from 'pinia'
import { useTagsStore } from '@/store'
const tagsStore = useTagsStore()
const { tagsInfo } = storeToRefs(tagsStore) // 识读电子标识的具体内容
console.log(tagsInfo.value);
import { analysisCarNumber,analysisJlyCID } from '@/utils/message'

const showKeyboard = ref(false);
const showKeyboard2 = ref(false);

const keyClick = (e) => {
	showKeyboard.value = e;
	showKeyboard2.value = e;
}


const SFDM_transfer = ref('');
const keyList = ref([
	[{ name: '京', value: '000001' }, { name: '津', value: '000010' }, { name: '冀', value: '000011' }, { name: '晋', value: '000100' }, { name: '蒙', value: '000101' }, { name: '辽', value: '000110' }, { name: '吉', value: '000111' }, { name: '黑', value: '001000' }, { name: '沪', value: '001001' }],
	[{ name: '苏', value: '001010' }, { name: '浙', value: '001011' }, { name: '皖', value: '001100' }, { name: '闽', value: '001101' }, { name: '赣', value: '001110' }, { name: '鲁', value: '001111' }, { name: '豫', value: '010000' }, { name: '鄂', value: '010001' }, { name: '湘', value: '010010' }],
	[{ name: '粤', value: '010011' }, { name: '桂', value: '010100' }, { name: '琼', value: '010101' }, { name: '渝', value: '010110' }, { name: '川', value: '010111' }, { name: '贵', value: '011000' }, { name: '云', value: '011001' }, { name: '藏', value: '011010' }],
	[{ name: '陕', value: '011011' }, { name: '甘', value: '011100' }, { name: '青', value: '011101' }, { name: '宁', value: '011110' }, { name: '新', value: '011111' }, { name: '港', value: '100000' }, { name: '澳', value: '100001' }]
]);
//打开SFDM
const openProvince = () => {
	showKeyboard.value = true;
}
const SFDMConfirm = (e) => {
	console.log(e);
	tagsInfo.value.SFDM = e.name;
	SFDM_transfer.value = e.value;
}



const FPDH_transfer = ref('');
const keyList2 = ref([
	[{ name: 'A', value: '00000' }, { name: 'B', value: '00001' }, { name: 'C', value: '00010' }, { name: 'D', value: '00011' }, { name: 'E', value: '00100' }, { name: 'F', value: '00101' }, { name: 'G', value: '00110' }, { name: 'H', value: '00111' }, { name: 'I', value: '01000' }],
	[{ name: 'J', value: '01001' }, { name: 'K', value: '01010' }, { name: 'L', value: '01011' }, { name: 'M', value: '01100' }, { name: 'N', value: '01101' }, { name: 'O', value: '01110' }, { name: 'P', value: '01111' }, { name: 'Q', value: '10000' }, { name: 'R', value: '10001' }],
	[{ name: 'S', value: '10010' }, { name: 'T', value: '10011' }, { name: 'U', value: '10100' }, { name: 'V', value: '10101' }, { name: 'W', value: '10110' }, { name: 'X', value: '10111' }, { name: 'Y', value: '11000' }, { name: 'Z', value: '11001' }],
]);

//打开FPDH
const openFPDH = () => {
	showKeyboard2.value = true;
}

const FPDHConfirm = (e) => {
	tagsInfo.value.FPDH = e.name;
	FPDH_transfer.value = e.value;
}


//CLLX
const carTypeList = ref([{ label: '大型汽车', value: '0001' }, { label: '小型汽车', value: '0010' }, { label: '使馆汽车', value: '0011' }, { label: '领馆汽车', value: '0100' }, { label: '境外汽车', value: '0101' }, { label: '外籍汽车', value: '0110' }, { label: '低速车', value: '0111' }, { label: '教练汽车', value: '1000' }, { label: '摩托车', value: '1001' }, { label: '新能源汽车', value: '1010' }, { label: '警用汽车', value: '1011' }, { label: '港澳两地车', value: '1100' }, { label: '武警车辆', value: '1101' }, { label: '军队车辆', value: '1110' }, { label: '其他车辆', value: '0000' }]);
function handleConfirm (value) {
	console.log(value);
	tagsInfo.value.CLLX = value.value;
}




const confirm = () => {
	console.log(JSON.stringify(tagsInfo.value));
	if (tagsInfo.value.PlateLicense) {  //车牌号码
		let PlateLicense = analysisCarNumber(tagsInfo.value.PlateLicense);
		console.log('车牌号码' + PlateLicense);
	}

	if (tagsInfo.value.jlyID) {  //行驶记录仪行驶记录仪安全芯片ID
		let jlyCID = parseInt(tagsInfo.value.jlyID, 10).toString(2);
		console.log('安全芯片' + jlyCID);
	}
	if (tagsInfo.value.jlyCID) {  //行驶记录仪编号
		let jlyCID = analysisJlyCID(tagsInfo.value.jlyCID);
		console.log('行驶记录仪编号' + jlyCID);		
	}

	console.log('省份代码' + SFDM_transfer.value);
	console.log('发牌代号' + FPDH_transfer.value);
	console.log('车辆类型' + tagsInfo.value.CLLX);

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