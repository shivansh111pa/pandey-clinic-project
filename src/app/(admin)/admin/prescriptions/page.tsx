'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd fetch all actual prescriptions.
    // We are reusing the appointments endpoint here just to list completed ones for brevity
    fetch('/api/admin/appointments')
      .then(res => res.json())
      .then(data => {
         if (data.appointments) {
             const completed = data.appointments.filter((a: any) => a.status === 'completed');
             setPrescriptions(completed);
         }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="admin-page-header">
        <h1>Prescriptions Vault</h1>
        <p>Archive of all generated prescriptions.</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="spinner spinner-lg"></div>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Patient</th>
              <th>Reason</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((apt) => (
              <tr key={apt._id}>
                <td>{new Date(apt.date).toLocaleDateString()}</td>
                <td>{apt.patientId?.name || 'Unknown'}</td>
                <td>
                   <div style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {apt.problemDescription}
                   </div>
                </td>
                <td>
                    <Link href={`/api/prescriptions/${apt._id}/pdf`} target="_blank" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={16} /> View PDF
                    </Link>
                </td>
              </tr>
            ))}
            {prescriptions.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>No prescriptions generated yet.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </>
  );
}
