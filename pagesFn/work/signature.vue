<script setup>
import { useToast } from 'wot-design-uni' // ui组件库
import { baseURL } from '@/utils/http'

const Toast = useToast()
const upType = ref("")
const SignRef = ref(null);
onLoad((opt) => {
    upType.value = opt.upType;
})

const ClearSign = (e) => {
    SignRef.value[e]() // undo 上一步 clear 清空 
}

const SaveSign = () => {
    SignRef.value.canvasToTempFilePath({ //save 保存
        success: (res) => {
            // 是否为空画板 无签名
            console.log(res.isEmpty)
            if (res.isEmpty) return Toast.error('请签字')
            // 生成图片的临时路径
            // H5 生成的是base64
            // this.url = res.tempFilePath
            //返回上一页 并且传递参数
            uploadFileApi(res.tempFilePath)

            console.log("🚀 ~ ClearSign ~ res.tempFilePath:", res.tempFilePath)
        }
    })
}

const uploadFileApi = async (path) => { //上传图片接口
    uni.uploadFile({
        url: baseURL + "sysFile/uploadFile",
        filePath: path,
        name: "file",
        formData: {
            type: "",
            fileName: "工单图片",
            linkedId: "",
        },
        success: (uploadFileRes) => {
            const { data } = JSON.parse(uploadFileRes.data);
            uni.$emit('sign', {
                upType: upType.value,
                url: data.url
            })
            uni.navigateBack({
                delta: 1,
            })
        },
    });
}

</script>
<template>
    <wd-toast></wd-toast>
    <view class="signature_box">
        <view class="btns_box">
            <button class="btn" @tap="ClearSign('undo')">回退</button>
            <button class="btn" @tap="ClearSign('clear')">清除</button>
            <button class="btn" @tap="SaveSign()">保存</button>
        </view>
        <view class="tip_box" v-if="upType == 'userSign'">
            <text>经检查，本次安装/维护任务已完成，符合甲方（客户）要求，予以确认。</text>
        </view>
        <l-signature class="signature" landscape ref="SignRef"></l-signature>

    </view>
</template>

<style lang="scss" scoped>
.signature_box {
    width: 100vw;
    height: 100vh;
    padding: 30rpx;
    box-sizing: border-box;
    display: flex;

    .btns_box {
        width: 12%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 200rpx 0;
        box-sizing: border-box;
        position: relative;

        .btn {
            min-width: 120rpx;
            height: 48rpx;
            font-size: 24rpx;
            line-height: 48rpx;
            color: #FFFFFF;
            background: linear-gradient(90deg, #4557D1 0%, #75DBED 100%);
            border-radius: 7rpx 7rpx 7rpx 7rpx;
            margin: 0 20rpx 0 0;
            transform: rotate(90deg);

        }
    }

    .signature {
        width: 88%;
        height: 100%;
        border: 1px solid #000;
    }

    .tip_box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;

        // background-color: royalblue;
        text {
            position: absolute;
            // top: 20%;
            right: 40rpx;
            // height: 100%;
            width: 1080rpx;
            word-break: break-all;
            word-wrap: break-word;
            font-size: 32rpx;
            color: #9B9B9B;
            transform: rotate(90deg);
        }
    }

}
</style>
