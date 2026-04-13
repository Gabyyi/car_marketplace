import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/home.vue'
import LoginPage from '../pages/Login.vue'
import SignupPage from '../pages/Signup.vue'
import CarAdPage from '../pages/CarAd.vue'
import SearchResult from '../pages/SearchResult.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/search', name: 'Search', component: SearchResult },
  { path: '/login', name: 'Login', component: LoginPage }
  ,{ path: '/signup', name: 'Signup', component: SignupPage }
  ,{ path: '/car', name: 'CarAd', component: CarAdPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { left: 0, top: 0 }
  }
})

export default router
