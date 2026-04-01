import Link from 'next/link';
import { Heart, MapPin, Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer" id="site-footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'var(--color-primary-600)', color: 'white', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}>
                <Activity size={20} strokeWidth={3} />
            </div>
            <span style={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.25rem', color: 'var(--color-primary-900)' }}>Pandey <span style={{ fontWeight: 300, opacity: 0.9 }}>Care</span></span>
          </div>
          <p className="footer-desc">
            Quality healthcare by Dr. Shivansh A. Pandey, MBBS. Compassionate medical care for every patient.
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <MapPin size={16} style={{ color: 'var(--color-primary-400)' }} />
            AIIMS Gorakhpur
          </div>
        </div>
        <div>
          <h4 className="footer-title">Quick Links</h4>
          <ul className="footer-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/book">Book Appointment</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="footer-title">For Patients</h4>
          <ul className="footer-links">
            <li><Link href="/signup">Create Account</Link></li>
            <li><Link href="/login">Patient Login</Link></li>
            <li><Link href="/my-appointments">My Appointments</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="footer-title">Clinic Hours</h4>
          <ul className="footer-links">
            <li>Morning: 09:00 – 13:00</li>
            <li>Evening: 17:00 – 22:00</li>
            <li style={{ marginTop: '0.5rem' }}>
              <Link href="https://maps.app.goo.gl/umzB6pd51wAKM3st6" target="_blank" rel="noopener noreferrer">
                📍 Get Directions
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Pandey Care. All rights reserved.</p>
      </div>
    </footer>
  );
}
