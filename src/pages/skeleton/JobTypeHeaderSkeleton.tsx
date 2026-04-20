export default function JobTypeHeaderSkeleton() {
    return (
      <div className="flex justify-between items-center animate-pulse">
        
        {/* LEFT */}
        <div>
        <h1 className="text-2xl font-bold">Job Type</h1>
            <p className="text-sm text-gray-500">
              Kelola kategori pekerjaan
            </p>
        </div>
  
        {/* RIGHT BUTTON */}
        <div className="h-9 w-28 bg-gray-200 rounded-lg" />
      </div>
    )
  }