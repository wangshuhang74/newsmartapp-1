<template>
	<view>
		<view v-if="loaded || list.itemIndex < 15" class="uni-indexed-list__title-wrapper">
			<text v-if="list.items && list.items.length > 0" class="uni-indexed-list__title">{{ list.key }}</text>
		</view>
		<view v-if="(loaded || list.itemIndex < 15) && list.items && list.items.length > 0"
			class="uni-indexed-list__list">
			<view v-for="(item, index) in list.items" :key="index" class="uni-indexed-list__item"
				hover-class="uni-indexed-list__item--hover">
				<view class="uni-indexed-list__item-container" @click="onClick(idx, index)">
					<view class="uni-indexed-list__item-border"
						:class="{'uni-indexed-list__item-border--last':index===list.items.length-1}">
						<view v-if="showSelect" style="margin-right: 20rpx;">
							<uni-icons :type="item.checked ? 'checkbox-filled' : 'circle'"
								:color="item.checked ? '#007aff' : '#C0C0C0'" size="24" />
						</view>
						<view class="uni-list-item lxx-index-list-item">
							<view class="uni-list-item__container">
								<image class="lxx-index-slot-image"
								:src="fileUrl + item.name.avatar" 
								@error="imageError($event,index)" v-if="item.name.avatar"></image>
								<image class="lxx-index-slot-image"
								src="/static/images/account/default.png" v-else></image>
								<view class="uni-list-item__content">
									<text class="uni-list-item__content-title">
										{{ item.name.username }}
									</text>
									<text  class="uni-list-item__content-note">
										{{ item.name.deptName }}
									</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'UniIndexedList',
		emits: ['itemClick'],
		props: {
			loaded: {
				type: Boolean,
				default: false
			},
			idx: {
				type: Number,
				default: 0
			},
			list: {
				type: Object,
				default () {
					return {}
				}
			},
			fileUrl: {
				type: String,
				default: ''
			},
			showSelect: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			imageError(e, index) {
				this.list.items[index]['name']['avatar'] = null;
			},
			onClick(idx, index) {
				this.$emit("itemClick", {
					idx,
					index
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.lxx-index-list-item {
		width: 100%;
		padding: 8px 0;

		.uni-list-item__container {
				position: relative;
				display: flex;
				flex-direction: row;
				padding: 0;
				padding-left: 15px;
				flex: 1;
				overflow: hidden;
		}
		.uni-list-item__content {
		    display: flex;
		    padding-right: 8px;
		    flex: 1;
		    color: #3b4144;
		    flex-direction: column;
		    // justify-content: space-between;
		    overflow: hidden;
				font-size: 14px;
		}
		.uni-list-item__content-title {
		    font-size: 14px;
		    color: #3b4144;
		    overflow: hidden;
			margin-bottom: 4rpx;
		}
		.uni-list-item__content-note {
		    margin-top: 0.1875rem;
		    color: #999;
		    font-size: 12px;
		    overflow: hidden;
		}

		.lxx-index-slot-image {
			width: 40px;
			height: 40px;
			border-radius: 40px;
			margin-right: 15px;
			:deep(img) {
				width: 40px;
				height: 40px;
			}

		}
	}

	.uni-indexed-list__list {
		background-color: #FFFFFF;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		border-top-style: solid;
		border-top-width: 0;
		border-top-color: #DEDEDE;
	}

	.uni-indexed-list__item {
		font-size: 14px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.uni-indexed-list__item-container {
		padding-left: 15px;
		flex: 1;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.uni-indexed-list__item-border {
		flex: 1;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		// height: 50px;
		padding: 0 15px;
		padding-left: 0;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #F3F3F3;
	}

	.uni-indexed-list__item-border--last {
		border-bottom-width: 0px;
	}

	.uni-indexed-list__item-content {
		flex: 1;
		font-size: 14px;
		color: #191919;
	}

	.uni-indexed-list {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-indexed-list__title-wrapper {
		/* #ifndef APP-NVUE */
		display: flex;
		width: 100%;
		/* #endif */
		background-color: #F7F7F7;
	}

	.uni-indexed-list__title {
		padding: 6px 12px;
		line-height: 24px;
		font-size: 16px;
		font-weight: 500;
	}
</style>
