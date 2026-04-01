'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarCheck, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

type Slot = {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
};

export default function BookAppointmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [walkIns, setWalkIns] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [problemDesc, setProblemDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState('');
  const [doctorId, setDoctorId] = useState<string>(''); // Needs to be fetched
  
  // Dummy doctor fetch - in a real app, you might select a doctor first
  useEffect(() => {
    // Fetch the admin user (doctor)
    fetch('/api/admin-user')
      .then(res => res.json())
      .then(data => {
         if (data.doctorId) setDoctorId(data.doctorId);
      })
      .catch(err => console.error("Failed to fetch doctor", err));
  }, []);

  useEffect(() => {
    if (!doctorId) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setError('');
      try {
        // Format date as YYYY-MM-DD local time
        const yyyy = selectedDate.getFullYear();
        const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const dd = String(selectedDate.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;

        const res = await fetch(`/api/slots?date=${dateStr}&doctorId=${doctorId}`);
        if (!res.ok) throw new Error('Failed to fetch slots');
        const data = await res.json();
        setSlots(data.slots || []);
        setWalkIns(data.walkInBlocks || []);
      } catch (err) {
        setError('Could not load slots. Please try again.');
        setSlots([]);
        setWalkIns([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
    setSelectedSlot(null);
  }, [selectedDate, doctorId]);

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const handlePrevDay = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    
    if (prev >= today) {
      setSelectedDate(prev);
    }
  };

  const isPrevDisabled = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateCopy = new Date(selectedDate);
    dateCopy.setHours(0, 0, 0, 0);
    return dateCopy <= today;
  };

  const handleBooking = async () => {
    if (!selectedSlot || !problemDesc.trim() || problemDesc.length < 10) {
       setError('Please select a slot and provide a problem description (min 10 chars).');
       return;
    }

    setLoading(true);
    setError('');

    try {
      // Format date as YYYY-MM-DD
      const yyyy = selectedDate.getFullYear();
      const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const dd = String(selectedDate.getDate()).padStart(2, '0');
      
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId,
          date: `${yyyy}-${mm}-${dd}`,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          problemDescription: problemDesc
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to book appointment');
      }

      setStep(3); // Success
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
     return (
        <div className="booking-page">
           <div className="glass-card confirmation-card" style={{ animation: 'fadeIn 0.5s ease' }}>
              <div className="confirmation-icon">
                 <CheckCircle2 size={40} />
              </div>
              <h2 style={{ marginBottom: '1rem', color: 'var(--color-neutral-900)' }}>Appointment Confirmed!</h2>
              <p style={{ color: 'var(--color-neutral-600)', marginBottom: '2rem' }}>
                 Your appointment has been successfully booked. You will receive a confirmation email shortly.
              </p>
              <div style={{ background: 'var(--color-cream-50)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'left', marginBottom: '2rem' }}>
                 <p style={{ margin: '0.5rem 0' }}><strong>Date:</strong> {selectedDate.toLocaleDateString()}</p>
                 <p style={{ margin: '0.5rem 0' }}><strong>Time:</strong> {selectedSlot?.startTime}</p>
                 <p style={{ margin: '0.5rem 0' }}><strong>Doctor:</strong> Dr. Shivansh A. Pandey</p>
                 <p style={{ margin: '0.5rem 0' }}><strong>Location:</strong> AIIMS Gorakhpur</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                 <button onClick={() => router.push('/my-appointments')} className="btn btn-primary">
                    View My Appointments
                 </button>
                 <button onClick={() => router.push('/')} className="btn btn-secondary">
                    Return to Home
                 </button>
              </div>
           </div>
        </div>
     );
  }

  return (
    <div className="booking-page">
      <h1 className="text-center scroll-animate" style={{ marginBottom: '2rem' }}>Book Your Appointment</h1>
      
      <div className="booking-steps scroll-animate stagger-1">
        <div className={`booking-step ${step === 1 ? 'active' : 'completed'}`}>
           <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: step > 1 ? 'white' : 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: step > 1 ? 'var(--color-success)' : 'inherit' }}>
              {step > 1 ? '✓' : '1'}
           </span>
           Select Slot
        </div>
        <div style={{ width: '40px', height: '2px', background: 'var(--color-neutral-200)', alignSelf: 'center' }}></div>
        <div className={`booking-step ${step === 2 ? 'active' : ''}`}>
           <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: step === 2 ? 'rgba(255,255,255,0.3)' : 'transparent', border: step === 2 ? 'none' : '1px solid currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
              2
           </span>
           Details
        </div>
      </div>

      <div className="glass-card scroll-animate stagger-2" style={{ padding: '2rem' }}>
         {error && (
            <div className="toast toast-error" style={{ position: 'relative', top: 0, right: 0, marginBottom: '1.5rem', width: '100%' }}>
               {error}
            </div>
         )}

         {step === 1 && (
            <div>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                  <button onClick={handlePrevDay} disabled={isPrevDisabled()} className="btn btn-secondary btn-icon" style={{ borderRadius: '50%' }}>
                     <ChevronLeft size={20} />
                  </button>
                  <div style={{ textAlign: 'center' }}>
                     <h3 style={{ fontSize: '1.25rem' }}>
                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                     </h3>
                     {!doctorId && <p style={{ color: 'var(--color-neutral-500)', fontSize: '0.875rem' }}>Connecting to clinic...</p>}
                  </div>
                  <button onClick={handleNextDay} className="btn btn-secondary btn-icon" style={{ borderRadius: '50%' }}>
                     <ChevronRight size={20} />
                  </button>
               </div>

               {loadingSlots ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
                     <div className="spinner spinner-lg"></div>
                  </div>
               ) : slots.length === 0 ? (
                  <div className="empty-state">
                     <p>No slots available on this date. Please select another date.</p>
                  </div>
               ) : (
                  <>
                     {walkIns.length > 0 && (
                        <div style={{ background: 'var(--color-primary-50)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', borderLeft: '4px solid var(--color-primary-500)' }}>
                           <h4 style={{ fontSize: '1rem', color: 'var(--color-primary-700)', marginBottom: '0.5rem' }}>Walk-in Hours Today</h4>
                           <p style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>
                             We welcome direct walk-in patients during the following times without an appointment:
                           </p>
                           <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                              {walkIns.map((w, idx) => (
                                <li key={idx} className="badge" style={{ background: 'white', border: '1px solid var(--color-primary-200)', color: 'var(--color-primary-600)' }}>
                                  {w.startTime} - {w.endTime}
                                </li>
                              ))}
                           </ul>
                        </div>
                     )}
                     <div className="slot-grid">
                        {slots.map((slot, i) => {
                           const isToday = selectedDate.toDateString() === new Date().toDateString();
                           let isPastInLocal = false;
                           if (isToday) {
                              const [h, m] = slot.startTime.split(':').map(Number);
                              const slotTime = new Date();
                              slotTime.setHours(h, m, 0, 0);
                              if (new Date() >= slotTime) {
                                 isPastInLocal = true;
                              }
                           }
                           
                           return (
                           <button
                              key={i}
                              disabled={!slot.isAvailable || isPastInLocal}
                              className={`slot-btn ${selectedSlot?.startTime === slot.startTime ? 'selected' : ''}`}
                              onClick={() => setSelectedSlot(slot)}
                           >
                              {slot.startTime}
                           </button>
                           );
                        })}
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                        <button 
                           className="btn btn-primary" 
                           onClick={() => setStep(2)}
                           disabled={!selectedSlot}   
                        >
                           Next Step
                        </button>
                     </div>
                  </>
               )}
            </div>
         )}

         {step === 2 && (
            <div>
               <div style={{ background: 'var(--color-neutral-50)', padding: '1rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <CalendarCheck size={24} style={{ color: 'var(--color-primary-500)' }} />
                  <div>
                     <p style={{ fontWeight: 600 }}>{selectedDate.toLocaleDateString()}</p>
                     <p style={{ color: 'var(--color-neutral-600)', fontSize: '0.875rem' }}>{selectedSlot?.startTime} - {selectedSlot?.endTime}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}>Change</button>
               </div>

               <div className="form-group">
                  <label className="form-label">Brief Description of Problem</label>
                  <textarea 
                     className="form-input form-textarea" 
                     placeholder="Please briefly describe why you need to consult the doctor..."
                     value={problemDesc}
                     onChange={(e) => setProblemDesc(e.target.value)}
                     required
                  ></textarea>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500)' }}>At least 10 characters required.</span>
               </div>

               <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                  <button className="btn btn-secondary" onClick={() => setStep(1)} disabled={loading}>
                     Back
                  </button>
                  <button className="btn btn-primary" onClick={handleBooking} disabled={loading || problemDesc.length < 10}>
                     {loading ? <div className="spinner" style={{ width: '20px', height: '20px' }}></div> : 'Confirm Booking'}
                  </button>
               </div>
            </div>
         )}
      </div>
    </div>
  );
}
