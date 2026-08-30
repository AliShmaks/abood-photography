import { useEffect, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return;
      const { data: isAdmin } = await supabase.rpc("is_current_user_admin");
      if (isAdmin) navigate("/admin/dashboard", { replace: true });
    });
  }, [navigate]);

  async function login(event) {
    event.preventDefault();
    setMessage("");

    if (!isSupabaseConfigured) {
      setMessage(
        "Supabase is not connected yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env."
      );
      return;
    }

    setBusy(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setBusy(false);
      return;
    }

    const { data: isAdmin, error: adminError } = await supabase.rpc(
      "is_current_user_admin"
    );

    if (adminError || !isAdmin) {
      await supabase.auth.signOut();
      setMessage("This account is not allowed to access the admin dashboard.");
      setBusy(false);
      return;
    }

    navigate("/admin/dashboard", { replace: true });
  }

  return (
    <PageTransition className="page-shell admin-page">
      <section className="admin-login-wrap container">
        <div className="admin-login-card">
          <div className="admin-icon">
            <LockKeyhole size={24} />
          </div>
          <span className="eyebrow">Private dashboard</span>
          <h1 className="title-lg">Abood Admin</h1>
          <p className="lead">
            Sign in to create portfolio categories and upload photography.
          </p>

          <form className="admin-login-form" onSubmit={login}>
            <label>
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="abood@example.com"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </label>

            {message && <div className="admin-message error">{message}</div>}

            <button className="btn" disabled={busy} type="submit">
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </section>
    </PageTransition>
  );
}
