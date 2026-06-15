import { Radar } from "lucide-react";

export default function DashboardSkeleton() {
    return (
      <div className="space-y-8 animate-pulse">

        {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <Radar
                size={20}
                className="text-cyan-600 dark:text-cyan-300"
              />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              ASCX Monitoring Dashboard
            </h1>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
           Pusat monitoring dan pengelolaan aktivitas Airport Service & Customer Experience (ASCX), yang menyediakan informasi terkait tugas harian, permintaan pekerjaan, progres aktivitas, serta data operasional lainnya untuk mendukung koordinasi dan pengawasan layanan secara menyeluruh.
          </p>


        {/* Stat Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white p-5 rounded-xl shadow border">
              <div className="flex justify-between">
                <div>
                  <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                  <div className="h-7 w-10 bg-gray-300 rounded" />
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
  
        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  
          {/* Aktivitas */}
          <div className="bg-white rounded-xl shadow p-4 space-y-3">
            <div className="h-5 w-40 bg-gray-200 rounded" />
            {[1,2,3].map(i => (
              <div key={i} className="h-4 bg-gray-200 rounded" />
            ))}
          </div>
  
          {/* Status */}
          <div className="bg-white rounded-xl shadow p-4 space-y-3">
            <div className="h-5 w-48 bg-gray-200 rounded" />
            {[1,2,3].map(i => (
              <div key={i} className="h-4 bg-gray-200 rounded" />
            ))}
          </div>
  
        </div>
      </div>
    )
  }
  