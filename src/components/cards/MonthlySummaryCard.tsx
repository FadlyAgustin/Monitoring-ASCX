import Badge from '../common/Badge'

type Props = {
  data: any
  prevData?: any // ⬅️ data bulan sebelumnya
  loading: boolean
  month: string
  year: string
}

function Stat({
  label,
  value,
  badge,
  icon,
}: {
  label: string
  value: string
  badge?: 'green' | 'red' | 'blue'
  icon?: string
}) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-gray-600 flex items-center gap-1">
        {icon} {label}
      </span>

      <span className="flex items-center gap-2 font-semibold text-gray-800">
        {badge && <Badge color={badge}>
            {badge === 'green' && 'Done'}
            {badge === 'red' && 'Pending'}
            {badge === 'blue' && 'Progress'}
          </Badge>}
        {value}
      </span>
    </div>
  )
}

export default function MonthlySummaryCard({
  data,
  prevData,
  loading,
  month,
  year,
}: Props) {
  const monthLabel = new Date(
    Number(year),
    Number(month) - 1
  ).toLocaleString('id-ID', { month: 'long' })

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6 space-y-6 animate-pulse">
  
        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-5 w-40 bg-gray-200 rounded" />
            <div className="h-3 w-28 bg-gray-200 rounded" />
          </div>
          <div className="h-6 w-32 bg-gray-200 rounded-full" />
        </div>
  
        {/* STATS */}
        <div className="bg-gray-100 p-3 rounded-lg space-y-3 border-t pt-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-3 w-28 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
  
        {/* PROGRESS */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-3 w-32 bg-gray-200 rounded" />
            <div className="h-3 w-10 bg-gray-200 rounded" />
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full" />
        </div>
  
        {/* GROWTH */}
        <div className="flex justify-between items-center border-t pt-3">
          <div className="h-3 w-40 bg-gray-200 rounded" />
          <div className="h-5 w-24 bg-gray-200 rounded-full" />
        </div>
  
        {/* INSIGHT */}
        <div className="bg-gray-50 border rounded-lg p-3 space-y-2">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-3 w-full bg-gray-200 rounded" />
          <div className="h-3 w-5/6 bg-gray-200 rounded" />
        </div>
  
      </div>
    )
  }

  if (!data) return null

  const { total, done, pending, progress } = data

  /* ================= KPI STATUS ================= */
  let statusLabel = ''
  let statusColor: 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'purple'
  let statusDesc = ''
  let statusIcon = ''

  if (progress >= 100) {
    statusLabel = '🔥 Target Tercapai'
    statusColor = 'green'
    statusDesc = 'Semua KPI berhasil diselesaikan dengan sangat baik.'
    statusIcon = '🔥'
  } else if (progress >= 70) {
    statusLabel = '📈 Mendekati Target'
    statusColor = 'blue'
    statusDesc = 'Performa sudah baik, tinggal sedikit lagi mencapai target.'
    statusIcon = '📈'
  } else if (progress >= 0) {
    statusLabel = 'Belum Ada Data KPI'
    statusColor = 'gray'
    statusDesc = 'Belum ada data KPI untuk bulan ini. Pastikan untuk mengisi target dan update progress secara rutin.'
    statusIcon = ''
  } else {
    statusLabel = '⚠️ Di Bawah Target'
    statusColor = 'red'
    statusDesc = 'Perlu peningkatan fokus dan penyelesaian task.'
    statusIcon = '⚠️'
  }

  /* ================= GROWTH ================= */
  let growth = 0
  let growthLabel = ''
  let growthColor: 'green' | 'red' | 'gray' = 'gray'

  if (prevData) {
    const prevProgress = prevData.progress || 0

    if (prevProgress > 0) {
      growth = progress - prevProgress
    }

    if (growth > 0) {
      growthLabel = `+${growth}% meningkat`
      growthColor = 'green'
    } else if (growth < 0) {
      growthLabel = `${growth}% menurun`
      growthColor = 'red'
    } else {
      growthLabel = 'Tidak berubah'
      growthColor = 'gray'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Ringkasan Bulanan
          </h3>
          <p className="text-xs text-gray-500">
            {monthLabel} {year}
          </p>
        </div>

        <Badge color={statusColor}>
          {statusLabel}
        </Badge>
      </div>

      {/* STATS */}
      <div className="grid bg-gray-100 p-3 rounded-lg gap-3 text-sm border-t pt-4">
        <Stat label="Total KPI" value={String(total)} icon="🎯" />
        <Stat label="Selesai" value={String(done)} badge="green" icon="✅" />
        <Stat label="Pending" value={String(pending)} badge="red" icon="⏳" />
        <Stat label="Produktivitas" value={`${progress}%`} badge="blue" icon="📈" />
      </div>

      {/* PROGRESS */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Progress Penyelesaian</span>
          <span className="font-medium text-gray-700">{progress}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              progress >= 100
                ? 'bg-green-600'
                : progress >= 70
                ? 'bg-blue-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* GROWTH */}
      {prevData && (
        <div className="flex justify-between items-center text-xs border-t pt-3">
          <span className="text-gray-500">
            Perbandingan bulan sebelumnya
          </span>
          <Badge color={growthColor}>
            {growthLabel}
          </Badge>
        </div>
      )}

      {/* INSIGHT */}
      <div className="bg-gray-50 border rounded-lg p-3">
        <p className="text-xs font-semibold text-gray-700 mb-1">
          Insight KPI
        </p>
        <p className="text-xs text-gray-600 leading-relaxed">
          {statusDesc}
        </p>
      </div>
    </div>
  )
}