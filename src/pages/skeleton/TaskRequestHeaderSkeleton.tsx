import { History } from 'lucide-react'

export default function TaskRequestHeaderSkeleton() {
    return (
      <div className="space-y-5 animate-pulse">
        {/* 🔥 HEADER */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900">
              <History
                size={20}
                className="text-indigo-600 dark:text-indigo-300"
              />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Task Request History
            </h1>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Riwayat seluruh permintaan tugas yang telah diajukan, termasuk status
            persetujuan, detail pekerjaan, waktu pengajuan, serta progres
            penyelesaian untuk memudahkan proses monitoring dan evaluasi.
          </p>
        </div>
  
        {/* 📅 FILTER */}
        <div className="flex justify-end items-center">
          <div className="flex items-center gap-2">
            {/* input date */}
            <div className="h-8 w-36 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    )
  }