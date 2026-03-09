import { useEffect, useState } from 'react'
import axios from 'axios'
import echo from '../../ts/echo'
import StatCard from '../../components/cards/StatCard'
import DashboardSkeleton from '../skeleton/DashboardSkeleton'

export default function Dashboard() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetchDashboard()
  
    const userId = localStorage.getItem("user_id")
    if (!userId) return
  
    const channel = echo.private(`tasks.${userId}`)
  
    channel.listen(".task.created", fetchDashboard)
    channel.listen(".task.updated", fetchDashboard)
    channel.listen(".task.deleted", fetchDashboard)
    channel.listen(".task.seen", fetchDashboard)
  
    return () => {
      echo.leave(`private-tasks.${userId}`)
    }
  }, [])
  
  const total = data?.monitoring?.tasks?.length || 0

  const seen =
    data?.monitoring?.tasks?.filter(
      (t: any) => t.is_seen_by_supervisor === 1
    ).length || 0
  
  const isAllSeen = total > 0 && seen === total

  const reported =
  data?.monitoring?.tasks?.filter(
    (t: any) => t.status === "Done"
  ).length || 0

  const isAllReported = total > 0 && reported === total

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        }
      )

      setData(res.data)
    } catch (err) {
      console.error("Dashboard error:", err)
    }
  }

  const statusIcons: any = {
    Done: "✅",
    "In Progress": "⏳",
    Pending: "⛔",
  }
  
  const getStatusIcon = (status:string) => statusIcons[status] || "📌"

  const limitWords = (text: string, count: number = 3) => {
    const words = text.split(" ")
    return words.length > count
      ? words.slice(0, count).join(" ") + "..."
      : text
  }

  if (!data) return <DashboardSkeleton />


  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Ringkasan aktivitas dan progres pekerjaan hari ini
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Task Hari Ini" value={data.total_today} icon="📋" />
        <StatCard title="Done" value={data.done} icon="✅" />
        <StatCard title="In Progress" value={data.in_progress} icon="⏳" />
        <StatCard title="Pending" value={data.pending} icon="⛔" />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <Card title="Aktivitas Terakhir">
  {data.last_activities.length > 0 ? (
    <ul className="space-y-2 text-sm">
      {data.last_activities.map((task: any) => (
        <li
          key={task.id}
          className="flex justify-between items-center"
        >
          <span>{getStatusIcon(task.status)} {limitWords(task.activity, 3)}</span>

          <span className="text-gray-400 text-xs">
          {new Date(task.updated_at).toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
          </span>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-sm text-gray-400">
      Belum ada aktivitas
    </p>
  )}
</Card>


        {/* Status */}
        <Card title="Status Monitoring Atasan">
          <StatusItem
            label="Laporan Hari Ini"
            value={
              total === 0
                ? "Belum Ada Task Hari Ini"
                : isAllReported
                  ? "Sudah Done"
                  : `${reported}/${total} Done`
            }
            highlight={isAllReported && total > 0}
          />

          {/*<StatusItem
            label="Evidence"
            value={data.monitoring.evidence ? "Lengkap" : "Belum Lengkap"}
          />*/}

        <StatusItem
          label="Dilihat Atasan"
          value={
            total === 0
              ? "Belum Ada Task Hari Ini"
              : isAllSeen
                ? "Sudah Dilihat"
                : `${seen}/${total} Dilihat`
          }
          highlight={isAllSeen && total > 0}
        />
        </Card>

      </div>
    </div>
  )
}

/* ================= COMPONENT ================= */

function Card({
  title,
  children
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="font-semibold mb-3">{title}</h2>
      {children}
    </div>
  )
}

function StatusItem({
  label,
  value,
  highlight
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex justify-between text-sm border-b py-1 last:border-none">
      <span className="text-gray-600">{label}</span>
      <span className={`font-semibold ${highlight ? 'text-blue-600' : ''}`}>
        {value}
      </span>
    </div>
  )
}
