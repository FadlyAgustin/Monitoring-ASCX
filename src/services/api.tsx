import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_APP_URL,
  headers: {
    Accept: 'application/json',
  },
})

/* =========================
   REQUEST INTERCEPTOR
========================= */

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


/* =========================
   RESPONSE INTERCEPTOR
========================= */

api.interceptors.response.use(
  res => res,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
