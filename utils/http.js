/**
 * @version 3.0.5
 * @Author lu-ch
 * @Email webwork.s@qq.com
 * 文档: https://www.quanzhan.co/luch-request/
 * github: https://github.com/lei-mu/luch-request
 * DCloud: http://ext.dcloud.net.cn/plugin?id=392
 * HBuilderX: beat-3.0.4 alpha-3.0.4
 */
import {
	storeToRefs
} from 'pinia'
import {
	useUserStore
} from '../store'
import Request from "luch-request";


// export const baseURL = "http://192.168.2.122:8650/";
export const baseURL = "http://114.55.177.116:8650/";
const http = new Request();
http.setConfig((config) => {
	/* 设置全局配置 */
	config.baseURL = baseURL; /* 根域名不同 */
	config.header = {
		...config.header,
	};
	return config;
});

http.interceptors.request.use(
	(config) => {
		const {
			userInfo
		} = storeToRefs(useUserStore()); // 解构pinia的store
		const token = userInfo.value.token;
		// console.log("🚀 ~ token:", token)
		// /* 请求之前 拦截器。可以使用async await 做异步操作 */
		config.header = {
			...config.header,
		};
		if (token) {
			config.header.Authorization = token;
		} else if (!config.custom.noAuth) {
			// uni.navigateTo({
			// 	url: "/pagesAccount/login/index",
			// });
			// uni.showToast({
			// 	title: 'token不存在,请先登录',
			// 	icon: 'warning',
			// 	mask: true // 防止重复点击
			// })
			return Promise.reject(config); //如果token不存在，return Promise.reject(config) 会取消本次请求
		}
		// console.log("🚀 ~ config:", config)
		return config;
	},
	(config) => {
		return Promise.reject(config);
	}
);

http.interceptors.response.use(
	async (response) => {
		if (response.statusCode == 200 && response.data.code == 0) { } else {
			if (response.data.code == 401) {
				// 未登录跳转登录
				uni.navigateTo({
					url: "/pagesAccount/login/index",
				});
			}
		}
		return response.data;


	},
	(response) => {
		console.log("🚀 ~ response:", response)
		// uni.showToast({
		// 	title: response.errMsg,
		// 	icon: 'error',
		// 	duration: 2000
		// });
		// 请求错误做点什么。可以使用async await 做异步操作
		return Promise.reject(response);
	}
);

export {
	http
};