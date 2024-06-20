// 防抖函数实现
export function debounce(func, wait) {
    let timeoutId; // 用来存储定时器的返回值

    // 返回一个包装后的函数，在这个函数中处理防抖逻辑
    return function (...args) {
        // 如果timeoutId存在，说明前一次延迟执行还没有完成，则清除它
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // 重新设置定时器，延迟执行func函数
        timeoutId = setTimeout(() => {
            func.apply(this, args); // 执行func函数，并传入参数
        }, wait);
    };
}

// // 使用防抖装饰searchInput函数
// const searchInputDebounced = debounce(() => {
//     console.log('searchInput', getForm.value.search);
// }, 1000); // 第二个参数是延迟时间，单位为毫秒

export const toNavigation = (val) => {
    console.log("打开导航", val);
    if (!val.lat || !val.lng) {
        uni.showToast({
            title: '暂无坐标信息',
            icon: 'none'
        })
        return
    }
    val.lat = Number(val.lat)
    val.lng = Number(val.lng)
    if (typeof val.lat !== 'number' || typeof val.lng !== 'number') {
        uni.showToast({
            title: '坐标信息错误',
            icon: 'none'
        })
        return
    }
    uni.openLocation({
        longitude: val.lng,//经度
        latitude: val.lat, //纬度
        name: val.clientName + '-' + val.carPlate,
        address: val.address,
        success: function () {
            console.log('success');
        },
        fail: function (err) {
            console.log('err', err);
        },
    });
}


export const makePhoneCall = (phone) => {
    uni.makePhoneCall({
        phoneNumber: phone,
        success() {
            console.log('拨打电话成功');
        },
        fail(err) {
            console.error('拨打电话失败', err);
        }
    });
}


export const toWeChatAccount = (filePath) => {
    // qr_code
    // uni.showLoading({
    //   title: '加载中...'
    // });
    uni.downloadFile({ //下载文件资源到本地,返回文件的本地临时路径
        url: filePath, //网络路径
        success: (res) => {
            var imageUrl = res.tempFilePath;//临时文件路径
            // console.log("imageUrl", imageUrl);
            uni.saveImageToPhotosAlbum({ //保存到系统相册
                filePath,
                success: (res) => {
                    Toast.success('保存成功');
                    firmIdShow.value = false
                },
                fail: (err) => {
                    Toast.error('保存失败');
                }
            })
        }
    })
}