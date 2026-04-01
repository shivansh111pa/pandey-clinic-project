'use client';

import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <div className="page-hero">
        <h1 className="scroll-animate">Contact Us</h1>
        <p className="scroll-animate stagger-1">
          Have a question or need assistance? We&apos;re here to help. Reach out to us
          using the information below.
        </p>
      </div>

      <div className="contact-grid">
        <div className="scroll-animate">
          <h2 style={{ marginBottom: '2rem' }}>Get In Touch</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--color-primary-50)', borderRadius: 'var(--radius-lg)', color: 'var(--color-primary-600)', alignSelf: 'flex-start' }}>
                <MapPin size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>Location</h3>
                <p style={{ color: 'var(--color-neutral-600)' }}>AIIMS Gorakhpur<br />Uttar Pradesh</p>
                <a href="https://maps.app.goo.gl/umzB6pd51wAKM3st6" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '0.5rem', fontWeight: 500 }}>
                  Get Directions →
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--color-primary-50)', borderRadius: 'var(--radius-lg)', color: 'var(--color-primary-600)', alignSelf: 'flex-start' }}>
                <Clock size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>Hours</h3>
                <p style={{ color: 'var(--color-neutral-600)' }}>
                  Morning: 09:00 AM – 01:00 PM<br />
                  Evening: 05:00 PM – 10:00 PM
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--color-primary-50)', borderRadius: 'var(--radius-lg)', color: 'var(--color-primary-600)', alignSelf: 'flex-start' }}>
                <Mail size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>Email</h3>
                <p style={{ color: 'var(--color-neutral-600)' }}>contact@pandeycare.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card scroll-animate stagger-1" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Send a Message</h2>
          <form className="auth-form">
             <div className="form-group">
                <label className="form-label">Name</label>
                <input type="text" className="form-input" placeholder="Your Name" required />
            </div>
            <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="your@email.com" required />
            </div>
            <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-input form-textarea" placeholder="How can we help you?" required></textarea>
            </div>
            <button type="button" className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => alert('Thanks for your message! This is a demo form.')}>
              Send Message
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
