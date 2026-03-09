import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

const echo = new Echo({
  broadcaster: 'pusher',

  key: import.meta.env.VITE_PUSHER_APP_KEY || "",
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,

  forceTLS: true,

  authEndpoint: `${import.meta.env.VITE_API_URL}/broadcasting/auth`,

  auth: {
    headers: {
      get Authorization() {
        const token = localStorage.getItem('token')
        return token ? `Bearer ${token}` : ''
      },
      Accept: 'application/json',
    },
  },

  withCredentials: true,
})

;(window as any).Echo = echo 

export default echo


//wsHost: window.location.hostname, -> pakai saat production
//authEndpoint: `${import.meta.env.VITE_API_URL}/broadcasting/auth`, -> pakai saat production