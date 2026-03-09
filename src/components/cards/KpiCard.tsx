import { useState } from 'react'

type Props = {
  data: any
  isLeader?: boolean
  onSaveKpi?: (payload: any) => void
}

export default function KpiCard({ isLeader, onSaveKpi }: Props) {
    const [kpiDetails, setKpiDetails] = useState([
      { jobdesk: '', target: 0 }
    ])
  
    return (
      <div className="bg-white rounded-xl shadow p-5 space-y-4">
  
        {/* ================= SET KPI ================= */}
        {isLeader && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Set KPI</p>
  
            {kpiDetails.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Jobdesk (contoh: Desain)"
                  value={item.jobdesk}
                  onChange={e => {
                    const newData = [...kpiDetails]
                    newData[i].jobdesk = e.target.value
                    setKpiDetails(newData)
                  }}
                  className="border px-2 py-1 rounded w-full"
                />
  
                <input
                  type="number"
                  placeholder="Target"
                  value={item.target}
                  onChange={e => {
                    const newData = [...kpiDetails]
                    newData[i].target = Number(e.target.value)
                    setKpiDetails(newData)
                  }}
                  className="border px-2 py-1 rounded w-24"
                  min={0}
                />
              </div>
            ))}
  
            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() =>
                  setKpiDetails([...kpiDetails, { jobdesk: '', target: 0 }])
                }
                className="text-xs text-blue-500"
              >
                + Tambah KPI
              </button>
  
              <button
                onClick={() => onSaveKpi?.(kpiDetails)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Simpan KPI
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }