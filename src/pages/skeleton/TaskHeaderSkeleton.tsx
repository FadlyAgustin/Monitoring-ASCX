import { ListTodo } from "lucide-react";

export default function TaskRequestHeaderSkeleton() {
    return (
    <div className="space-y-4 animate-pulse">
    <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-emerald-900">
        <ListTodo
            size={20}
            className="text-emerald-600 dark:text-emerald-300"
        />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
        Daily Task / Activity Log
        </h2>
    </div>

    <p className="text-sm text-gray-500 dark:text-gray-400">
        Riwayat aktivitas dan tugas harian yang dilaksanakan oleh tim Airport Service & Customer Experience sebagai sarana monitoring pelaksanaan pekerjaan, tindak lanjut layanan, dan dokumentasi operasional secara terintegrasi.
    </p>
    </div>
    )
}