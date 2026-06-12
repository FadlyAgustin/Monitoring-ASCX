import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { createPortal } from 'react-dom'
import { useDebounce } from '../../components/ui/useDebounce'
import Modal from '../../components/ui/Modal'
import JobTypeHeaderSkeleton from '../skeleton/JobTypeHeaderSkeleton'
import { Briefcase } from 'lucide-react'

export default function JobType() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)

  const [openModal, setOpenModal] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)

  const [name, setName] = useState('')

  const [deleteId, setDeleteId] = useState<number | null>(null)

  const token = localStorage.getItem('token')

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      setLoading(true)

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/job-types`,
        {
          params: { search: debouncedSearch, page },
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setData(res.data.data)
      setLastPage(res.data.last_page)
    } catch {
      toast.error('Gagal ambil data job type')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [debouncedSearch, page])

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!name) {
      toast.error('Nama job type wajib diisi')
      return
    }

    const toastId = toast.loading(
      editItem ? 'Mengupdate...' : 'Menyimpan...'
    )

    try {
      if (editItem) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/job-types/${editItem.id}`,
          { name },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/job-types`,
          { name },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }

      toast.success('Berhasil disimpan', { id: toastId })

      setOpenModal(false)
      setName('')
      setEditItem(null)

      fetchData()
    } catch {
      toast.error('Gagal menyimpan', { id: toastId })
    }
  }

  // ================= DELETE =================
  const handleDelete = async () => {
    if (!deleteId) return

    const toastId = toast.loading('Menghapus...')

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/job-types/${deleteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      toast.success('Berhasil dihapus', { id: toastId })
      setDeleteId(null)
      fetchData()
    } catch {
      toast.error('Gagal hapus', { id: toastId })
    }
  }

  // ================= MODAL DELETE =================
  const ConfirmModal = ({ open, onClose, onConfirm }: any) => {
    if (!open) return null

    return createPortal(
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-80 border dark:border-slate-800">
          <h2 className="font-semibold mb-4 text-gray-900 dark:text-white">
            Yakin hapus job type?
          </h2>

          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="text-gray-700 dark:text-gray-300">Batal</button>
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
    )
  }

  return (
    <>
      <div className="space-y-6 text-gray-900 dark:text-white">

        {/* HEADER */}
        {loading ? (
          <JobTypeHeaderSkeleton />
        ) : (
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Job Type</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Kelola kategori pekerjaan
            </p>
          </div>

          <button
            onClick={() => {
              setEditItem(null)
              setName('')
              setOpenModal(true)
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Tambah
          </button>
        </div>
        )}

        {/* FILTER */}
        <div className="flex gap-2">
          {loading ? (
            <div className="h-10 w-64 bg-gray-200 animate-pulse rounded-lg" />
          ) : (
            <input
              placeholder="Cari job type..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="border px-3 py-2 rounded-lg text-sm w-64
                        bg-white dark:bg-slate-800
                        text-gray-900 dark:text-white
                        border-gray-300 dark:border-slate-700"
            />
          )}
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow overflow-hidden border dark:border-slate-800">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              Tidak ada data
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left">Nama</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-3 text-gray-900 dark:text-white">{item.name}</td>

                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditItem(item)
                          setName(item.name)
                          setOpenModal(true)
                        }}
                        className="text-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="text-red-600"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* PAGINATION */}
          {!loading && lastPage > 1 && (
            <div className="flex justify-end gap-2 p-3">
              {Array.from({ length: lastPage }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    page === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* MODAL FORM */}
        {openModal && (
          <Modal
          open={openModal}   
          title={
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
        <Briefcase
          size={16}
          className="text-blue-600 dark:text-blue-300"
        />
      </div>

      <span>Job Type</span>
    </div>
  }
          onClose={() => setOpenModal(false)}
        >

              <h2 className="mb-2 text-lg text-gray-900 dark:text-white">
                {editItem ? 'Edit Job Type' : 'Tambah Job Type'}
              </h2>

              <input
                placeholder="Nama job type"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg text-sm
                          bg-white dark:bg-slate-800
                          text-gray-900 dark:text-white
                          border-gray-300 dark:border-slate-700"
              />

              <div className="flex justify-end gap-2 py-2">
                <button onClick={() => setOpenModal(false)} className="text-gray-700 dark:text-gray-300">
                  Batal
                </button>

                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Simpan
                </button>
              </div>
          </Modal>
        )}

        {/* DELETE MODAL */}
        <ConfirmModal
          open={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      </div>
    </>
  )
}