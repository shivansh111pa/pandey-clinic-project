'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: true,
        email: formData.email,
        password: formData.password,
        callbackUrl: formData.email.toLowerCase().includes('admin') ? '/admin' : '/my-appointments'
      });
      // The NextAuth built-in redirect intercepts execution here and navigates the browser cleanly.
    } catch (err: any) {
      console.error(err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card scroll-animate">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your Pandey Care account</p>
        </div>

        {error && (
          <div className="toast toast-error" style={{ position: 'relative', top: 0, right: 0, marginBottom: '1.5rem', width: '100%' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <Link href="/forgot-password" style={{ fontSize: '0.8125rem', color: 'var(--color-primary-600)' }}>
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              className="form-input"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
            {loading ? <div className="spinner" style={{ width: '20px', height: '20px' }}></div> : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don&apos;t have an account? <Link href="/signup">Sign up here</Link>
        </div>
      </div>
    </div>
  );
}
