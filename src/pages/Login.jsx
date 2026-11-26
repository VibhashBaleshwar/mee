import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { user } = useAuth();
  const location = useLocation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const destination = location.state?.from?.pathname || '/dashboard';

  if (user) return <Navigate to={destination} replace />;

  async function signInWithGoogle() {
    setBusy(true);
    setError('');
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (authError) {
      setError(authError.message);
      setBusy(false);
    }
  }

  return (
    <main className="center-page">
      <section className="auth-card">
        <div className="brand-mark">M</div>
        <p className="eyebrow">WELCOME</p>
        <h1>Sign in to Mee</h1>
        <p className="muted">Continue securely with your Google account.</p>
        <button className="google-button" onClick={signInWithGoogle} disabled={busy}>
          <span className="google-g" aria-hidden="true">G</span>
          {busy ? 'Redirecting…' : 'Continue with Google'}
        </button>
        {error && <p className="error" role="alert">{error}</p>}
        <p className="fine-print">By continuing, you agree to the app’s terms and privacy policy.</p>
      </section>
    </main>
  );
}
