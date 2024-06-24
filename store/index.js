import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWorkStore = defineStore(
    'work',
    () => {
        const workDetail = ref(null)
        const workHandle = ref(null)

        return {
            workDetail,
            workHandle
        }
    },
    {
        persist: true,
    },
)


// 模块统一导出
export * from './user'
export * from './tags'
