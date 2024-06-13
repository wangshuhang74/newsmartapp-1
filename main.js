
import { createSSRApp } from 'vue'
import App from './App.vue'
import * as Pinia from 'pinia' // 创建Pinia实例
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
export function createApp() {
  const app = createSSRApp(App)
  app.use(Pinia.createPinia().use(piniaPluginPersistedstate))
  return {
    app,
    Pinia
  }
}
