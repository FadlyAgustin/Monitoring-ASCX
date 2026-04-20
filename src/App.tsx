import { BrowserRouter, Routes, Route } from 'react-router-dom'

import DashboardLayout from '../src/auth/DashboardLayout'
import AuthLayout from '../src/auth/AuthLayout'

// Pages
import Login from './pages/auth/Login'
import ProtectedRoute from './pages/auth/ProtectedRoute'
import Dashboard from '../src/pages/dashboard/Dashboard'
import DailyTask from '../src/pages/dashboard/DailyTask'
import Summary from '../src/pages/dashboard/Summary'
import SupervisorDashboard from '../src/pages/dashboard/SupervisorDashboard'
import UserManagement from '../src/pages/dashboard/UserManagement'
import { AuthProvider } from './pages/auth/AuthProvider'

import { Toaster } from "react-hot-toast"
import { UserRole } from './pages/auth/UserRole'
import JobType from './pages/dashboard/JobType'
import LogDelete from './pages/dashboard/LogDelete'
import TaskRequestHistory from './pages/dashboard/TaskRequestHistory'

function App() {
  return (
    <>
      <Toaster position="top-right" />

      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* AUTH */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
            </Route>

            {/* ===== STAFF ONLY ===== */}
            <Route element={
              <ProtectedRoute allow={[
                UserRole.STAFF_IT,
                UserRole.STAFF_ASCX
              ]}/>
            }>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
            </Route>

            {/* ===== STAFF & SUPERVISOR ===== */}
            <Route element={
              <ProtectedRoute allow={[
                UserRole.STAFF_IT,
                UserRole.STAFF_ASCX,
                UserRole.SUPERVISOR_ASCX
              ]}/>
            }>
              <Route element={<DashboardLayout />}>
                <Route path="/daily-task" element={<DailyTask />} />
              </Route>
            </Route>

            {/* ===== LEADER ONLY ===== */}
            <Route element={
              <ProtectedRoute allow={[
                UserRole.ASSISTANT_MANAGER_ASCX,
                UserRole.SUPERVISOR_ASCX
              ]}/>
            }>
              <Route element={<DashboardLayout />}>
                <Route path="/leader" element={<SupervisorDashboard />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/job-type" element={<JobType />} />
                <Route path="/log-delete" element={<LogDelete />} />
              </Route>
            </Route>

            {/* ===== ALL ROLES ===== */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/summary" element={<Summary />} />
                <Route path="/task-request-logs" element={<TaskRequestHistory />} />
              </Route>
            </Route>

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
