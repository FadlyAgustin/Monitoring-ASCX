import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../src/components/layout/Sidebar'
import Navbar from '../../src/components/layout//Navbar'
import { useAuth } from '../pages/auth/AuthContext'
import AppLoading from '../components/common/AppLoading'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { loading } = useAuth()

  if (loading) return <AppLoading />
  return (
    <div className="flex
    min-h-screen

    bg-gradient-to-br
    from-slate-50
    via-white
    to-cyan-50

    dark:from-slate-950
    dark:via-slate-950
    dark:to-slate-900

    transition-colors">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className=" min-w-0
          p-4 md:p-6
          overflow-y-auto
          text-gray-900
          dark:text-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
