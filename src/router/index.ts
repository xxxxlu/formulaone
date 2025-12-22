import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '../views/home.vue'
import { setRouting } from '../utils/loadingState'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: Home, alias: ['/home'] },
  { path: '/drivers', name: 'drivers', component: () => import('../views/deivers.vue') },
  { path: '/news', name: 'news', component: () => import('../views/news.vue') },
  { path: '/news/:slug', name: 'news-detail', component: () => import('../views/news-detail.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((_, __, next) => {
  setRouting(true)
  next()
})

router.afterEach(() => {
  // Small delay to allow the new view to render before hiding the loader
  setTimeout(() => setRouting(false), 800)
})

export default router
