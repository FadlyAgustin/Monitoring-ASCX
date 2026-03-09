import axios from 'axios'

const auth = axios.create({
  baseURL: import.meta.env.VITE_APP_URL, // http://localhost:8000/api
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
  },
  // 🔥 WAJIB TAMBAH INI
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
})

export default auth
