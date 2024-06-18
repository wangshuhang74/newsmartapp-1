
import { createSSRApp } from 'vue'
import App from './App.vue'
import * as Pinia from 'pinia' // 创建Pinia实例
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { persist } from "./store/persist";
import i18n from "@/utils/locales/index";
const pinia = Pinia.createPinia();
// pinia.use(piniaPluginPersistedstate)
pinia.use(persist);
export function createApp () {
  const app = createSSRApp(App)
  app.use(pinia);

  // 注册i18n到app
  app.use(i18n)
  // 挂载全局方法
  app.config.globalProperties.$i18n = i18n
  return {
    app,
    Pinia,
    i18n // 返回i18n实例供其他地方使用
  }
}
