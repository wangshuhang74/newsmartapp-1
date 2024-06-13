import { http } from "../utils/http_sign";

export const auth = (params) => {
  return http.post("/card/auth", params, { custom: { noAuth: true } });
};
//获取微信access_token信息
// export const alipayLogin = (params: any) => {
//   return http.post("/app/login/alipayLogin", params, { custom: { noAuth: true } });
// };
