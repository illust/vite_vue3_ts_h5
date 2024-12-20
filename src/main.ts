import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
const pinia = createPinia()

const app = createApp(App)

app.use(router).use(ElementPlus).use(pinia)

app.mount('#app')
