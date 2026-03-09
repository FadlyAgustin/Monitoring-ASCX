const TableSkeleton = () => {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="border-t animate-pulse">
          <td className="p-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </td>
          <td className="p-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </td>
          <td className="p-2">
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </td>
          <td className="p-2">
            <div className="h-6 bg-gray-200 rounded w-24"></div>
          </td>
          <td className="p-2">
            <div className="h-4 bg-gray-200 rounded w-40"></div>
          </td>
          <td className="p-2">
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </td>
          <td className="p-2">
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </td>
          <td className="p-2">
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </td>
        </tr>
      ))}
    </>
  )
}

export default TableSkeleton