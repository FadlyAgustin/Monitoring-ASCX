export default function LogDeleteHeaderSkeleton() {
    return (
      <div className="space-y-4 animate-pulse">
        
        {/* TITLE */}
        <div className="space-y-4">
           <h1 className="text-2xl font-bold mb-4">
           Delete Request Logs
          </h1>
        </div>
  
        {/* SEARCH + FILTER */}
        <div className="flex gap-2">
          <div className="h-10 w-full bg-gray-200 rounded-lg" />
          <div className="h-10 w-32 bg-gray-200 rounded-lg" />
        </div>
  
      </div>
    )
  }