/**
 * @version 3.0.5
 * @Author lu-ch
 * @Email webwork.s@qq.com
 * 文档: https://www.quanzhan.co/luch-request/
 * github: https://github.com/lei-mu/luch-request
 * DCloud: http://ext.dcloud.net.cn/plugin?id=392
 * HBuilderX: beat-3.0.4 alpha-3.0.4
 */
import Request from "luch-request";
// import { useUserStore } from "../store";  //访问pinia store需要异步延迟 否则会报错
// setTimeout(function () {
//   const useUser = useUserStore();
//   console.log('http5');
//   console.log('useUser', useUser.userInfo);
// }, 100)

export const baseURL = "https://fk-api.19056.cn:8443/api";
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
    //   if (token.value) {
    //     // config.header.Authorization = token.value;
    //   } else if (!config.custom.noAuth) { //接口配置不需要登录
    //     const { logout } = useAuthStore();
    //     logout();//store退出

    //   // 未登录跳转登录
    //   uni.navigateTo({
    //     url: "/pagesAccount/login/index",
    //   });
    //   return Promise.reject(config); //如果token不存在，return Promise.reject(config) 会取消本次请求
    // }
    console.log('http3');
    return config;
  },
  (config) => {
    return Promise.reject(config);
  }
);

http.interceptors.response.use(
  async (response) => {
    console.log('http4');
    console.log(response);
    /* 请求之后拦截器。可以使用async await 做异步操作  */
    if (response.statusCode == 200 && response.data.code == 0) {
      //console.log("请求成功", response);
    } else {
      // uni.hideLoading();
      // setTimeout(() => {
      uni.showToast({
        title: response.data.message,
        icon: 'error',
        duration: 2000
      });
      // }, 100)
      return;

      // if (response.data.code == 401) {
      //   // 未登录跳转登录
      //   const { logout } = useAuthStore();
      //   logout();
      //   uni.navigateTo({
      //     url: "/pagesAccount/login/index",
      //   });
      // }
    }
    return response.data;

    // 服务端返回的状态码不等于200，则reject()
    // return Promise.reject(response);

  },
  (response) => {
    console.log('http5');
    console.log(response);
    // 请求错误做点什么。可以使用async await 做异步操作
    return Promise.reject(response);
  }
);

export { http };
