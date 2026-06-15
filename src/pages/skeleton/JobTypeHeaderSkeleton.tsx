import { Briefcase } from "lucide-react";

export default function JobTypeHeaderSkeleton() {
    return (
      <div className="space-y-4 animate-pulse">
        
       <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-violet-900">
              <Briefcase
                size={20}
                 className="text-violet-500 dark:text-violet-300"
              />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Job Type
            </h1>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
           Master data kategori pekerjaan yang digunakan dalam sistem ASCX untuk
           mengelompokkan jenis tugas operasional, mendukung konsistensi input
           data, serta mempermudah pelacakan dan pelaporan aktivitas kerja.
          </p>
      </div>
    )
  }