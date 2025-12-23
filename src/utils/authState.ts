import { ref, computed } from 'vue'

type UserSession = {
  email: string
  name?: string
  token: string
}

const STORAGE_KEY = 'f1_auth_session'
const session = ref<UserSession | null>(loadSession())
const loading = ref(false)
const errorMessage = ref<string | null>(null)
const resetMessage = ref<string | null>(null)

function loadSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as UserSession) : null
  } catch {
    return null
  }
}

function saveSession(next: UserSession | null) {
  if (next) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export const useAuthState = () => {
  const isAuthenticated = computed(() => !!session.value)

  const login = async (email: string, password: string) => {
    loading.value = true
    errorMessage.value = null
    try {
      const base = import.meta.env.VITE_API_BASE_URL
      if (!base) throw new Error('缺少后端地址 VITE_API_BASE_URL，无法登录')
      const res = await fetch(`${base}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      const next: UserSession = {
        email: data.email ?? email,
        name: data.name,
        token: data.token,
      }
      session.value = next
      saveSession(next)
      return next
    } catch (err) {
      errorMessage.value = err instanceof Error ? err.message : 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (email: string, newPassword: string) => {
    loading.value = true
    errorMessage.value = null
    resetMessage.value = null
    try {
      const base = import.meta.env.VITE_API_BASE_URL
      if (!base) throw new Error('缺少后端地址 VITE_API_BASE_URL，无法重置密码')
      const res = await fetch(`${base}/auth/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: newPassword }),
      })
      if (!res.ok) throw new Error(await res.text())
      resetMessage.value = '密码已更新，可以使用新密码登录。'
      return true
    } catch (err) {
      errorMessage.value = err instanceof Error ? err.message : 'Reset failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    session.value = null
    saveSession(null)
  }

  return {
    session,
    isAuthenticated,
    loading,
    errorMessage,
    resetMessage,
    login,
    resetPassword,
    logout,
  }
}
