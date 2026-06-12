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
      <div className=" bg-white dark:bg-slate-900
      rounded-xl shadow p-5 space-y-4
      text-gray-900 dark:text-white">
  
        {/* ================= SET KPI ================= */}
        {isLeader && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-800 dark:text-white">Set KPI</p>
  
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
                  className="border rounded w-full px-2 py-1 text-sm
                  bg-white dark:bg-slate-800
                  text-gray-900 dark:text-white
                  border-gray-300 dark:border-slate-700
                  focus:ring-2 focus:ring-cyan-500 outline-none"
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
                  className="border rounded w-24 px-2 py-1 text-sm
                  bg-white dark:bg-slate-800
                  text-gray-900 dark:text-white
                  border-gray-300 dark:border-slate-700
                  focus:ring-2 focus:ring-cyan-500 outline-none"
                  min={0}
                />
              </div>
            ))}
  
            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() =>
                  setKpiDetails([...kpiDetails, { jobdesk: '', target: 0 }])
                }
                className="text-xs
                text-cyan-600 dark:text-cyan-400"
              >
                + Tambah KPI
              </button>
  
              <button
                onClick={() => onSaveKpi?.(kpiDetails)}
                className="bg-cyan-600 hover:bg-cyan-700
                text-white px-3 py-1 rounded text-sm"
              >
                Simpan KPI
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }