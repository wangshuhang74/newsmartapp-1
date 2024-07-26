import { http } from "../utils/http";

// /order/getAppTodoNum
export const getAppTodoNum = () => {
    return http.post("/order/getAppTodoNum", {}, {});
}

// /flowable/task/todoList // 获取工单列表
export const getList = (params) => {
    return http.post("/flowable/task/todoList", params, {});
}
// /order/acceptOrder?orderId=
// /order/backOrder?orderId=

export const acceptOrder = (orderId) => { // 接单
    return http.post(`/order/acceptOrder${orderId ? "?orderId=" + orderId : ''}`,);
}

export const backOrder = (orderId) => {//返还订单
    return http.post(`/order/backOrder${orderId ? "?orderId=" + orderId : ''}`,);
}

export const getAppOrderManager = (orderId) => {// 获取上级
    return http.post(`/order/getAppOrderManager${orderId ? "?orderId=" + orderId : ''}`,);
}

// /flowable/task/complete // 指派 / 审核
export const complete = (params) => {
    return http.post("/flowable/task/complete", params, {});
}

// /user/getWorkUser // 获取联系人选项
export const getWorkUser = () => {
    return http.post("/user/getWorkUser",);
}

///flowable/task/finishedList // 历史记录
export const finishedList = (params) => {
    return http.post("/flowable/task/finishedList", params, {});
}

// /client/getClientOption //获取客户选项
export const getClientOption = () => {
    return http.post("/client/getClientOption",);
}


// /account/getWorkerList // 获取运维工程师
export const getWorkerList = () => {
    return http.post("/account/getWorkerList",);
}

// /order/getAppOrderInfo?orderId=2081 // 获取工单详情
export const getAppOrderInfo = (orderId) => {
    return http.post(`/order/getAppOrderInfo${orderId ? "?orderId=" + orderId : ''}`,);
}
// /order/appDisposeOrder //处理工单
export const appDisposeOrder = (params) => {
    return http.post("/order/appDisposeOrder", params, {});
}

// /order/appSavePreOrder 暂存
export const appSavePreOrder = (params) => {
    return http.post("/order/appSavePreOrder", params, {});
}

// /order/appDisposeOrderInfo // 处理详情-回显
export const appDisposeOrderInfo = (params) => {
    return http.post("/order/appDisposeOrderInfo", params, {});
}

///driveRecord/getBySerial 行车记录仪获取车辆信息
export const getBySerial = (key, params) => {
    return http.get("/driveRecord/getBySerial?" + key + "=" + params, {}, {});
}

///driveRecord/update 行车记录仪更新
export const update = (params) => {
    return http.post("/driveRecord/update", params, {});
}