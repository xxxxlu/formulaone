import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '../views/home.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: Home },
  { path: '/home', name: 'home', component: Home },
  { path: '/drivers', name: 'drivers', component: () => import('../views/deivers.vue') },
  { path: '/news', name: 'news', component: () => import('../views/news.vue') },
  { path: '/news/:slug', name: 'news-detail', component: () => import('../views/news-detail.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
