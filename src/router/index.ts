import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '../views/home.vue'

const routes: RouteRecordRaw[] = [
  { path: '/home', name: 'home', component: Home, alias: ['/'] },
  { path: '/drivers', name: 'drivers', component: () => import('../views/deivers.vue') },
  { path: '/drivers/:id', name: 'driver-detail', component: () => import('../views/driver-detail.vue') },
  { path: '/teams', name: 'teams', component: () => import('../views/teams.vue') },
  { path: '/teams/:id', name: 'team-detail', component: () => import('../views/team-detail.vue') },
  { path: '/tracks', name: 'tracks', component: () => import('../views/track-map.vue') },
  { path: '/news', name: 'news', component: () => import('../views/news.vue') },
  { path: '/news/:slug', name: 'news-detail', component: () => import('../views/news-detail.vue') },
  { path: '/champions', name: 'champions', component: () => import('../views/champions.vue') },
  { path: '/constructors', name: 'constructor-champions', component: () => import('../views/constructor-champions.vue') },
  { path: '/christmas', name: 'christmas', component: () => import('../views/christmas.vue') },
  { path: '/lottery', name: 'lottery', component: () => import('../views/lottery.vue') },
  { path: '/not-found', name: 'not-found', component: () => import('../views/not-found.vue') },
  { path: '/', redirect: '/home' },
  { path: '/:pathMatch(.*)*', redirect: '/not-found' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.name === 'lottery') {
    const unlocked = localStorage.getItem('xmasGiftUnlocked') === 'true'
    // Only block direct/unauthorized entry; allow when coming from christmas even if storage failed
    if (!unlocked && from.name !== 'christmas') {
      next({ name: 'not-found', query: { reason: 'forbidden' } })
      return
    }
  }
  next()
})

export default router
