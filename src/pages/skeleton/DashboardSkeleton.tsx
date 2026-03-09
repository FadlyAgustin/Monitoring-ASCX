export default function DashboardSkeleton() {
    return (
      <div className="space-y-8 animate-pulse">
  
        {/* Header Skeleton 
        <div>
          <div className="h-7 w-40 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-64 bg-gray-200 rounded" />
        </div>
        */}

        {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Ringkasan aktivitas dan progres pekerjaan hari ini
        </p>
      </div>

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
  