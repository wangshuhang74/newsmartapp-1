import { http } from "../utils/http";

// const url_notoken = ['/app/addUser', '/app/compareVersion', '/app/addOrgUser', '/account/login', '/account/forgetPassword'];

// noAuth 为 true 表示不需要token

// /account/login 用户登录
export const login = (params) => {
    return http.post("/account/login", params, { custom: { noAuth: true } });
};

// /account/logout  退出登录
export const logout = (params) => {
    return http.post("/account/logout", params, { custom: { noAuth: true } });
};

// /app/addUser 注册账号
export const addUser = (params) => {
    return http.post("/app/addUser", params, { custom: { noAuth: true } });
};

// /app/addOrgUser
// 注册企业账号
export const addOrgUser = (params) => {
    return http.post("/app/addOrgUser", params, { custom: { noAuth: true } });
};

// /common/sendCode 发送验证码
export const sendCode = (phone) => {
    return http.post(`/common/sendCode${phone ? '?phone=' + phone : ''}`, {}, { custom: { noAuth: true } });
};

// /account/updPassword 修改密码
export const updPassword = (params) => {
    return http.post("/account/updPassword", params,);
};
// /account/forgetPassword 忘记密码 
export const forgetPassword = (params) => {
    return http.post("/account/forgetPassword", params, { custom: { noAuth: true } });
};

// /account/getUserArchive // 获取用户档案
export const getUserArchive = () => {
    return http.post("/account/getUserArchive",);
};

// /account/removeUserTag?tagId=1 // 删除用户标签
export const removeUserTag = (tagId) => { 
    return http.post(`/account/removeUserTag${tagId ? '?tagId=' + tagId : ''}`,);
};

// /app/getPayClient // 获取付款企业
export const getPayClient = () => {
    return http.post("/app/getPayClient",);
};

// /app/userPayment // 确认用户付款
export const userPayment = (params) => {
    return http.post("/app/userPayment", params);
};

// /account/getPhoneLoginHistory // 获取手机登录历史
// phoneId
export const getPhoneLoginHistory = (phoneId) => {
    return http.post(`/account/getPhoneLoginHistory${phoneId ? '?phoneId=' + phoneId : ''}`);
};