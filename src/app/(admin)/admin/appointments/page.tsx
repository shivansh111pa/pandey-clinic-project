'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/appointments')
      .then(res => res.json())
      .then(data => {
         if (data.appointments) setAppointments(data.appointments);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (aptId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/appointments/${aptId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setAppointments(prev => prev.map(a => a._id === aptId ? { ...a, status: newStatus } : a));
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
       console.error(error);
       alert('Failed to update status');
    }
  };

  return (
    <>
      <div className="admin-page-header">
        <h1>All Appointments</h1>
        <p>Manage patient appointments and prescribe medications.</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="spinner spinner-lg"></div>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Patient</th>
              <th>Status</th>
              <th>Reason</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => (
              <tr key={apt._id}>
                <td>
                  <div style={{ fontWeight: 500 }}>{new Date(apt.date).toLocaleDateString()}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-500)' }}>{apt.startTime}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{apt.patientId?.name || 'Unknown'}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-500)' }}>{apt.patientId?.phone}</div>
                </td>
                <td>
                    <select
                        value={apt.status}
                        onChange={(e) => handleStatusChange(apt._id, e.target.value)}
                        className={`badge badge-${apt.status}`}
                        style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                        disabled={apt.status === 'completed'}
                    >
                        <option value="booked">Booked</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="no-show">No Show</option>
                        {apt.status === 'completed' && <option value="completed">Completed</option>}
                    </select>
                </td>
                <td>
                   <div style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {apt.problemDescription}
                   </div>
                </td>
                <td>
                    {(apt.status === 'booked' || apt.status === 'confirmed') ? (
                        <Link href={`/admin/prescriptions/new/${apt._id}`} className="btn btn-primary btn-sm">
                            Consult & Prescribe
                        </Link>
                    ) : apt.status === 'completed' ? (
                        <Link href={`/api/prescriptions/${apt._id}/pdf`} target="_blank" className="btn btn-secondary btn-sm">
                            View PDF
                        </Link>
                    ) : (
                        '-'
                    )}
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No appointments found.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </>
  );
}
