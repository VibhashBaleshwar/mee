import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';

export default function AuthCallback() {
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!alive) return;
      setFailed(Boolean(error) || !data.session);
      setReady(true);
    });
    return () => { alive = false; };
  }, []);

  if (!ready) return <main className="center-page"><p className="muted">Completing sign in…</p></main>;
  return failed ? <Navigate to="/login" replace /> : <Navigate to="/dashboard" replace />;
}
