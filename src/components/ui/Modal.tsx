import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  title?: ReactNode
  onClose: () => void
  children: ReactNode
}

export default function Modal({
  open,
  title,
  onClose,
  children,
}: ModalProps) {
  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div
        className="
        relative z-[1000]
        bg-white dark:bg-slate-900
        text-gray-900 dark:text-white
        border border-gray-200 dark:border-slate-800
        rounded-xl shadow-xl
        w-full max-w-lg
        p-6
        max-h-[90vh] overflow-y-auto
        "
      >
        {title && (
          <div className="mb-4">
            {title}
          </div>
        )}

        {children}
      </div>
    </div>,
    document.body
  )
}