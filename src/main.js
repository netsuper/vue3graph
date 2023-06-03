import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'

const pinia = createPinia()
const myApp = createApp(App)
myApp.use(pinia)
myApp.mount('#app')