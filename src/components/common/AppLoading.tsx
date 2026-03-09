export default function AppLoading() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="
              w-10 h-10 rounded-full
              bg-gradient-to-br from-[#0d2741] to-[#123a61]
              flex items-center justify-center
              text-white font-bold text-lg
            "
          >
            ✈️
          </div>
          <h1 className="text-xl font-semibold tracking-wide text-gray-800">
            ASCX
          </h1>
        </div>
  
        {/* Loading text */}
        <p className="text-sm text-gray-500 mb-4">
          Memuat sistem monitoring ASCX
        </p>
  
        {/* Dots animation (gmail style) */}
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
        </div>
      </div>
    )
  }
  