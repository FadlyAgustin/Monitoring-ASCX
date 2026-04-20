import { useEffect, useState } from "react"
import api from "../../services/api"
import toast from "react-hot-toast"
import TaskRequestHistorySkeleton from "../skeleton/TaskRequestHistorySkeleton"
import TaskRequestHeaderSkeleton from "../skeleton/TaskRequestHeaderSkeleton"

export default function TaskRequestHistory() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState("")
  
  /* =========================
    PAGINATION
    ========================= */
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)

  const fileIcon = (type: string) => {
    if (type.includes("image")) return "🖼️"
    if (type.includes("pdf")) return "📄"
    if (type.includes("zip")) return "🗜️"
    return "📎"
  }

  const roleColor = (role: string) => {
    switch (role) {
      case "SUPERVISOR_ASCX":
        return "text-purple-600"
      case "STAFF_IT":
        return "text-blue-600"
      case "STAFF_ASCX":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-700"
      case "In Progress":
        return "bg-yellow-100 text-yellow-700"
      case "Pending":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const fetchLogs = async (pageNumber = 1) => {
    setLoading(true)
    try {
      const res = await api.get("/task-request-logs", {
        params: {
          page: pageNumber,
          date: date || undefined,
        },
      })
  
      setLogs(res.data.data)
      setPage(res.data.current_page)
      setLastPage(res.data.last_page)
      setTotal(res.data.total)
    } catch (err) {
      toast.error("Gagal mengambil history")
    } finally {
        setTimeout(() => {
            setLoading(false)
        }, 300)
    }
  }

  useEffect(() => {
    fetchLogs(1)
  }, [date])

  return (
    <div className="space-y-5">
        {/* 🔥 HEADER */}
    {loading ? (
      <TaskRequestHeaderSkeleton />
    ) : (
      <>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold mb-4">
            Task Request History
          </h1>
        </div>

        <div className="flex justify-end items-center">
          <div className="flex items-center gap-2">
            <input
              type="date"
              className="border rounded-lg px-3 py-1 text-sm"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            {date && (
              <>
                <button
                  onClick={() =>
                    setDate(new Date().toISOString().slice(0, 10))
                  }
                  className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                >
                  Today
                </button>

                <button
                  onClick={() => setDate("")}
                  className="text-xs px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Reset
                </button>
              </>
            )}
          </div>
        </div>
      </>
    )}

      {/* 📦 CONTENT */}
    {loading ? (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <TaskRequestHistorySkeleton key={i} />
        ))}
      </div>
    ) : logs.length === 0 ? (
      <div className="text-gray-400 text-sm border p-4 rounded-lg text-center">
        🚫 No History Data
      </div>
    ) : (
      <div className="space-y-3">
        {logs.map((log) => (
          <div
            key={log.id}
            className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            {/* 🔥 ACTIVITY */}
            <div className="flex justify-between items-start border-b pb-2 mb-2 gap-2">
              <h2
                className="font-medium text-sm line-clamp-1"
                title={log.activity}
              >
                {log.activity}
              </h2>

              <span
                className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${statusColor(log.task?.status)}`}
              >
                {log.task?.status || "-"}
              </span>
            </div>

            {/* 👥 FROM → TO */}
            <div className="flex justify-between items-center text-xs">
              <div>
                <p className="text-gray-400">From</p>
                <p className={`font-medium ${roleColor(log.requester?.role)}`}>
                  👤 {log.requester?.name || "-"}
                </p>
              </div>

              <div className="text-gray-300 text-lg">→</div>

              <div className="text-right">
                <p className="text-gray-400">To</p>
                <p className={`font-medium ${roleColor(log.assignee?.role)}`}>
                  👤 {log.assignee?.name || "-"}
                </p>
              </div>
            </div>

           {/* 📎 ATTACHMENTS (FILES + LINK) */}
            {(log.task?.files?.length > 0 || log.task?.link) && (
              <div className="mt-3 border-t pt-2">
                <p className="text-[11px] text-gray-400 mb-1">📎 Attachments</p>

                <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                  
                  {/* 🔗 LINK */}
                  {log.task?.link && (
                    <a
                      href={log.task.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-all duration-200"
                    >
                      🔗 Open Link
                    </a>
                  )}

                  {/* 📂 FILES */}
                  {log.task?.files?.map((file: any) => (
                    <a
                      key={file.id}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-all duration-200"
                    >
                      {fileIcon(file.file_type)} 
                      <span className="truncate max-w-[120px]">
                        {file.file_name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {!log.task?.files?.length && !log.task?.link && (
              <div className="mt-3 border-t pt-2">
                <p className="text-[11px] text-gray-400 italic">No attachments</p>
              </div>
            )}

            {/* 📅 DATE */}
            <div className="flex justify-between items-center text-xs mt-2 text-gray-400">
              <div>⏰ Deadline: {formatDate(log.task?.deadline)}</div>
              <div>📅 Request Date: {formatDate(log.requested_at)}</div>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* 🔍 INFO */}
    <div className="text-xs text-gray-500">
      {date ? (
        <>
          Showing <span className="font-medium">{total}</span> history for{" "}
          <span className="font-medium">{date}</span>
        </>
      ) : (
        <>
          Showing all history (
          <span className="font-medium">{total}</span> Task Requests)
        </>
      )}
    </div>

    {/* 📄 PAGINATION */}
    <div className="flex justify-center items-center gap-2 mt-4">
      <button
        disabled={page === 1}
        onClick={() => fetchLogs(page - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      <span className="text-sm text-gray-600">
        Page {page} / {lastPage}
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