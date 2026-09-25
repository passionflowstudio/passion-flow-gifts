'use client';

import { useState, type FormEvent } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

const messages: Record<Status, string> = {
  idle: 'Join for new designs, gifting ideas, and subscriber-only discounts.',
  loading: 'Join for new designs, gifting ideas, and subscriber-only discounts.',
  success: 'Thank you! Stay tuned, you will now receive discounts on your email :)',
  error: 'Something went wrong. Please try again in a moment.',
};

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error('Subscription failed');
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <form className="signup-form" onSubmit={submit}>
      <div className="signup-fields">
        <label htmlFor="signup-email">Your email address</label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={event => { setEmail(event.target.value); if (status !== 'idle') setStatus('idle'); }}
          placeholder="Your email address"
          autoComplete="email"
          required
          disabled={status === 'loading'}
        />
        <button type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Joining…' : 'Join the list'}</button>
      </div>
      <p className={`signup-message ${status}`} role="status" aria-live="polite">{messages[status]}</p>
    </form>
  );
}
