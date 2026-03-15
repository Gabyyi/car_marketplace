import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/home.vue'
import LoginPage from '../pages/Login.vue'
import SignupPage from '../pages/Signup.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/login', name: 'Login', component: LoginPage }
  ,{ path: '/signup', name: 'Signup', component: SignupPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
