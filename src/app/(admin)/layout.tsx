'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="admin-layout">
      <Sidebar pathname={pathname} />
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}
