export default function TaskRequestHistorySkeleton() {
    return (
      <div className="bg-white border rounded-xl p-4 shadow-sm animate-pulse space-y-3">
        
        {/* HEADER */}
        <div className="flex justify-between items-start border-b pb-2 mb-2 gap-2">
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
          <div className="h-4 w-14 bg-gray-200 rounded-full" />
        </div>
  
        {/* FROM TO */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="h-3 w-10 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
  
          <div className="h-4 w-4 bg-gray-200 rounded" />
  
          <div className="space-y-1 text-right">
            <div className="h-3 w-10 bg-gray-200 rounded ml-auto" />
            <div className="h-4 w-24 bg-gray-200 rounded ml-auto" />
          </div>
        </div>
  
        {/* FOOTER */}
        <div className="flex justify-between items-center pt-1">
          <div className="h-3 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }