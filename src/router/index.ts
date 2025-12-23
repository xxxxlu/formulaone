import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '../views/home.vue'
import { setRouting } from '../utils/loadingState'

const routes: RouteRecordRaw[] = [
  { path: '/home', name: 'home', component: Home, alias: ['/'] },
  { path: '/drivers', name: 'drivers', component: () => import('../views/deivers.vue') },
  { path: '/drivers/:id', name: 'driver-detail', component: () => import('../views/driver-detail.vue') },
  { path: '/teams', name: 'teams', component: () => import('../views/teams.vue') },
  { path: '/teams/:id', name: 'team-detail', component: () => import('../views/team-detail.vue') },
  { path: '/news', name: 'news', component: () => import('../views/news.vue') },
  { path: '/news/:slug', name: 'news-detail', component: () => import('../views/news-detail.vue') },
  { path: '/', redirect: '/home' },
  { path: '/:pathMatch(.*)*', redirect: '/home' },
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
