import { Radar } from "lucide-react";

export default function SupervisorDashboardSkeleton() {
    return (
      <div className="space-y-4 animate-pulse">

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
      </div>
  )
  }