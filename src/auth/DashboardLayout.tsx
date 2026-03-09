import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../src/components/layout/Sidebar'
import Navbar from '../../src/components/layout//Navbar'
import { useAuth } from '../pages/auth/useAuth'
import AppLoading from '../components/common/AppLoading'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { loading } = useAuth()

  if (loading) return <AppLoading />
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
