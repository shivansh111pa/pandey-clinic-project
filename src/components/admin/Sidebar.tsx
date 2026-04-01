import Link from 'next/link';
import { Home, Calendar, Settings, FileText, Activity } from 'lucide-react';
import React from 'react';

export default function AdminSidebar({ pathname }: { pathname: string }) {
  const isLinkActive = (path: string) => {
    if (path === '/admin' && pathname === '/admin') return true;
    if (path !== '/admin' && pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
    { href: '/admin/prescriptions', label: 'Prescriptions', icon: FileText },
    { href: '/admin/schedule', label: 'Schedule Manager', icon: Settings },
  ];

  return (
    <div className="admin-sidebar" style={{ minHeight: '100%', height: '100vh', position: 'sticky', top: 0 }}>
      <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
         <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={24} />
         </div>
         <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.25rem' }}>Pandey Admin</span>
      </div>

      <div className="admin-sidebar-title">Menu</div>
      <ul className="admin-nav">
        {navItems.map((item) => {
          const IconStyle = item.icon;
          const active = isLinkActive(item.href);
          return (
            <li key={item.href}>
              <Link 
                 href={item.href} 
                 className={`admin-nav-link ${active ? 'active' : ''}`}
                 style={active ? { boxShadow: 'inset 4px 0 0 var(--color-primary-500)' } : {}}
              >
                <IconStyle size={20} style={{ color: active ? 'var(--color-primary-600)' : 'var(--color-neutral-400)' }} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      
      <div style={{ marginTop: 'auto', padding: '2rem 1.5rem' }}>
          <div style={{ padding: '1rem', background: 'var(--color-primary-50)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
             <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-700)' }}>Dr. Shivansh Pandey</p>
             <p style={{ fontSize: '0.75rem', color: 'var(--color-primary-500)' }}>Administrator</p>
          </div>
      </div>
    </div>
  );
}
