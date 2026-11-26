import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out failed:', error.message);
      setSigningOut(false);
      return;
    }
    navigate('/login', { replace: true });
  }

  return (
    <main className="dashboard-page">
      <header className="topbar"><a className="wordmark" href="/dashboard">Mee</a><button className="signout-button" onClick={signOut} disabled={signingOut}>{signingOut ? 'Signing out…' : 'Sign out'}</button></header>
      <section className="welcome-panel">
        <p className="eyebrow">YOUR WORKSPACE</p>
        <h1>You’re signed in.</h1>
        <p className="muted">This page is protected. Only authenticated users can access it.</p>
        <div className="user-panel"><div className="avatar">{(user?.email?.[0] || 'U').toUpperCase()}</div><div><strong>{user?.user_metadata?.full_name || user?.user_metadata?.name || 'Google user'}</strong><p className="muted">{user?.email}</p></div></div>
      </section>
    </main>
  );
}
