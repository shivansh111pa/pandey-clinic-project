'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Heart, Activity } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = session?.user?.role === 'admin';

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">
          <div className="navbar-brand-icon" style={{ background: 'white', color: 'var(--color-primary-600)', padding: '5px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={20} strokeWidth={3} />
          </div>
          <span style={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.25rem', whiteSpace: 'nowrap' }}>Pandey <span style={{ fontWeight: 300, opacity: 0.9 }}>Care</span></span>
        </Link>

        <ul className="navbar-links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`navbar-link ${isActive(link.href) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {session && !isAdmin && (
            <>
              <li>
                <Link
                  href="/book"
                  className={`navbar-link ${isActive('/book') ? 'active' : ''}`}
                >
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link
                  href="/my-appointments"
                  className={`navbar-link ${isActive('/my-appointments') ? 'active' : ''}`}
                >
                  Appointments & Prescriptions
                </Link>
              </li>
            </>
          )}
          {isAdmin && (
            <li>
              <Link
                href="/admin"
                className={`navbar-link ${pathname.startsWith('/admin') ? 'active' : ''}`}
              >
                Dashboard
              </Link>
            </li>
          )}
        </ul>

        <div className="navbar-actions">
          {session ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>
                {session.user.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="btn btn-secondary btn-sm"
                id="logout-btn"
              >
                Logout
              </button>
            </div>
          ) : status === 'unauthenticated' ? (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">
                Log in
              </Link>
              <Link href="/signup" className="btn btn-primary btn-sm">
                Sign up
              </Link>
            </>
          ) : (
            <div style={{ width: '130px', height: '36px' }}></div>
          )}
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          id="mobile-menu-toggle"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="navbar-link"
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        {session && !isAdmin && (
          <>
            <Link href="/book" className="navbar-link" onClick={() => setMobileOpen(false)}>
              Book Appointment
            </Link>
            <Link href="/my-appointments" className="navbar-link" onClick={() => setMobileOpen(false)}>
              Appointments & Prescriptions
            </Link>
          </>
        )}
        {isAdmin && (
          <Link href="/admin" className="navbar-link" onClick={() => setMobileOpen(false)}>
            Dashboard
          </Link>
        )}
        {session ? (
          <button onClick={() => signOut({ callbackUrl: '/' })} className="btn btn-secondary btn-sm">
            Logout
          </button>
        ) : status === 'unauthenticated' ? (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link href="/login" className="btn btn-ghost btn-sm">Log in</Link>
            <Link href="/signup" className="btn btn-primary btn-sm">Sign up</Link>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
