import { useState } from 'react'

interface ImageFile {
  id: number
  url: string
  name: string
}

export default function ImageSlider({ images }: { images: ImageFile[] }) {
  const [index, setIndex] = useState(0)

  const getImageUrl = (path: string) => {
    if (!path) return ''
    if (path.startsWith('http')) return path
    return `${import.meta.env.VITE_API_URL}/storage/${path}`
  }

  if (!images || images.length === 0) return null

  return (
    <div className="relative w-full">
      {/* Image */}
      <img
        src={getImageUrl(images[index].url)}
        alt={images[index].name}
        className="w-full max-h-72 object-contain rounded-lg border bg-white"
      />

      {/* Prev */}
      {images.length > 1 && (
        <>
          <button
            onClick={() =>
              setIndex(i => (i === 0 ? images.length - 1 : i - 1))
            }
            className="absolute left-2 top-1/2 -translate-y-1/2
                       bg-black/50 text-white px-2 py-1 rounded-full"
          >
            ‹
          </button>

          {/* Next */}
          <button
            onClick={() =>
              setIndex(i => (i === images.length - 1 ? 0 : i + 1))
            }
            className="absolute right-2 top-1/2 -translate-y-1/2
                       bg-black/50 text-white px-2 py-1 rounded-full"
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition ${
                i === index ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
