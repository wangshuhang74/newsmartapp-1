import { http } from "../utils/http";

// /order/getAppTodoNum
export const getAppTodoNum = () => {
    return http.post("/order/getAppTodoNum", {}, {});
}

// /flowable/task/todoList?pageNum=1&pageSize=10&type=5
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

// /user/getWorkUser
export const getWorkUser = () => {
    return http.post("/user/getWorkUser",);
}
