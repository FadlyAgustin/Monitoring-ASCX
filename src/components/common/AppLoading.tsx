export default function AppLoading() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">

      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, #38bdf8 1px, transparent 1px),
              linear-gradient(to bottom, #38bdf8 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Scan Line */}
      <div className="scan-line absolute inset-0" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">

        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-2 text-4xl">✈️</div>

          <h1 className="text-3xl font-bold tracking-[0.3em] text-white">
            ASCX
          </h1>

          <p className="mt-2 text-sm text-sky-400">
            Airport Service Coordination Center
          </p>
        </div>

        {/* Radar */}
        <div className="relative mb-8 h-48 w-48">

          {/* Ring 1 */}
          <div className="absolute inset-0 rounded-full border border-sky-500/20" />

          {/* Ring 2 */}
          <div className="absolute inset-5 rounded-full border border-sky-500/20" />

          {/* Ring 3 */}
          <div className="absolute inset-10 rounded-full border border-sky-500/20" />

          {/* Cross */}
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-sky-500/20" />

          <div className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-sky-500/20" />

          {/* Sweep */}
          <div className="radar-sweep absolute inset-0 rounded-full" />

          {/* Center Dot */}
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.9)]" />

          {/* Aircraft */}
          <div className="absolute top-[28%] left-[65%] text-sky-400 text-sm animate-pulse">
            ✈
          </div>
        </div>

        {/* Status */}
        <div className="w-full max-w-sm rounded-xl border border-sky-500/20 bg-slate-900/60 p-4 backdrop-blur">
          <p className="mb-4 text-center text-sm text-slate-300">
            Memuat Sistem Monitoring ASCX
          </p>

          <div className="space-y-3 text-xs">
            <StatusItem label="Memuat Profil Pengguna" />
            <StatusItem label="Sinkronisasi Data Operasional" />
            <StatusItem label="Menghubungkan Database" />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 text-slate-300">
      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      <span>{label}</span>
    </div>
  )
}