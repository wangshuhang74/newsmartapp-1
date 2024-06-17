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
							<text>车牌号码</text>
							<input type="text" class="boxFlex" v-model="tagsInfo.PlateLicense" placeholder="自识别/请输入" />
						</view>
					</view>
					<view class="view_rows">
						<view class="disBox">
							<text>省份代码</text>
							<input type="text" class="boxFlex" v-model="tagsInfo.SFDM" placeholder="自识别/请输入" />
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
</template>

<script  setup>
import navbar from '@/pages/components/navbar.vue'

import { useTagsStore } from '@/store'
const tagsStore = useTagsStore()
const { tagsInfo } = storeToRefs(tagsStore) // 识读电子标识的具体内容
console.log(tagsInfo.value);

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
</style>