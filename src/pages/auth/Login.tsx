import { useState } from 'react'
import { api } from '../../services/api'
import { useNavigate } from "react-router-dom"
import { UserRole } from './UserRole'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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
  
      // SIMPAN TOKEN
      localStorage.setItem('token', res.data.token)
  
      // AMBIL DATA USER
      const me = await api.get('/me')
      const user = me.data

      localStorage.setItem("user_id", user.id);
      localStorage.setItem("user_role", user.role);
  
      // REDIRECT BERDASARKAN ROLE
      if (
        user.role === UserRole.SUPERVISOR_ASCX ||
        user.role === UserRole.ASSISTANT_MANAGER_ASCX
      ) {
        navigate('/leader', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
  
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal')
    } finally {
      setLoading(false)
    }
  }  

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          MONITORING ASCX ✈️
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Silakan login untuk melanjutkan
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="email@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 text-white py-2 font-semibold hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} MONITORING ASCX ✈️
      </p>
    </div>
  )
}
