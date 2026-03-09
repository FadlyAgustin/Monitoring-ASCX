import Badge from '../common/Badge'

type Props = {
  data: any
  loading: boolean
  isLeader?: boolean
  onSaveKpi?: (payload: any) => void
}

export default function WeeklySummaryCard({ data, loading}: Props) {
  if (loading) {
  return (
    <div className="bg-white rounded-xl shadow p-5 space-y-5 animate-pulse">

      {/* HEADER */}
      <div className="space-y-2">
        <div className="h-5 w-40 bg-gray-200 rounded" />
        <div className="h-3 w-32 bg-gray-200 rounded" />
      </div>

      {/* SUMMARY GRID */}
      <div className="grid grid-cols-2 gap-4">

        {/* KIRI */}
        <div className="bg-gray-100 p-3 rounded-lg space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-3 w-12 bg-gray-200 rounded" />
            </div>
          ))}
        </div>

        {/* KANAN */}
        <div className="bg-gray-100 p-3 rounded-lg space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-3 w-12 bg-gray-200 rounded" />
            </div>
          ))}
        </div>

      </div>

      {/* DIVIDER */}
      <div className="border-t pt-4" />

      {/* KPI DETAIL */}
      <div className="space-y-4">

        {/* HEADER KPI */}
        <div className="flex justify-between items-center">
          <div className="h-4 w-40 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>

        {/* LIST KPI */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-3 rounded-lg border bg-gray-50 space-y-2">

            {/* TOP */}
            <div className="flex justify-between">
              <div className="h-3 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>

            {/* PROGRESS BAR */}
            <div className="w-full bg-gray-200 rounded-full h-2" />

            {/* FOOTER */}
            <div className="flex justify-end">
              <div className="h-2 w-8 bg-gray-200 rounded" />
            </div>

          </div>
        ))}

      </div>

    </div>
  )
}

  if (!data) return null

  const {
    done,
    pending,
    in_progress,
    late,
    on_time,
    target
  } = data

  return (
    <div className="bg-white rounded-xl shadow p-5 space-y-5">

  {/* ================= HEADER ================= */}
  <div>
    <h3 className="font-semibold text-gray-800 text-lg">
      Weekly Activity
    </h3>
    <p className="text-xs text-gray-500">
      Ringkasan performa mingguan
    </p>
  </div>

  {/* ================= SUMMARY GRID ================= */}
  <div className="grid grid-cols-2 gap-4 text-sm">

  {/* KIRI */}
  <div className="bg-gray-100 p-3 rounded-lg space-y-2">
    <SummaryRow label="KPI Target" value={target} />

    <SummaryRow
      label="Selesai"
      value={done}
      badgeLabel="Done"
      badgeColor="green"
    />

    <SummaryRow
      label="Proses"
      value={in_progress}
      badgeLabel="In Progress"
      badgeColor="yellow"
    />
  </div>

  {/* KANAN */}
  <div className="bg-gray-100 p-3 rounded-lg space-y-2">
    <SummaryRow
      label="Pending"
      value={pending}
      badgeLabel="Pending"
      badgeColor="red"
    />

    <SummaryRow
      label="Terlambat"
      value={late}
      badgeLabel="Late"
      badgeColor="red"
    />

    <SummaryRow
      label="Tepat Waktu"
      value={on_time}
      badgeLabel="On Time"
      badgeColor="green"
    />
  </div>

</div>

  {/* ================= DIVIDER ================= */}
  <div className="border-t pt-4" />

  {/* ================= KPI DETAIL ================= */}
  {data.kpi_details && data.kpi_details.length > 0 && (
    <div className="space-y-4">

      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold text-gray-700">
          KPI Progress by Jobdesk
        </p>
        <span className="text-xs text-gray-400">
          Detail performa
        </span>
      </div>

      {/* LIST KPI */}
      <div className="space-y-3">
        {data.kpi_details.map((item: any, i: number) => (
          <div
            key={i}
            className="p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 transition"
          >
            {/* TOP */}
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">
                {item.jobdesk}
              </span>

              <span className="text-xs text-gray-500">
                {item.done}/{item.target}
              </span>
            </div>

            {/* PROGRESS BAR */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`
                  h-2 rounded-full transition-all
                  ${item.progress >= 100
                    ? 'bg-green-500'
                    : item.progress >= 70
                    ? 'bg-blue-500'
                    : item.progress >= 40
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                  }
                `}
                style={{ width: `${item.progress}%` }}
              />
            </div>

            {/* FOOTER */}
            <div className="flex justify-end mt-1">
              <span className="text-[10px] text-gray-400">
                {item.progress}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
</div>
  )
}

function SummaryRow({
  label,
  value,
  badgeLabel,
  badgeColor,
}: {
  label: string
  value: number | string
  badgeLabel?: 'Done' | 'In Progress' | 'Pending' | 'Deadline' | 'Late' | 'On Time'
  badgeColor?: 'green' | 'yellow' | 'red'
}) {
  return (
    <div className="flex justify-between text-sm">
      <span>{label}</span>
      <span className="flex items-center gap-2">
        {badgeLabel && badgeColor && (
          <Badge color={badgeColor}>
            {badgeLabel}
          </Badge>
        )}
        <strong>{value}</strong>
      </span>
    </div>
  )
}