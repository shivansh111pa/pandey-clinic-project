'use client';

import { useState, useEffect } from 'react';
import { Calendar, Users, ClipboardList, CheckCircle } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
      appointmentsToday: 0,
      totalPatients: 0,
      uncompletedAppointments: 0,
      totalPrescriptions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
         if (data.stats) setStats(data.stats);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Welcome back, Dr. Pandey. Here is your clinic&apos;s overview.</p>
      </div>

      {loading ? (
         <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
            <div className="spinner spinner-lg"></div>
         </div>
      ) : (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: 'var(--color-info-light)', color: 'var(--color-info)' }}>
                <Calendar size={20} />
              </div>
              <div className="stat-card-label">Appointments Today</div>
              <div className="stat-card-value">{stats.appointmentsToday}</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: 'var(--color-primary-100)', color: 'var(--color-primary-600)' }}>
                <Users size={20} />
              </div>
              <div className="stat-card-label">Total Patients</div>
              <div className="stat-card-value">{stats.totalPatients}</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
                <ClipboardList size={20} />
              </div>
              <div className="stat-card-label">Upcoming / Booked</div>
              <div className="stat-card-value">{stats.uncompletedAppointments}</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
                <CheckCircle size={20} />
              </div>
              <div className="stat-card-label">Prescriptions Issued</div>
              <div className="stat-card-value">{stats.totalPrescriptions}</div>
            </div>
          </div>
      )}

      {/* Placeholder for Quick Actions or Recent Appointments Table */}
      <div className="scroll-animate stagger-1" style={{ marginTop: '2rem' }}>
          <h2>Quick Actions</h2>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => window.location.href='/admin/schedule'}>Manage Schedule</button>
              <button className="btn btn-primary" onClick={() => window.location.href='/admin/appointments'}>View All Appointments</button>
          </div>
      </div>
    </>
  );
}
