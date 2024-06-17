import { createI18n } from 'vue-i18n'

// 加载多语言资源
import en from './en'
import zh from './zh'
const defaultLang = uni.getStorageSync("lang") || "zh"
const i18n = createI18n({
    legacy: false, // Vue3模式下必须设置为false
    globalInjection: true, // 允许注入到全局 this 上
    locale: defaultLang || 'zh', // 默认语言
    messages: {
        en,
        zh
    }
})

export default i18n