import { http } from "../utils/http";

// /order/getAppTodoNum
export const getAppTodoNum = () => {
    return http.post("/order/getAppTodoNum", {}, {});
}

// /flowable/task/todoList?pageNum=1&pageSize=10&type=5
export const getList = (params) => {
    return http.post("/flowable/task/todoList", params, {});
}