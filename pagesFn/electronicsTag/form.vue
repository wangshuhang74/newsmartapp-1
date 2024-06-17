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
							<input type="text" class="boxFlex" value="" placeholder="自识别" />
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>行驶记录仪安全芯片ID</text>
							<input type="text" class="boxFlex" value="" placeholder="自识别" />
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
							<input type="text" class="boxFlex" v-model="tagsInfo.FPDH" placeholder="自识别/请输入" />
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
							<input type="text" class="boxFlex" v-model="tagsInfo.CLLX" placeholder="自识别/请输入" />
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
	<view class="car-number-container" v-if="showKeyboard">
		<view class="plate-close" @tap="closeProvince"><text class="plate-close-btn">关闭</text></view>
		<view class="plate-popup-list">
			<view class="plate-popup-item province-item" v-for="(item, index) in keyProvince1" :key="index"
				@tap="tapKeyboard(item)">{{ item }}</view>
		</view>
		<view class="plate-popup-list">
			<view class="plate-popup-item province-item" v-for="(item, index) in keyProvince2" :key="index"
				@tap="tapKeyboard(item)">{{ item }}</view>
		</view>
		<view class="plate-popup-list">
			<view class="plate-popup-item province-item" v-for="(item, index) in keyProvince3" :key="index"
				@tap="tapKeyboard(item)">{{ item }}</view>
		</view>
		<view class="plate-popup-list">
			<view class="plate-popup-item province-item" v-for="(item, index) in keyProvince4" :key="index"
				@tap="tapKeyboard(item)">{{ item }}</view>
			<!-- 删除 -->
			<!-- <view class="plate-popup-item province-item del" @click="onPlateDelTap">
				<image :src="deleteImgBase64" />
			</view> -->
		</view>
	</view>
</template>

<script setup>
import navbar from '@/pages/components/navbar.vue'
import { storeToRefs } from 'pinia'
import { useTagsStore } from '@/store'
const tagsStore = useTagsStore()
const { tagsInfo } = storeToRefs(tagsStore) // 识读电子标识的具体内容
console.log(tagsInfo.value);

const showKeyboard = ref(false);
const keyProvince1 = ref(['京', '津', '晋', '冀', '蒙', '辽', '吉', '黑', '沪']);
const keyProvince2 = ref(['苏', '浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘']);
const keyProvince3 = ref(['粤', '桂', '琼', '渝', '川', '贵', '云', '藏']);
const keyProvince4 = ref(['陕', '甘', '青', '宁', '新']);
// const deleteImgBase64 = ref("data:image/png;base64,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");
const openProvince = () => {
	showKeyboard.value = true;
}
const closeProvince = () => {
	showKeyboard.value = false;
}
const tapKeyboard = (e) => {
	console.log(e);
	tagsInfo.value.SFDM = e;
}



const confirm = () => {
	console.log('confirm');

	console.log(JSON.stringify(tagsInfo.value));

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
}

.car-number-container {
	position: fixed;
	z-index: 999;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 254px;
	background-color: #E3E2E7;
	-webkit-box-shadow: 0 0 30upx rgba(0, 0, 0, 0.1);
	box-shadow: 0 0 30upx rgba(0, 0, 0, 0.1);
	overflow: hidden;
	text-align: center;

	.plate-close {
		height: 40px;
		line-height: 40px;
		text-align: right;
		background-color: #FFF;

		.plate-close-btn {
			font-size: 13.5px;
			color: #555;
			margin-right: 15px;
		}
	}

	//键盘主体内容-单行
	.plate-popup-list {
		margin: 0 auto;
		overflow: hidden;
		display: inline-block;
		display: table;

		&:last-child {
			margin-bottom: 2px;
		}
	}

	//键盘主体内容-单个
	.plate-popup-item {
		float: left;
		font-size: 16px;
		width: 8vw;
		margin: 0 1vw;
		margin-top: 8px;
		height: 40px;
		line-height: 40px;
		background: #FFFFFF;
		border-radius: 5px;
		color: #4A4A4A;

		image {
			width: 16px;
			height: 16px;
			margin: 12px auto;
		}
	}

	.plate-popup-item:active {
		background-color: #EAEAEA;
	}

	.province-item {
		width: 8.8vw;
	}

	.lock-item {
		color: #AAA;
	}
}
</style>