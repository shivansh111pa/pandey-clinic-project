'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulated API call - In a real app this would ping an endpoint to send the reset email
    setTimeout(() => {
        if (!email.includes('@')) {
            setError('Please enter a valid email.');
        } else {
            setSuccess(true);
        }
        setLoading(false);
    }, 1500);
  };

  return (
    <div className="auth-page">
      <div className="auth-card scroll-animate">
        {success ? (
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', margin: '0 auto 1.5rem', background: 'var(--color-primary-50)', color: 'var(--color-primary-500)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mail size={32} />
                </div>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Check your email</h1>
                <p style={{ color: 'var(--color-neutral-600)', marginBottom: '2rem' }}>
                    We&apos;ve sent password reset instructions to <strong>{email}</strong>
                </p>
                <Link href="/login" className="btn btn-primary" style={{ width: '100%' }}>
                    Return to login
                </Link>
            </div>
        ) : (
            <>
                <div className="auth-header">
                    <h1>Forgot Password</h1>
                    <p>Enter your email to receive a reset link</p>
                </div>

                {error && <div className="toast toast-error" style={{ position: 'relative', top: 0, right: 0, marginBottom: '1.5rem', width: '100%' }}>{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="your@email.com"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                        {loading ? <div className="spinner" style={{ width: '20px', height: '20px' }}></div> : 'Send Reset Link'}
                    </button>
                </form>

                <div className="auth-footer" style={{ marginTop: '2rem' }}>
                    <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-neutral-600)' }}>
                        <ArrowLeft size={16} /> Back to Sign in
                    </Link>
                </div>
            </>
        )}
      </div>
    </div>
  );
}
