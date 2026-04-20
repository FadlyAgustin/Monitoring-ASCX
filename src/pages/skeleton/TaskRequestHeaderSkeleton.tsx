export default function TaskRequestHeaderSkeleton() {
    return (
      <div className="space-y-5 animate-pulse">
        {/* 🔥 HEADER */}
        <div className="space-y-4">
           <h1 className="text-2xl font-bold mb-4">
            Task Assignment History
          </h1>
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