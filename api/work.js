import { http } from "../utils/http";

// /order/getAppTodoNum
export const getAppTodoNum = () => {
    return http.post("/order/getAppTodoNum", {}, {});
}

// /flowable/task/todoList?pageNum=1&pageSize=10&type=5
export const getList = (params) => { // 获取工单列表
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

// /user/getWorkUser
export const getWorkUser = () => { // 获取联系人选项
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

// /order/appDisposeOrder //处理工单
export const appDisposeOrder = (params) => {
    return http.post("/order/appDisposeOrder", params, {});
}

// /account/getWorkerList // 运维工程师
export const getWorkerList = () => { // 获取运维工程师
    return http.post("/account/getWorkerList",);
}

// /order/getAppOrderInfo?orderId=2081 // 获取工单详情
export const getAppOrderInfo = (orderId) => {
    return http.post(`/order/getAppOrderInfo${orderId ? "?orderId=" + orderId : ''}`,);
}

// /order/appDisposeOrderInfo // 处理详情-回显
export const appDisposeOrderInfo = (params) => {
    return http.post("/order/appDisposeOrderInfo", params, {});
}

///driveRecord/getBySerial 行车记录仪获取车辆信息
export const getBySerial = (params) => {
    return http.get("/driveRecord/getBySerial?serial=" + params, {}, {});
}

///driveRecord/update
export const update = (params) => {
    return http.post("/driveRecord/update", params, {});
}