import { createApp } from 'vue'
import './assets/main.css'
import 'primeicons/primeicons.css'
import App from './App.vue'
import router from './router'
import { useTheme } from './composables/useTheme'

// initialize theme composable so stored preference/system preference is applied
useTheme()

createApp(App).use(router).mount('#app')
