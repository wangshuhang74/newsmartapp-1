import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const initState = { userName: '', avatar: '', token: null, }

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref({ ...initState })
    const loginForm = ref({})


    const setUserInfo = (val) => {
      userInfo.value = val
    }

    const clearUserInfo = () => {
      userInfo.value = { ...initState }
      uni.navigateTo({ url: '/pagesAccount/login/index' })
    }

    const isLogined = computed(() => !!userInfo.value.token)
    const isLoginFn = () => {
      if (!userInfo.value.token) {
        uni.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 2000
        })
        uni.navigateTo({
          url: '/pagesAccount/login/index'
        })
      } else {
        // console.log("登录了");
      }
    }

    return {
      userInfo,
      loginForm,
      setUserInfo,
      clearUserInfo,
      isLogined,
      isLoginFn,
    }
  },
  {
    persist: true,
  },
)

