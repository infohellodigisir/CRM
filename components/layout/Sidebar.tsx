/**
 * Sidebar Navigation Component
 * Provides main navigation for the CRM application
 * Includes links to Contacts, Deals, Call Logs, Tasks, and Notes
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Users,
  Briefcase,
  Phone,
  CheckSquare,
  FileText,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    label: 'Contacts',
    href: '/contacts',
    icon: Users,
    description: 'Manage your contacts',
  },
  {
    label: 'Deals',
    href: '/deals',
    icon: Briefcase,
    description: 'Track your deals',
  },
  {
    label: 'Call Logs',
    href: '/calls',
    icon: Phone,
    description: 'View call history',
  },
  {
    label: 'Tasks',
    href: '/tasks',
    icon: CheckSquare,
    description: 'Manage tasks',
  },
  {
    label: 'Notes',
    href: '/notes',
    icon: FileText,
    description: 'View notes',
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'View reports',
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 dark:text-white">CRM Pro</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Sales Management</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-xs opacity-75">{item.description}</p>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-200">
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}
