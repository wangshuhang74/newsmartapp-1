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

