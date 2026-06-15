import { useEffect, useState } from 'react'
import { BarChart3 } from 'lucide-react'
import axios from 'axios'
import KpiCard from '../../components/cards/KpiCard'
import WeeklySummaryCard from '../../components/cards/WeeklySummaryCard'
import MonthlySummaryCard from '../../components/cards/MonthlySummaryCard'

export default function Summary() {
  const now = new Date()

  const [month, setMonth] = useState(String(now.getMonth() + 1))
  const [year, setYear] = useState(String(now.getFullYear()))

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) =>
    currentYear - 2 + i
  )

  type Staff = {
    id: number
    name: string
  }

  const [staffList, setStaffList] = useState<Staff[]>([])
  const [staffId, setStaffId] = useState<number | ''>('')

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // ✅ USER ROLE CHECK
  const role = localStorage.getItem('user_role') || ''

  const isLeader =
    role === 'SUPERVISOR_ASCX' ||
    role === 'ASSISTANT_MANAGER_ASCX'

  // ✅ CONFIG WITH AUTH
  const token = localStorage.getItem('token')

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const handleSaveKpi = async (details: any) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/kpi`,
        {
          user_id: staffId,
          month,
          year,
          details
        },
        config
      )
  
      fetchSummary()
    } catch (err) {
      console.error(err)
    }
  }

  // 🔥 FETCH STAFF
  useEffect(() => {
    if (isLeader) {
      axios.get(`${import.meta.env.VITE_API_URL}/api/staff-list`, config)
      .then(res => setStaffList(res.data.data || []))
    }
  }, [isLeader])

  // 🔥 FETCH SUMMARY
  useEffect(() => {
    fetchSummary()
  }, [month, year, staffId])

  const fetchSummary = async () => {
    try {
      // 🚫 Kalau leader tapi belum pilih staff → skip
      if (isLeader && !staffId) {
        setData(null)
        return
      }
  
      setLoading(true)
  
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/summary`,
        {
          params: {
            month,
            year,
            staff_id: staffId || undefined,
          },
          ...config
        }
      )
  
      setData(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isLeader) {
      setStaffId('')
    }
  }, [isLeader])

  return (
    <div className="space-y-6 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-yellow-900">
              <BarChart3
                size={18}
                className="text-yellow-600 dark:text-yellow-300"
              />
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Weekly & Monthly Summary
            </h2>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Pantau capaian pekerjaan, jumlah tugas yang selesai, tugas yang masih
            berjalan, serta performa tim melalui laporan mingguan dan bulanan.
          </p>
        </div>

        <div className="flex gap-2">
        {isLeader && (
          <select
            value={staffId}
            onChange={e => {
              const value = e.target.value
              setStaffId(value ? Number(value) : '')
            }}
            className="border px-3 py-2 rounded text-sm
                      bg-white dark:bg-slate-800
                      text-gray-900 dark:text-white
                      border-gray-300 dark:border-slate-700"
          >
            <option value="">Pilih Staff</option>
            {staffList.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        )}
          {/* Bulan */}
          <select
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="border rounded-md px-3 py-1.5 text-sm 
                      bg-white dark:bg-slate-800
                      text-gray-900 dark:text-white
                      border-gray-300 dark:border-slate-700"
          >
            <option value="1">Januari</option>
            <option value="2">Februari</option>
            <option value="3">Maret</option>
            <option value="4">April</option>
            <option value="5">Mei</option>
            <option value="6">Juni</option>
            <option value="7">Juli</option>
            <option value="8">Agustus</option>
            <option value="9">September</option>
            <option value="10">Oktober</option>
            <option value="11">November</option>
            <option value="12">Desember</option>
          </select>

          {/* Tahun */}
          <select
            value={year}
            onChange={e => setYear(e.target.value)}
            className="border rounded-md px-3 py-1.5 text-sm
                      bg-white dark:bg-slate-800
                      text-gray-900 dark:text-white
                      border-gray-300 dark:border-slate-700"
          >
            {years.map(y => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {/* KPI CARD DI ATAS */}
        {isLeader && (
          <KpiCard
            data={data}
            isLeader={isLeader}
            onSaveKpi={handleSaveKpi}
          />
        )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-gray-900 dark:text-white">
        {isLeader && !staffId ? (
          <div className="col-span-2 bg-white dark:bg-slate-900
            rounded-xl shadow p-6 text-center text-sm
            text-gray-500 dark:text-slate-300 border">
            Silakan pilih staff terlebih dahulu untuk melihat summary
          </div>
        ) : (
          <>
            <WeeklySummaryCard data={data} loading={loading} isLeader={isLeader} onSaveKpi={handleSaveKpi}/>
            <MonthlySummaryCard data={data} loading={loading} month={month} year={year} />
          </>
        )}
      </div>
    </div>
  )
}
