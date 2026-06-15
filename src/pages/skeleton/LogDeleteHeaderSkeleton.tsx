import { Trash2 } from "lucide-react";

export default function LogDeleteHeaderSkeleton() {
    return (
      <div className="space-y-4 animate-pulse">
        
        {/* TITLE */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900">
            <Trash2
              size={20}
              className="text-red-300 dark:text-red-300"
            />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Delete Request Logs
          </h1>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Riwayat permintaan penghapusan tugas yang telah diajukan dalam sistem
          Airport Service & Customer Experience (ASCX), mencakup informasi pemohon,
          detail tugas yang dihapus, status persetujuan, waktu pengajuan, serta
          catatan tindak lanjut sebagai bagian dari kontrol dan audit aktivitas
          operasional.
        </p>
  
      </div>
    )
  }