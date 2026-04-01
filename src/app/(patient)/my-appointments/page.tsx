'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Calendar, Clock, FileText } from 'lucide-react';

type AppointmentType = {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  problemDescription: string;
  doctorId: { name: string };
};
//hlo shiv
export default function MyAppointmentsPage() {
  const { data: session, status } = useSession();
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApts = async () => {
      try {
        const res = await fetch('/api/my-appointments');
        const data = await res.json();
        if (data.appointments) {
          setAppointments(data.appointments);
        }
      } catch (error) {
        console.error('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };
    
    if (status === 'authenticated') {
      fetchApts();
    } else if (status === 'unauthenticated') {
      window.location.href = '/login';
    }
  }, [status]);

  const getBadgeClass = (status: string) => {
    switch (status) {
      case 'booked': return 'badge-booked';
      case 'completed': return 'badge-completed';
      case 'cancelled': return 'badge-cancelled';
      case 'no-show': return 'badge-no-show';
      default: return 'badge-booked';
    }
  };

  return (
    <div className="container section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="scroll-animate">My Appointments</h1>
        <Link href="/book" className="btn btn-primary scroll-animate stagger-1">
          Book New
        </Link>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="spinner spinner-lg"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Calendar size={48} style={{ margin: '0 auto 1rem', color: 'var(--color-neutral-300)' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No Appointments Found</h3>
          <p style={{ color: 'var(--color-neutral-500)', margin: '1.5rem' }}>
            You haven&apos;t booked any appointments yet.
          </p>
          <Link href="/book" className="btn btn-primary">
            Book Your First Appointment
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {appointments.map((apt) => (
            <div key={apt._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem' }}>Dr. {apt.doctorId?.name || 'Pandey'}</h3>
                  <span className={`badge ${getBadgeClass(apt.status)}`}>{apt.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--color-neutral-600)', fontSize: '0.875rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Calendar size={16} /> 
                    {new Date(apt.date).toLocaleDateString()}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Clock size={16} /> 
                    {apt.startTime}
                  </span>
                </div>
                <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--color-neutral-700)' }}>
                  <strong>Reason:</strong> {apt.problemDescription}
                </p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 {apt.status === 'completed' && (
                    <Link href={`/api/prescriptions/${apt._id}/pdf`} target="_blank" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                       <FileText size={16} /> Download Prescription
                    </Link>
                 )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
