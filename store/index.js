import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWorkStore = defineStore(
    'work',
    () => {
        const workDetail = ref(null)
        const workHandle = ref(null)
        const assignRefresh = ref(false) // 指派页面进入详情 指派成功后刷新指派列表
        const auditRefresh = ref(false) // 审核页面进入详情 指派成功后刷新审核列表

        return {
            workDetail,
            workHandle,
            assignRefresh,
            auditRefresh
        }
    },
    {
        persist: true, // 本地持久化
    },
)


// 模块统一导出
export * from './user'
export * from './tags'
