import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  title?: string
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal box */}
      <div
        className="
          relative z-[1000]
          bg-white rounded-xl shadow-xl
          w-full max-w-lg
          p-6
          max-h-[90vh] overflow-y-auto
        "
      >
        {title && (
          <h3 className="text-lg font-semibold mb-4">
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>,
    document.body
  )
}
