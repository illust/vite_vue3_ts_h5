import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { Button } from 'vant'
const pinia = createPinia()

const app = createApp(App)

app.use(router).use(ElementPlus).use(pinia).use(Button)

app.mount('#app')
