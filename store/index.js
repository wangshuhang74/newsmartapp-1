import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWorkStore = defineStore(
    'work',
    () => {
        const workDetail = ref(null)

        return {
            workDetail
        }
    },
    {
        persist: true,
    },
)


// 模块统一导出
export * from './user'
export * from './tags'
