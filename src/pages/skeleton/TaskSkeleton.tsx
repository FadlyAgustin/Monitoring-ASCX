export default function TaskSkeleton() {
    return (
      <div className="bg-white rounded-xl shadow p-4 space-y-3 animate-pulse">
        <div className="h-3 w-40 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-3 w-32 bg-gray-200 rounded" />
  
        <div className="flex gap-2 pt-2">
          <div className="h-8 w-16 bg-gray-200 rounded" />
          <div className="h-8 w-16 bg-gray-200 rounded" />
          <div className="h-8 w-16 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }