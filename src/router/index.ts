import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '../views/home.vue'

const routes: RouteRecordRaw[] = [
  { path: '/home', name: 'home', component: Home },
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
  { path: '/rag', name: 'rag', component: () => import('../views/rag.vue') },
  { path: '/not-found', name: 'not-found', component: () => import('../views/not-found.vue') },
  { path: '/', redirect: '/home' },
  { path: '/:pathMatch(.*)*', redirect: '/not-found' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

const CHUNK_RELOAD_KEY = 'f1_chunk_reload_once'

router.onError((error, to) => {
  const message = error instanceof Error ? error.message : String(error)
  const isChunkLoadError =
    message.includes('Failed to fetch dynamically imported module') ||
    message.includes('Importing a module script failed') ||
    message.includes('Loading chunk')

  if (!isChunkLoadError) return

  const hasReloaded = sessionStorage.getItem(CHUNK_RELOAD_KEY) === '1'
  if (hasReloaded) return

  sessionStorage.setItem(CHUNK_RELOAD_KEY, '1')
  const target = to?.fullPath || '/home'
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  window.location.assign(`${base}${target}`)
})

router.afterEach(() => {
  sessionStorage.removeItem(CHUNK_RELOAD_KEY)
})

export default router
