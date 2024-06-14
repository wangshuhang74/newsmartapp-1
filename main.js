
import { createSSRApp } from 'vue'
import App from './App.vue'
import * as Pinia from 'pinia' // 创建Pinia实例
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { persist } from "./store/persist";
const pinia = Pinia.createPinia();
// pinia.use(piniaPluginPersistedstate)
pinia.use(persist);
export function createApp () {
  const app = createSSRApp(App)
  app.use(pinia);
  return {
    app,
    Pinia
  }
}
