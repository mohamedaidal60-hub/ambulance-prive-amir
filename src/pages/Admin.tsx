import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";
import { toast } from "sonner";
import { Loader2, LogOut, KeyRound, RefreshCw } from "lucide-react";
import logo from "@/assets/logo.png";

interface Booking {
  id: string;
  full_name: string;
  phone: string;
  service: string;
  wilaya: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  scheduled_at: string;
  notes: string | null;
  status: string;
  created_at: string;
}

const STATUSES = ["pending", "confirmed", "done", "cancelled"];

const Admin = () => {
  const { tr, lang, setLang } = useLang();
  const nav = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // bookings
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // change password
  const [newPwd, setNewPwd] = useState("");

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) checkAdmin(s.user.id);
      else { setIsAdmin(false); setChecking(false); }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) checkAdmin(data.session.user.id);
      else setChecking(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const checkAdmin = async (uid: string) => {
    setChecking(true);
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin").maybeSingle();
    setIsAdmin(!!data);
    setChecking(false);
    if (data) loadBookings();
  };

  const loadBookings = async () => {
    setLoadingBookings(true);
    const { data, error } = await supabase.from("bookings").select("*").order("scheduled_at", { ascending: false });
    setLoadingBookings(false);
    if (error) toast.error(error.message);
    else setBookings(data as Booking[]);
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    let { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error && error.message.toLowerCase().includes("invalid")) {
      // Bootstrap admin: try to create the account on first login
      if (email === "amir@ambulance-prive.com") {
        const { error: signUpErr } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (!signUpErr) {
          const r = await supabase.auth.signInWithPassword({ email, password });
          error = r.error;
        } else {
          error = signUpErr;
        }
      }
    }
    setSubmitting(false);
    if (error) toast.error(error.message);
  };

  const signOut = async () => { await supabase.auth.signOut(); nav("/"); };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else { setBookings((b) => b.map((x) => x.id === id ? { ...x, status } : x)); toast.success("✓"); }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd.length < 6) return toast.error("Min 6 caractères");
    const { error } = await supabase.auth.updateUser({ password: newPwd });
    if (error) toast.error(error.message);
    else { toast.success("Mot de passe mis à jour"); setNewPwd(""); }
  };

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!session || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-soft p-4">
        <div className="bg-card rounded-3xl shadow-elegant p-8 w-full max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <img src={logo} alt="Logo" className="h-10 w-10" />
            <h1 className="text-2xl font-black text-secondary">{tr("admin_login")}</h1>
          </div>
          <form onSubmit={signIn} className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold">{tr("admin_email")}</span>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input mt-1" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">{tr("admin_password")}</span>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input mt-1" />
            </label>
            <button disabled={submitting} className="w-full bg-gradient-primary text-primary-foreground font-bold py-3 rounded-full shadow-glow inline-flex items-center justify-center gap-2">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {tr("admin_signin")}
            </button>
          </form>
          {session && !isAdmin && (
            <p className="text-sm text-destructive mt-4 text-center">⛔ Accès refusé — compte non administrateur.</p>
          )}
          <Link to="/" className="block text-center text-sm text-muted-foreground mt-6 hover:text-primary">{tr("back_home")}</Link>
          <button onClick={() => setLang(lang === "fr" ? "ar" : "fr")} className="block mx-auto mt-3 text-xs underline text-muted-foreground">
            {lang === "fr" ? "العربية" : "Français"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-card border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-9 w-9" />
            <h1 className="font-extrabold text-secondary">{tr("admin_dashboard")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadBookings} className="p-2 rounded-full hover:bg-muted" title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={() => setLang(lang === "fr" ? "ar" : "fr")} className="text-xs font-bold px-3 py-1.5 rounded-full border">
              {lang === "fr" ? "العربية" : "FR"}
            </button>
            <button onClick={signOut} className="inline-flex items-center gap-2 bg-secondary text-white font-bold px-4 py-2 rounded-full text-sm">
              <LogOut className="w-4 h-4" /> {tr("admin_logout")}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <section className="bg-card rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <KeyRound className="w-4 h-4 text-primary" />
            <h2 className="font-bold">{tr("admin_change_pwd")}</h2>
          </div>
          <form onSubmit={changePassword} className="flex flex-col sm:flex-row gap-3">
            <input type="password" placeholder={tr("admin_new_pwd")} value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className="input flex-1" />
            <button className="bg-gradient-primary text-primary-foreground font-bold px-6 py-2 rounded-full">OK</button>
          </form>
        </section>

        <section>
          <h2 className="font-bold text-xl mb-4">Réservations ({bookings.length})</h2>
          {loadingBookings ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : bookings.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">{tr("admin_no_bookings")}</p>
          ) : (
            <div className="grid gap-4">
              {bookings.map((b) => (
                <article key={b.id} className="bg-card rounded-2xl p-5 shadow-card grid md:grid-cols-[1fr_auto] gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{b.full_name}</h3>
                      <StatusBadge status={b.status} />
                    </div>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <div>📞 <a href={`tel:${b.phone}`} className="text-primary font-semibold">{b.phone}</a> • 🚑 {b.service}</div>
                      <div>📅 {new Date(b.scheduled_at).toLocaleString(lang === "ar" ? "ar-DZ" : "fr-DZ")}</div>
                      {b.wilaya && <div>📍 {b.wilaya}{b.address ? ` — ${b.address}` : ""}</div>}
                      {b.latitude && (
                        <div>
                          🗺️ <a className="text-accent underline" target="_blank" rel="noopener" href={`https://maps.google.com/?q=${b.latitude},${b.longitude}`}>
                            {b.latitude.toFixed(5)}, {b.longitude!.toFixed(5)}
                          </a>
                        </div>
                      )}
                      {b.notes && <div className="italic">💬 {b.notes}</div>}
                    </div>
                  </div>
                  <div className="flex md:flex-col gap-2">
                    <select value={b.status} onChange={(e) => updateStatus(b.id, e.target.value)} className="input text-sm">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-blue-100 text-blue-800",
    done: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-rose-100 text-rose-800",
  };
  return <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${map[status] ?? "bg-muted"}`}>{status}</span>;
};

export default Admin;
