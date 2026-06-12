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
        bg-white dark:bg-slate-900
        border border-gray-200 dark:border-slate-800
        text-gray-900 dark:text-white
        rounded-xl
        p-5
        shadow-sm
        hover:shadow-md
        transition
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-white">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
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
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
          {description}
        </p>
      )}
    </div>
  )
}
