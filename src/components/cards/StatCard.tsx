import type { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  description?: string
}

export default function StatCard({
  title,
  value,
  icon,
  description,
}: StatCardProps) {
  return (
    <div
      className="
        bg-white rounded-xl
        p-5 shadow-sm border
        hover:shadow-md transition
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">
            {value}
          </h3>
        </div>

        {icon && (
          <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
            {icon}
          </div>
        )}
      </div>

      {description && (
        <p className="text-xs text-gray-400 mt-2">
          {description}
        </p>
      )}
    </div>
  )
}
