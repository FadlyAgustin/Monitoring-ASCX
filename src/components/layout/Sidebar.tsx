import { Users } from 'lucide-react'
import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../pages/auth/useAuth'
import { UserRole } from '../../pages/auth/UserRole'

/* ================= ROLE GROUP ================= */

const leaderRoles: UserRole[] = [
  UserRole.ASSISTANT_MANAGER_ASCX,
  UserRole.SUPERVISOR_ASCX,
]

const dashboardRoles: UserRole[] = [
  UserRole.STAFF_ASCX,
  UserRole.STAFF_IT,
]

const staffRoles: UserRole[] = [
  UserRole.STAFF_ASCX,
  UserRole.STAFF_IT,
  UserRole.SUPERVISOR_ASCX,
]

const allRoles: UserRole[] = [
  ...leaderRoles,
  ...staffRoles,
]

/* ================= MENU CONFIG ================= */

const menus: {
  to: string
  label: string
  icon: ReactNode
  roles: UserRole[]
}[] = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: '📊',
    roles: dashboardRoles,
  },
  {
    to: '/leader',
    label: 'Dashboard',
    icon: '👔',
    roles: leaderRoles,
  },
  {
    to: '/daily-task',
    label: 'Daily Task',
    icon: '📝',
    roles: staffRoles,
  },
  {
    to: '/summary',
    label: 'Summary',
    icon: '📅',
    roles: allRoles, // semua boleh
  },
  {
    to: '/user-management',
    label: 'User Management',
    icon: <Users className="w-5 h-5 text-blue-500 group-hover:text-blue-600 transition" />,
    roles: leaderRoles,
  },
  {
    to: '/job-type',
    label: 'Job Type',
    icon: '⚙️',
    roles: leaderRoles,
  }
]

/* ================= COMPONENT ================= */

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuth()
  
  if (!user) return null

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `
      flex items-center gap-3 px-4 py-3 rounded-lg transition
      ${
        isActive
          ? 'bg-white/20 text-white font-medium'
          : 'text-white/80 hover:bg-white/10 hover:text-white'
      }
    `

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-30"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-40
          w-64 min-h-screen
          bg-gradient-to-b from-[#0d2741] to-[#123a61]
          text-white shadow-xl
          transform transition-transform duration-300 
          ${open ? 'translate-x-0' : '-translate-x-full' }
        `}
      >
        <div className="px-4 py-6 border-b border-white/10">
          <h2 className="text-lg font-semibold">Sistem Monitoring</h2>
          <p className="text-xs text-white/60 mt-1">Internal Dashboard</p>
        </div>

        <nav className="px-3 py-6 space-y-1 text-sm" >
          {menus
            .filter(menu => menu.roles.includes(user.role))
            .map(menu => (
              <NavLink
                key={menu.to}
                to={menu.to}
                className={linkClass}
                onClick={onClose}
              >
                <span className="text-lg">{menu.icon}</span>
                <span>{menu.label}</span>
              </NavLink>
            ))}
        </nav>
      </aside>
    </>
  )
}
