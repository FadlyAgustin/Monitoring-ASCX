import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { createPortal } from "react-dom";
import { useDebounce } from '../../components/ui/useDebounce'

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const [role, setRole] = useState('all')
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)

  const [openModal, setOpenModal] = useState(false)
  const [editUser, setEditUser] = useState<any>(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'STAFF_ASCX',
    password: '',
  })

  const [deleteId, setDeleteId] = useState<number | null>(null)

  const token = localStorage.getItem('token')

  const fetchUsers = async () => {
    try {
      setLoading(true)

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users`,
        {
          params: { search: debouncedSearch, role, page },
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setUsers(res.data.data)
      setLastPage(res.data.last_page)
    } catch {
      toast.error('Gagal ambil data')
    } finally {
      setLoading(false)
    }
  }

  
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, role])
  
  useEffect(() => {
    fetchUsers()
  }, [debouncedSearch, role, page])

  // ===============================
  // HANDLE CREATE & UPDATE
  // ===============================

  const handleSubmit = async () => {
    const toastId = toast.loading(
      editUser ? 'Mengupdate...' : 'Menyimpan...'
    )
  
    try {
      if (editUser) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/users/${editUser.id}`,
          {
            ...form,
            password: form.password || undefined,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/users`,
          form,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      }
  
      toast.success(
        editUser ? 'Berhasil update user' : 'Berhasil tambah user',
        { id: toastId }
      )
  
      setOpenModal(false)
      fetchUsers()
  
    } catch {
      toast.error('Gagal menyimpan', { id: toastId })
    }
  }

  // ===============================
  // HANDLE DELETE
  // ===============================

  const handleDelete = async () => {
    if (!deleteId) return

    const toastId = toast.loading('Menghapus...')

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/users/${deleteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      toast.success('Berhasil dihapus', { id: toastId })
      setDeleteId(null)
      fetchUsers()
    } catch {
      toast.error('Gagal hapus', { id: toastId })
    }
  }

  const ConfirmModal = ({ open, onClose, onConfirm }: any) => {
    if (!open) return null
  
    return createPortal(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80">
            <h2 className="font-semibold mb-4">Yakin hapus user?</h2>
      
            <div className="flex justify-end gap-2">
              <button onClick={onClose}>Batal</button>
              <button
                onClick={onConfirm}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>,
        document.body
      );
  }

  const RoleBadge = ({ role }: { role: string }) => {
    const color =
      role === 'STAFF_IT'
        ? 'bg-blue-100 text-blue-700'
        : role === 'STAFF_ASCX'
        ? 'bg-green-100 text-green-700'
        : 'bg-black text-white hover:bg-gray-900 focus:ring-gray-700'
  
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {role.replace('_', ' ')}
      </span>
    )
  }

  return (
    <>
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-sm text-gray-500">
            Kelola user sistem
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* FILTER */}
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        
        <input
          placeholder="Cari user..."
          className="border px-3 py-2 rounded-lg text-sm w-full sm:w-64 min-w-0"
          onChange={(e) => setSearch(e.target.value)}
        />
        

        {loading ? (
          <div className="h-10 w-full sm:w-auto md:w-36 bg-gray-200 animate-pulse rounded-lg" />
        ) : (
        <select
          className="border px-3 py-2 rounded-lg text-sm w-full sm:w-auto"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="all">Semua Role</option>
          <option value="SUPERVISOR_ASCX">SUPERVISOR ASCX</option>
          <option value="STAFF_IT">STAFF IT</option>
          <option value="STAFF_ASCX">STAFF ASCX</option>
        </select>
        )}
      </div>

      {loading ? (
          <div className="h-10 w-full sm:w-auto md:w-36 bg-gray-200 animate-pulse rounded-lg" />
        ) : (
          <button
          onClick={() => {
              setEditUser(null)
              setForm({
              name: '',
              email: '',
              role: 'STAFF_ASCX',
              password: '',
              })
              setOpenModal(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto whitespace-nowrap"
          >
          + Tambah User
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
      {/* TABLE + CARD */}
        {loading ? (
          <>
            {/* DESKTOP SKELETON */}
            <div className="hidden md:block">
          
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="px-4 py-3 font-medium text-left">Nama</th>
                    <th className="px-4 py-3 font-medium text-left">Email</th>
                    <th className="px-4 py-3 font-medium text-left">Role</th>
                    <th className="px-4 py-3 font-medium text-left">Status</th>
                    <th className="px-4 py-3 font-medium text-left">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className="border-t">
                      {/* Nama */}
                      <td className="px-4 py-3">
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3">
                        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                      </td>

                      {/* Aksi */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <div className="h-4 w-10 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>

            {/* MOBILE SKELETON */}
            <div className="md:hidden space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 border rounded-lg animate-pulse bg-white">
                  <div className="h-4 bg-gray-300 w-32 mb-2 rounded"></div>
                  <div className="h-3 bg-gray-300 w-full mb-1 rounded"></div>
                  <div className="h-3 bg-gray-300 w-24 rounded"></div>
                </div>
              ))}
            </div>
          </>
        ) : users.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            Tidak ada data user
          </div>
        ) : (
          <>
            {/* ================= DESKTOP TABLE ================= */}
            <div className="hidden md:block overflow-x-auto rounded-lg border">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Nama</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {users.filter((user) => user.id !== 1).map((user) => (
                    <tr
                      key={user.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 font-medium">{user.name}</td>

                      <td className="px-4 py-3 text-gray-600">
                        {user.email}
                      </td>

                      <td className="px-4 py-3">
                        <RoleBadge role={user.role} />
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-500">
                          {user.status || '-'}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditUser(user)
                            setForm({
                              name: user.name,
                              email: user.email,
                              role: user.role,
                              password: '',
                            })
                            setOpenModal(true)
                          }}
                          className="text-blue-600 text-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => setDeleteId(user.id)}
                          className="text-red-600 text-sm"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ================= MOBILE CARD ================= */}
            <div className="md:hidden space-y-4">
              {users.filter((user) => user.id !== 1).map((user) => (
                <div
                  key={user.id}
                  className="border rounded-xl p-4 shadow-sm bg-white space-y-2 w-full"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-sm">
                      {user.name}
                    </h3>

                    <RoleBadge role={user.role} />
                  </div>

                  <div className="text-xs text-gray-500">
                    {user.email}
                  </div>

                  <div className="flex justify-between items-center pt-2">

                    <div className="flex gap-3 text-xs">
                      <button
                        onClick={() => {
                          setEditUser(user)
                          setForm({
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            password: '',
                          })
                          setOpenModal(true)
                        }}
                        className="text-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => setDeleteId(user.id)}
                        className="text-red-600"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

  {/* PAGINATION */}
  {!loading && lastPage > 1 && (
    <div className="flex justify-end gap-2 p-3">
      {Array.from({ length: lastPage }, (_, i) => (
        <button
          key={i}
          onClick={() => setPage(i + 1)}
          className={`px-3 py-1 rounded ${
            page === i + 1 ? 'bg-blue-600 text-white' : 'border'
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  )}
</div>

      {/* CONFIRM DELETE */}
      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>


    {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-96 space-y-4">

            <h2 className="font-semibold text-lg">
                {editUser ? 'Edit User' : 'Tambah User'}
            </h2>

            <input
                placeholder="Nama"
                value={form.name}
                onChange={(e) =>
                setForm({ ...form, name: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg text-sm"
            />

            <input
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                setForm({ ...form, email: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg text-sm"
            />

            <select
                value={form.role}
                onChange={(e) =>
                setForm({ ...form, role: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg text-sm"
            >
                <option value="STAFF_ASCX">STAFF ASCX</option>
                <option value="STAFF_IT">STAFF IT</option>
            </select>

            <input
                type="password"
                placeholder={
                editUser
                    ? 'Kosongkan jika tidak diubah'
                    : 'Password'
                }
                value={form.password}
                onChange={(e) =>
                setForm({ ...form, password: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg text-sm"
            />

            <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setOpenModal(false)}>
                Batal
                </button>

                <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                Simpan
                </button>
            </div>

            </div>
        </div>
        )}
    </>
  )
}