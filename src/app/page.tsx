import Link from 'next/link';
import { Heart, Users, Clock, Shield, Star, CalendarCheck, Stethoscope } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <>
      {/* HERO */}
      <section className="hero" id="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="scroll-animate">
              Your Health, <br />
              <span className="gradient-text">Our Priority</span>
            </h1>
            <p className="hero-subtitle scroll-animate stagger-1">
              Experience compassionate healthcare with Dr. Shivansh A. Pandey, MBBS.
              Book your appointment online in seconds and receive quality medical care.
            </p>
            <div className="hero-actions scroll-animate stagger-2">
              <Link href="/book" className="btn btn-primary btn-lg" id="hero-book-btn">
                <CalendarCheck size={20} />
                Book Appointment
              </Link>
              <Link href="/about" className="btn btn-secondary btn-lg">
                Learn More
              </Link>
            </div>
            <div className="hero-stats scroll-animate stagger-3">
              <div>
                <div className="hero-stat-value">5000+</div>
                <div className="hero-stat-label">Patients Treated</div>
              </div>
              <div>
                <div className="hero-stat-value">4.9★</div>
                <div className="hero-stat-label">Patient Rating</div>
              </div>
              <div>
                <div className="hero-stat-value">10+</div>
                <div className="hero-stat-label">Years Experience</div>
              </div>
            </div>
          </div>
          <div className="hero-image scroll-animate-scale stagger-2">
            <div className="hero-image-wrapper">
              <div style={{
                width: '100%', height: '100%',
                background: 'linear-gradient(135deg, var(--color-primary-100), var(--color-cream-200))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem'
              }}>
                <Stethoscope size={80} style={{ color: 'var(--color-primary-500)' }} />
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-primary-700)' }}>
                  Dr. Shivansh A. Pandey
                </span>
                <span style={{ color: 'var(--color-neutral-500)' }}>MBBS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST SIGNALS */}
      <section className="trust-section" id="trust-section">
        <div className="text-center">
          <h2 className="scroll-animate">Why Choose <span className="gradient-text">Pandey Care</span>?</h2>
          <p className="scroll-animate stagger-1" style={{ color: 'var(--color-neutral-500)', maxWidth: '600px', margin: '1rem auto 0' }}>
            We combine medical expertise with genuine compassion to deliver healthcare you can trust.
          </p>
        </div>
        <div className="trust-grid">
          <div className="trust-card scroll-animate stagger-1">
            <div className="trust-icon"><Users size={28} /></div>
            <div className="trust-value">5000+</div>
            <div className="trust-label">Happy Patients</div>
          </div>
          <div className="trust-card scroll-animate stagger-2">
            <div className="trust-icon"><Clock size={28} /></div>
            <div className="trust-value">4 Min</div>
            <div className="trust-label">Quick Consultations</div>
          </div>
          <div className="trust-card scroll-animate stagger-3">
            <div className="trust-icon"><Shield size={28} /></div>
            <div className="trust-value">100%</div>
            <div className="trust-label">Secure & Private</div>
          </div>
          <div className="trust-card scroll-animate stagger-4">
            <div className="trust-icon"><Star size={28} /></div>
            <div className="trust-value">4.9/5</div>
            <div className="trust-label">Patient Satisfaction</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how-it-works" style={{ background: 'var(--color-cream-50)' }}>
        <div className="container text-center">
          <h2 className="scroll-animate">How It <span className="gradient-text">Works</span></h2>
          <p className="scroll-animate stagger-1" style={{ color: 'var(--color-neutral-500)', maxWidth: '500px', margin: '1rem auto 0' }}>
            Book your appointment in three simple steps
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '3rem' }}>
            <div className="glass-card scroll-animate stagger-1" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.25rem' }}>1</div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Create Account</h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-neutral-500)' }}>Sign up with your details in less than a minute</p>
            </div>
            <div className="glass-card scroll-animate stagger-2" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.25rem' }}>2</div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Pick a Slot</h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-neutral-500)' }}>Choose a convenient date and time slot</p>
            </div>
            <div className="glass-card scroll-animate stagger-3" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.25rem' }}>3</div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Visit Doctor</h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-neutral-500)' }}>Show up at the clinic at your scheduled time</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))', color: 'white', textAlign: 'center' }}>
        <div className="container scroll-animate">
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>Ready to Book Your Appointment?</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '500px', margin: '0 auto 2rem', fontSize: '1.0625rem' }}>
            Join 5000+ patients who trust Pandey Care for their healthcare needs.
          </p>
          {session ? (
            <Link href="/book" className="btn btn-lg" style={{ background: 'white', color: 'var(--color-primary-600)', fontWeight: 600 }}>
              Book Your Next Visit
            </Link>
          ) : (
            <Link href="/signup" className="btn btn-lg" style={{ background: 'white', color: 'var(--color-primary-600)', fontWeight: 600 }}>
              Get Started — It&apos;s Free
            </Link>
          )}
        </div>
      </section>
    </>
  );
}
