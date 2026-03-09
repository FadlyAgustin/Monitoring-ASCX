const CardSkeleton = () => {
    return (
      <div className="bg-white rounded shadow p-4 space-y-2 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    )
  }
  
  export default CardSkeleton