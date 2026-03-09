import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../pages/auth/useAuth'

interface NavbarProps {
  onMenuClick: () => void
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, loading, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // close dropdown jika klik di luar
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const [openProfile, setOpenProfile] = useState(false)

  const [formProfile, setFormProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || '',
  })
  const [saving, setSaving] = useState(false)

  const handleUpdateProfile = async () => {
    const toastId = toast.loading("Menyimpan...")
    try {
      setSaving(true)

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/profile`,
        {
          ...formProfile,
          password: formProfile.password || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      
     // ✅ UPDATE TOAST JADI SUCCESS
    toast.success("Profile berhasil diupdate", {
      id: toastId,
    })

    setOpenProfile(false)

  } catch (err: any) {
    console.error(err)

    // ✅ AMBIL ERROR MESSAGE DARI BACKEND
    const message =
      err.response?.data?.message || "Gagal update profile"

    // ❌ JANGAN alert lagi
    toast.error(message, {
      id: toastId,
    })

  } finally {
    setSaving(false)
  }
}

  useEffect(() => {
    if (user) {
      setFormProfile({
        name: user.name || '',
        email: user.email || '',
        password: '',
        role: user.role || '',
      })
    }
  }, [user])

  if (loading) {
    return (
  
      <header
        className="
          sticky top-0 z-20
          bg-white/90 backdrop-blur
          border-b border-gray-200
          px-6 py-4
          flex justify-between items-center
        "
      >
        {/* Left skeleton */}
        <div className="flex items-center gap-4">
          <div className=" w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
          <div className="hidden w-32 h-5 bg-gray-200 rounded animate-pulse" />
        </div>
  
        {/* Right skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-24 h-8 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </header>
    )
  }  

  return (
    <>
    <header
      className="
        sticky top-0 z-20
        bg-white/90 backdrop-blur
        border-b border-gray-200
        px-6 py-4
        flex justify-between items-center
      "
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="
            p-2 rounded-lg
            text-gray-600
            hover:bg-gray-100
            transition
          "
          aria-label="Open menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Right */}
      <div className="relative" ref={dropdownRef}>
        {/* Trigger */}
        <button
          onClick={() => setOpen(!open)}
          className="
            flex items-center gap-2
            bg-blue-100 text-blue-700
            px-4 py-2 rounded-full
            text-sm font-medium
            hover:bg-blue-200
            transition
          "
        >
          {user?.name}
          <svg
            className={`w-4 h-4 transition ${open ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="
              absolute right-0 mt-2 w-44
              bg-white rounded-lg shadow-lg
              border border-gray-100
              overflow-hidden
            "
          >
            <button
            onClick={() => {
              setOpen(false)
              setOpenProfile(true)
            }}
              className="
                w-full text-left px-4 py-2 text-sm
                hover:bg-gray-50
              "
            >
              👤 Profile
            </button>

            <hr />

            <button
              onClick={logout}
              className="
                w-full text-left px-4 py-2 text-sm
                text-red-600
                hover:bg-red-50
              "
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </header>

    {/* Edit Profile Modal */}
    {openProfile && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

          {/* Name */}
          <div className="mb-3">
            <label className="text-sm">Nama</label>
            <input
              type="text"
              value={formProfile.name}
              placeholder={user?.name || 'User Belum Memiliki Nama'}
              onChange={(e) =>
                setFormProfile({ ...formProfile, name: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="text-sm">Email</label>
            <input
              type="email"
              value={formProfile.email}
              placeholder={user?.email || 'User Belum Memiliki Email'}
              onChange={(e) =>
                setFormProfile({ ...formProfile, email: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* Position */}
          <div className="mb-4">
            <label className="text-sm">Position</label>
            <input
              type="text"
              value={formProfile.role}
              placeholder={user?.role || 'User Belum Memiliki Role'}
              onChange={(e) =>
                setFormProfile({ ...formProfile, role: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="text-sm">Password</label>
            <input
              type="password"
              value={formProfile.password || ''}
              placeholder="Kosongkan jika tidak diubah"
              onChange={(e) =>
                setFormProfile({ ...formProfile, password: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setOpenProfile(false)}
              className="px-4 py-2 text-sm rounded-lg border"
            >
              Batal
            </button>

            <button
              onClick={handleUpdateProfile}
              disabled={saving}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                  </svg>
                  Menyimpan...
                </span>
              ) : (
                'Simpan'
              )}
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  )
}
