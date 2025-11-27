'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Phone,
  CheckSquare,
  FileText,
  BarChart3,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/contacts', label: 'Contacts', icon: Users },
    { href: '/deals', label: 'Deals', icon: Briefcase },
    { href: '/calls', label: 'Calls', icon: Phone },
    { href: '/tasks', label: 'Tasks', icon: CheckSquare },
    { href: '/notes', label: 'Notes', icon: FileText },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-lg"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`sidebar ${isOpen ? 'block' : 'hidden'} md:block`}
        style={{
          width: isOpen ? '280px' : '0',
          transition: 'width 0.3s ease',
        }}
      >
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <LayoutDashboard size={28} color="#ff8c00" />
            <span>CRM Pro</span>
          </div>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
            Sales Management
          </p>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '20px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
          }}
        >
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
            Need Help?
          </h4>
          <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
            Check our documentation or contact support.
          </p>
          <button
            className="btn btn-secondary"
            style={{ width: '100%', fontSize: '12px' }}
          >
            Get Support
          </button>
        </div>
      </aside>
    </>
  );
}
