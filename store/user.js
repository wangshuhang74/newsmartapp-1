import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, logout } from '../api'
import { useToast } from "wot-design-uni"; // ui组件库
const Toast = useToast()
const initState = { userName: '', avatar: '', token: null, }

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref({ ...initState })
    const loginForm = ref({})
    const deviceId = ref(null)


    const setUserInfo = (val) => {
      userInfo.value = val
    }

    const loginInfo = async (postForm) => {
      const { code, data, msg } = await login(postForm)
      if (code == 0) {
        userInfo.value = data
        loginForm.value = postForm
        uni.switchTab({
          url: '/pages/home/index',
        })
      }
      return {
        code,
        msg,
        data,
      }
    }

    const clearUserInfo = async () => {
      userInfo.value = { ...initState }
      uni.navigateTo({ url: '/pagesAccount/login/index' })
      await logout()
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
      deviceId,
      setUserInfo,
      loginInfo,
      clearUserInfo,
      isLogined,
      isLoginFn,
    }
  },
  {
    persist: true,
  },
)

