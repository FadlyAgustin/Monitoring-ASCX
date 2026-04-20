import { useEffect, useState } from "react"
import api from "../../services/api"
import { useAuth } from "../auth/useAuth"
import toast from "react-hot-toast"
import Swal from "sweetalert2"
import { Check, X } from "lucide-react"
import LogDeleteHeaderSkeleton from "../skeleton/LogDeleteHeaderSkeleton"
import LogDeleteSkeleton from "../skeleton/LogDeleteSkeleton"

export default function LogDelete() {
  const { user } = useAuth()
  const userRole = user?.role

  const [logs, setLogs] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [loading, setLoading] = useState(false)

  /* =========================
     🔁 DEBOUNCE SEARCH
  ========================= */
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)

    return () => clearTimeout(timeout)
  }, [search])

  /* =========================
     📡 FETCH DATA
  ========================= */
  const fetchLogs = async (pageNumber = 1) => {
    setLoading(true)
    try {
      const res = await api.get(
        `/delete-logs?page=${pageNumber}&search=${debouncedSearch}&status=${status}`
      )

      setLogs(res.data.data)
      setPage(res.data.current_page)
      setLastPage(res.data.last_page)
    } catch (err: any) {
      toast.error("Gagal mengambil data")
      setLogs([])
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 300)
    }
  }

  /* =========================
     ✅ APPROVE
  ========================= */
  const approve = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Approve?",
      text: "Data akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, approve!",
    })
  
    if (!confirm.isConfirmed) return
  
    try {
      await api.post(`/delete-logs/${id}/approve`)
      toast.success("Approved ✅")
      fetchLogs(page)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal approve")
    }
  }

  /* =========================
     ❌ REJECT
  ========================= */
  const reject = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Reject?",
      text: "Request akan dibatalkan",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, reject!",
    })
  
    if (!confirm.isConfirmed) return
  
    try {
      await api.post(`/delete-logs/${id}/reject`)
      toast.success("Rejected ❌")
      fetchLogs(page)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal reject")
    }
  }

  /* =========================
     🔄 EFFECT
  ========================= */
  useEffect(() => {
    fetchLogs(1)
  }, [debouncedSearch, status])

  return (
    <div className="space-y-6 mx-auto">
      {loading ? (
      <LogDeleteHeaderSkeleton />
    ) : (
      <>
      <h1 className="text-2xl font-bold mb-4"> Delete Request Logs</h1>

      {/* 🔍 SEARCH + FILTER */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search user..."
          className="w-full p-2 border rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-2 border rounded-lg"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      </>
      )}

      {/* 📦 LIST */}
      <div className="space-y-3">
        {loading ? (
          <>
            <LogDeleteSkeleton />
            <LogDeleteSkeleton />
            <LogDeleteSkeleton />
            <LogDeleteSkeleton />
          </>
        ) : logs.length === 0 ? (
          <div className="text-center text-gray-400 border p-4 rounded-lg text-sm">
            🚫 Tidak ada data delete request
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="bg-white shadow-sm w-50 rounded-lg p-3 border text-sm"
            >
              <div className="flex justify-between items-center">
                
                <h2 className="font-medium">
                  Task #{log.task_id}
                </h2>

                <span
                  className={`px-2 py-0.5 text-xs rounded-full
                  ${log.status === "pending" && "bg-yellow-100 text-yellow-700"}
                  ${log.status === "approved" && "bg-green-100 text-green-700"}
                  ${log.status === "rejected" && "bg-red-100 text-red-700"}
                `}
                >
                  {log.status}
                </span>
              </div>

              <div className="mt-1 text-gray-600 text-xs">
                👤 {log.user?.name}
              </div>

              <div className="border-b border-gray-400 pb-1 mb-2">
                <h2 className="font-medium line-clamp-1 text-gray-800 mx-3" title={log.activity}>
                  {log.activity}
                </h2>
              </div>

              <div className="text-gray-500 text-xs">
                📝 {log.reason}
              </div>

              <div className="flex justify-between items-center mt-2">

                {/* LEFT: DATE */}
                <div className="text-gray-400 text-[11px]">
                  {log.requested_at}
                </div>

                {/* RIGHT: ACTION */}
                {log.status === "pending" &&
                  (userRole === "SUPERVISOR_ASCX" ||
                    userRole === "ASSISTANT_MANAGER_ASCX") && (

                    <div className="flex gap-1">
                      <button
                        title="Approve"
                        onClick={() => approve(log.id)}
                        className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md"
                      >
                        <Check size={14} /> 
                      </button>

                      <button
                        title="Reject"
                        onClick={() => reject(log.id)}
                        className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md"
                      >
                        <X size={14} />
                      </button>
                    </div>
                )}

              </div>
            </div>
          ))
        )}
      </div>

      {/* 📄 PAGINATION */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          disabled={page === 1}
          onClick={() => fetchLogs(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-3 py-1">
          {page} / {lastPage}
        </span>

        <button
          disabled={page === lastPage}
          onClick={() => fetchLogs(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}