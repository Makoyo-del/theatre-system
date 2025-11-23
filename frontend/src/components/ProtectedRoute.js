import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const currentSession = supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Listen for changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!session) return <Navigate to="/" replace />;

  return children;
}
