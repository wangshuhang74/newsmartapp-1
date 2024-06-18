import { http } from "../utils/http_sign";

export const auth = (params) => {
  console.log('http2' + params);
  return http.post("/card/auth", params, { custom: { noAuth: true }, sslVerify: false }); //uni.request https证书问题
};
export const writeData = (params) => {
  console.log('http2' + params);
  return http.post("/card/writeData", params, { custom: { noAuth: true }, sslVerify: false }); //uni.request https证书问题
};
//获取微信access_token信息
// export const alipayLogin = (params: any) => {
//   return http.post("/app/login/alipayLogin", params, { custom: { noAuth: true } });
// };
