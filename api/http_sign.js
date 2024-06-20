import { http } from "../utils/http_sign";

export const auth = (params) => {
    console.log('http2' + params);
    return http.post("/card/auth", params, { custom: { noAuth: true }, sslVerify: false }); //uni.request https证书问题
};
export const writeData = (params) => {
    console.log('http2' + params);
    return http.post("/card/writeData", params, { custom: { noAuth: true }, sslVerify: false }); //uni.request https证书问题
};
