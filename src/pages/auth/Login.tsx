import { useState } from 'react'
import { api } from '../../services/api'
import { useNavigate } from "react-router-dom"
import { UserRole } from './UserRole'
import { useAuth } from './AuthContext'
import { Plane } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setError('')

  try {
    // LOGIN
    const res = await api.post('/login', {
      email,
      password,
    })

    // SIMPAN TOKEN SAJA
    localStorage.setItem('token', res.data.token)

    const me = await api.get('/me')

    setUser(me.data)

    // OPTIONAL: simpan kalau backend kasih user di login response
    const user = res.data.user

    if (user) {
      localStorage.setItem("user_id", user.id)
      localStorage.setItem("user_role", user.role)

      if (
        user.role === UserRole.SUPERVISOR_ASCX ||
        user.role === UserRole.ASSISTANT_MANAGER_ASCX
      ) {
        navigate('/leader', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    } else {
      // fallback: paksa AuthProvider reload user
      window.location.href = '/dashboard'
    }

  } catch (err: any) {
    setError(err.response?.data?.message || 'Login gagal')
  } finally {
    setLoading(false)
  }
}

return (
  <div className="w-full min-h-screen bg-slate-950 flex overflow-hidden">

    {/* LEFT PANEL */}
    <div className="hidden lg:flex lg:w-3/5 relative">

      {/* Grid Background */}
      <div
        className="
          absolute inset-0
          bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),
          linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)]
          bg-[size:40px_40px]
        "
      />

      {/* Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/20 blur-[120px]" />

      <div className="relative z-10 flex flex-col justify-center px-20 text-white">

        <div className="mb-6">
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm">
            Internal Monitoring System
          </span>
        </div>

        <h1 className="text-6xl font-bold leading-tight">
          Airport Service
          <br />
          Customer Experience
        </h1>

        <p className="mt-6 text-slate-400 text-lg max-w-xl">
           Monitoring pekerjaan harian, target KPI, produktivitas,
          dan performa tim ASCX dalam satu dashboard terintegrasi.
        </p>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 mt-10">
  <div className="bg-white/5 backdrop-blur rounded-2xl p-5">
    <div className="text-cyan-400 text-xl mb-2">📋</div>
    <div className="text-white font-medium">Task Monitoring</div>
    <div className="text-slate-400 text-sm">
      Monitoring pekerjaan harian staff
    </div>
  </div>

  <div className="bg-white/5 backdrop-blur rounded-2xl p-5">
    <div className="text-cyan-400 text-xl mb-2">🎯</div>
    <div className="text-white font-medium">KPI Tracking</div>
    <div className="text-slate-400 text-sm">
      Evaluasi target dan pencapaian KPI
    </div>
  </div>

  <div className="bg-white/5 backdrop-blur rounded-2xl p-5">
    <div className="text-cyan-400 text-xl mb-2">👥</div>
    <div className="text-white font-medium">Team Management</div>
    <div className="text-slate-400 text-sm">
      Monitoring staff dan supervisor
    </div>
  </div>

  <div className="bg-white/5 backdrop-blur rounded-2xl p-5">
    <div className="text-cyan-400 text-xl mb-2">📈</div>
    <div className="text-white font-medium">Performance Report</div>
    <div className="text-slate-400 text-sm">
      Summary dan insight performa
    </div>
  </div>
</div>

        {/* Footer */}
        <div className="mt-16 text-slate-500 text-sm">
          Airport Service & Costumer Experience - Bandara Halim Perdanakusuma
        </div>

      </div>
    </div>

    {/* RIGHT PANEL */}
    <div className="flex-1 flex items-center justify-center px-6 py-10">

      <div
        className="
          w-full max-w-md
          bg-white dark:bg-slate-900
          rounded-3xl
          shadow-2xl
          border
          border-slate-200
          dark:border-slate-800
          p-8
        "
      >

        {/* Logo */}
        <div className="text-center mb-8">

          <div
            className="
              w-16 h-16 mx-auto
              rounded-2xl
              bg-cyan-500
              flex items-center justify-center
              text-white text-2xl font-bold
            "
          >
            <Plane className="h-8 w-8 text-white rotate-45" />
          </div>

          <h2 className="mt-5 text-3xl font-bold text-slate-800 dark:text-white">
            Sign In
          </h2>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Login untuk mengakses dashboard monitoring
          </p>

        </div>

        {/* ERROR */}
        {error && (
          <div
            className="
              mb-5
              rounded-xl
              border border-red-200
              bg-red-50
              px-4 py-3
              text-sm text-red-600
            "
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@company.com"
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                dark:border-slate-700
                px-4 py-3
                bg-white
                dark:bg-slate-800
                text-slate-900
                dark:text-white
                focus:ring-2
                focus:ring-cyan-500
                outline-none
              "
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                dark:border-slate-700
                px-4 py-3
                bg-white
                dark:bg-slate-800
                text-slate-900
                dark:text-white
                focus:ring-2
                focus:ring-cyan-500
                outline-none
              "
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              py-3
              rounded-xl
              bg-cyan-600
              hover:bg-cyan-700
              text-white
              font-semibold
              transition
              disabled:opacity-60
              flex
              items-center
              justify-center
              gap-2
            "
          >
            {loading ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="4"
                    fill="none"
                  />
                </svg>

                Authenticating...
              </>
            ) : (
              'Sign In'
            )}
          </button>

        </form>

        <div className="mt-8 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} ASCX Monitoring System
        </div>

      </div>

    </div>
  </div>
)}
