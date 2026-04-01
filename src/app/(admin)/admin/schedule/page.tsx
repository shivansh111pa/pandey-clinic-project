'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ScheduleManagerPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingDesc, setSavingDesc] = useState('');

  useEffect(() => {
    fetch('/api/admin/schedule')
      .then(res => res.json())
      .then(data => {
         if (data.schedules) setSchedules(data.schedules);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (dayOfWeek: number, data: any) => {
     setSavingDesc('Saving...');
     try {
         const res = await fetch('/api/admin/schedule', {
             method: 'PUT',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
                 dayOfWeek,
                 isActive: data.isActive,
                 appointmentDuration: parseInt(data.appointmentDuration) || 4,
                 slots: data.slots.map((s: any) => ({
                     startTime: s.startTime,
                     endTime: s.endTime,
                     type: s.type || 'booking'
                 }))
             })
         });
         if (res.ok) {
            setSavingDesc('Saved successfully!');
            setTimeout(() => setSavingDesc(''), 3000);
         } else {
             setSavingDesc('Failed to save.');
         }
     } catch (err) {
         setSavingDesc('Error saving.');
     }
  };

  const updateScheduleState = (dayIndex: number, key: string, value: any) => {
     const updated = [...schedules];
     updated[dayIndex] = { ...updated[dayIndex], [key]: value };
     setSchedules(updated);
  };

  const addSlot = (dayIndex: number) => {
     const updated = [...schedules];
     updated[dayIndex].slots.push({ startTime: '09:00', endTime: '13:00', type: 'booking' });
     setSchedules(updated);
  };

  const removeSlot = (dayIndex: number, slotIndex: number) => {
     const updated = [...schedules];
     updated[dayIndex].slots.splice(slotIndex, 1);
     setSchedules(updated);
  };

  const updateSlot = (dayIndex: number, slotIndex: number, key: string, value: string) => {
     const updated = [...schedules];
     updated[dayIndex].slots[slotIndex][key] = value;
     setSchedules(updated);
  };

  return (
    <>
      <div className="admin-page-header">
        <h1>Schedule Manager</h1>
        <p>Configure your weekly availability and default times.</p>
        {savingDesc && <p style={{ color: "var(--color-primary-600)", fontWeight: "bold" }}>{savingDesc}</p>}
      </div>

      {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}><div className="spinner spinner-lg"></div></div>
      ) : (
          <div>
              {schedules.map((schedule, i) => (
                  <div key={i} className="schedule-day">
                      <div className="schedule-day-header">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <label className="toggle-switch" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                 <input type="checkbox" checked={schedule.isActive} onChange={(e) => updateScheduleState(i, 'isActive', e.target.checked)} style={{ transform: 'scale(1.5)' }} />
                                 <span className="schedule-day-name">{DAYS[schedule.dayOfWeek]}</span>
                              </label>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <span style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>Duration:</span>
                              <input type="number" min="1" max="60" value={schedule.appointmentDuration} onChange={(e) => updateScheduleState(i, 'appointmentDuration', parseInt(e.target.value))} className="form-input" style={{ width: '80px', padding: '0.25rem 0.5rem' }} />
                              <span style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>min</span>
                              <button className="btn btn-secondary btn-sm" onClick={() => handleUpdate(schedule.dayOfWeek, schedule)}>
                                  <Save size={16} /> Save Day
                              </button>
                          </div>
                      </div>

                      {schedule.isActive && (
                          <div className="schedule-slots">
                              {schedule.slots.map((slot: any, slotIdx: number) => (
                                 <div key={slotIdx} className="schedule-slot-input" style={{ background: 'var(--color-cream-50)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
                                     <input type="time" value={slot.startTime} onChange={(e) => updateSlot(i, slotIdx, 'startTime', e.target.value)} className="form-input" style={{ padding: '0.25rem' }} />
                                     <span>to</span>
                                     <input type="time" value={slot.endTime} onChange={(e) => updateSlot(i, slotIdx, 'endTime', e.target.value)} className="form-input" style={{ padding: '0.25rem' }} />
                                     <select value={slot.type || 'booking'} onChange={(e) => updateSlot(i, slotIdx, 'type', e.target.value)} className="form-input" style={{ padding: '0.25rem', width: 'auto' }}>
                                        <option value="booking">Booking</option>
                                        <option value="walk-in">Walk-in</option>
                                     </select>
                                     <button onClick={() => removeSlot(i, slotIdx)} style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer' }}>
                                         <Trash2 size={16} />
                                     </button>
                                 </div>
                              ))}
                              <button onClick={() => addSlot(i)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary-600)' }}>
                                  <Plus size={16} /> Add Block
                              </button>
                          </div>
                      )}
                  </div>
              ))}
          </div>
      )}
    </>
  );
}
