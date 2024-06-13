/**
 * @version 3.0.5
 * @Author lu-ch
 * @Email webwork.s@qq.com
 * 文档: https://www.quanzhan.co/luch-request/
 * github: https://github.com/lei-mu/luch-request
 * DCloud: http://ext.dcloud.net.cn/plugin?id=392
 * HBuilderX: beat-3.0.4 alpha-3.0.4
 */
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'
import Request from "luch-request";
const { token } = storeToRefs(useUserStore()); // 解构pinia的store
console.log("🚀 ~ token:", token)

//export const baseURL = "http://192.168.2.111:8080"
// export const baseURL = "https://sharingops.huayuresearch.com/api"
export const baseURL = "https://sharingops.huayuresearch.com/api";
const http = new Request();
http.setConfig((config) => {
  /* 设置全局配置 */
  config.baseURL = baseURL; /* 根域名不同 */
  config.header = {
    ...config.header,
    // a: "1", // 演示
  };
  return config;
});

http.interceptors.request.use(
  (config) => {
    /* 请求之前拦截器。可以使用async await 做异步操作 */
    config.header = {
      ...config.header,
    };
    const url_notoken = ['/app/login/alipayLogin', '/app/login/phoneLogin', '/app/login/getWxUserPhone', '/app/login/wxPayLogin', '/app/login/sendSms', '/app/login/getAlipayPhone2', '/app/index/getCityCodeByLat', '/system/sysProtocol/getOneProtocol'];
    if (token.value) {
      config.header.Authorization = token.value;
    } else if (!url_notoken.includes(config.url)) {
      // 未登录跳转登录
      uni.navigateTo({
        url: "/pages/login/login",
      });
      return Promise.reject(config); //如果token不存在，return Promise.reject(config) 会取消本次请求
    }
    return config;
  },
  (config) => {
    return Promise.reject(config);
  }
);

http.interceptors.response.use(
  async (response) => {
    /* 请求之后拦截器。可以使用async await 做异步操作  */
    if (response.statusCode == 200 && response.data.code == 0) {
      //console.log("请求成功", response);
    } else {
      uni.hideLoading();
      setTimeout(() => {
        uni.showToast({
          title: response.data.msg,
          icon: "none"
        });
      }, 100)

      if (response.data.code == 401) {
        // 未登录跳转登录
        const { logout } = useAuthStore();
        logout();
        uni.navigateTo({
          url: "/pages/login/login",
        });
      }
    }
    return response.data;

    // 服务端返回的状态码不等于200，则reject()
    // return Promise.reject(response);

  },
  (response) => {
    // 请求错误做点什么。可以使用async await 做异步操作
    return Promise.reject(response);
  }
);

export { http };
