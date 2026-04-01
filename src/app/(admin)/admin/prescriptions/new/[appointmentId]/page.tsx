'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Send, FileText } from 'lucide-react';

export default function NewPrescriptionPage({ params }: { params: { appointmentId: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [medications, setMedications] = useState([{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  const [successLink, setSuccessLink] = useState('');

  const addMed = () => setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  const removeMed = (i: number) => {
      const copy = [...medications];
      copy.splice(i, 1);
      setMedications(copy);
  };
  const updateMed = (i: number, key: string, val: string) => {
      const copy = [...medications];
      copy[i] = { ...copy[i], [key]: val };
      setMedications(copy);
  };

  const handleSave = async () => {
      setLoading(true);
      setError('');
      try {
          const res = await fetch('/api/admin/prescriptions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  appointmentId: params.appointmentId,
                  diagnosis,
                  additionalNotes: notes,
                  medications
              })
          });
          const data = await res.json();
          if(!res.ok) throw new Error(data.error);

          setSuccessLink(data.whatsappLink);
      } catch (err: any) {
          setError(err.message);
      } finally {
          setLoading(false);
      }
  };

  if (successLink) {
      return (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', margin: '0 auto 1.5rem', background: 'var(--color-success-light)', color: 'var(--color-success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Send size={32} /></div>
              <h2>Prescription Generated</h2>
              <p style={{ margin: '1rem 0 2rem' }}>The appointment lies completed and PDF lies ready.</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                 <a href={`/api/prescriptions/${params.appointmentId}/pdf`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={16} /> 1. Download PDF
                 </a>
                 <a href={successLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    2. Share to WhatsApp
                 </a>
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                 <button className="btn btn-ghost btn-sm" onClick={() => router.push('/admin/appointments')}>Back to Appointments</button>
              </div>
          </div>
      );
  }

  return (
    <>
      <div className="admin-page-header">
        <h1>Create Prescription</h1>
        <p>Consultation details for appointment.</p>
      </div>

      <div className="card scroll-animate stagger-1" style={{ padding: '2rem' }}>
          {error && <div className="toast toast-error">{error}</div>}

          <div className="prescription-form">
              <div className="form-group">
                  <label className="form-label">Diagnosis</label>
                  <input type="text" className="form-input" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} placeholder="e.g. Viral Fever" required />
              </div>

              <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <label className="form-label">Medications</label>
                      <button className="btn btn-ghost btn-sm" onClick={addMed}><Plus size={16} /> Add Medicine</button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {medications.map((med, i) => (
                          <div key={i} className="medication-row">
                              <div className="form-group">
                                  <label style={{ fontSize: '0.75rem' }}>Name</label>
                                  <input type="text" className="form-input" value={med.name} onChange={e=>updateMed(i, 'name', e.target.value)} placeholder="Paracetamol" />
                              </div>
                              <div className="form-group">
                                  <label style={{ fontSize: '0.75rem' }}>Dosage</label>
                                  <input type="text" className="form-input" value={med.dosage} onChange={e=>updateMed(i, 'dosage', e.target.value)} placeholder="500mg" />
                              </div>
                              <div className="form-group">
                                  <label style={{ fontSize: '0.75rem' }}>Frequency</label>
                                  <select className="form-input" value={med.frequency} onChange={e=>updateMed(i, 'frequency', e.target.value)}>
                                      <option value="">Select...</option>
                                      <option value="1-0-1 (Morning & Night)">1-0-1 (Morning & Night)</option>
                                      <option value="1-1-1 (Thrice a day)">1-1-1 (Thrice a day)</option>
                                      <option value="0-0-1 (Night Only)">0-0-1 (Night Only)</option>
                                      <option value="1-0-0 (Morning Only)">1-0-0 (Morning Only)</option>
                                      <option value="Alternate Days">Alternate Days</option>
                                      <option value="Once Weekly">Once Weekly</option>
                                      <option value="SOS (When required)">SOS (When required)</option>
                                      <option value="As Directed">As Directed</option>
                                  </select>
                              </div>
                              <div className="form-group">
                                  <label style={{ fontSize: '0.75rem' }}>Days</label>
                                  <input type="text" className="form-input" value={med.duration} onChange={e=>updateMed(i, 'duration', e.target.value)} placeholder="5 days" />
                              </div>
                              <div className="form-group">
                                  <label style={{ fontSize: '0.75rem' }}>Instructions (Opt)</label>
                                  <input type="text" className="form-input" value={med.instructions} onChange={e=>updateMed(i, 'instructions', e.target.value)} placeholder="After meals" />
                              </div>
                              {medications.length > 1 && (
                                  <button onClick={() => removeMed(i)} className="btn btn-ghost btn-icon" style={{ color: 'var(--color-error)' }}><Trash2 size={20} /></button>
                              )}
                          </div>
                      ))}
                  </div>
              </div>

              <div className="form-group">
                  <label className="form-label">Additional Doctor Notes</label>
                  <textarea className="form-input form-textarea" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Dietary restrictions, rest advice..."></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button className="btn btn-secondary" onClick={() => router.push('/admin/appointments')}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleSave} disabled={loading || !diagnosis}>
                      {loading ? 'Saving...' : 'Generate Prescription & Complete'}
                  </button>
              </div>
          </div>
      </div>
    </>
  );
}
