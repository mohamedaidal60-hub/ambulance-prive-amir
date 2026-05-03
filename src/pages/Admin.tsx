import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";
import { toast } from "sonner";
import { Loader2, LogOut, KeyRound, RefreshCw, BarChart3, Target, Globe, Plus, ExternalLink, TrendingUp, MousePointer2, Eye, DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface Campaign {
  id: string;
  name: string;
  budget: number;
  status: "active" | "paused" | "ended";
  clicks: number;
  impressions: number;
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

  // marketing (mock data for now, could be from DB)
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: "1", name: "Ambulance Alger Centre", budget: 1500, status: "active", clicks: 450, impressions: 12000, created_at: new Date().toISOString() },
    { id: "2", name: "Transport Funéraire Inter-Wilayas", budget: 3000, status: "paused", clicks: 120, impressions: 5000, created_at: new Date().toISOString() },
  ]);

  // change password
  const [newPwd, setNewPwd] = useState("");

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) checkAdmin(s.user);
      else { setIsAdmin(false); setChecking(false); }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) checkAdmin(data.session.user);
      else setChecking(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const checkAdmin = async (user: any) => {
    setChecking(true);
    const uid = user.id;
    
    // First, check the database
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin").maybeSingle();
    let is_admin = !!data;

    // FORCE access for the bootstrap admin email
    if (user.email === "mohamed-amir@ambulance.com") {
      is_admin = true;
      // Try to persist the role in the background
      if (!data) {
        supabase.from("user_roles").insert({ user_id: uid, role: "admin" }).then();
      }
    }

    setIsAdmin(is_admin);
    setChecking(false);
    if (is_admin) {
      loadBookings();
    }
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
      if (email === "mohamed-amir@ambulance.com") {
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
          {session && !isAdmin && session.user.email !== "mohamed-amir@ambulance.com" && (
            <p className="text-sm text-destructive mt-4 text-center">⛔ Accès refusé — compte non administrateur.</p>
          )}
          {session && !isAdmin && session.user.email === "mohamed-amir@ambulance.com" && (
            <p className="text-sm text-amber-600 mt-4 text-center animate-pulse">⚙️ Initialisation de vos droits d'accès...</p>
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

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="bookings" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Réservations
            </TabsTrigger>
            <TabsTrigger value="marketing" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Marketing & Ads
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-8">
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-xl">Réservations ({bookings.length})</h2>
                <button onClick={loadBookings} className="p-2 rounded-full hover:bg-muted text-primary" title="Refresh">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
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
          </TabsContent>

          <TabsContent value="marketing" className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Impressions Ads</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">17,420</div>
                  <p className="text-xs text-muted-foreground">+20.1% depuis le mois dernier</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clics</CardTitle>
                  <MousePointer2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">570</div>
                  <p className="text-xs text-muted-foreground">+12% depuis le mois dernier</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CTR Moyen</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.27%</div>
                  <p className="text-xs text-muted-foreground">+4.3% depuis le mois dernier</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Budget Dépensé</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4,500 DA</div>
                  <p className="text-xs text-muted-foreground">+18% depuis le mois dernier</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-xl flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" /> Campagnes Google Ads
                  </h2>
                  <button className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-bold">
                    <Plus className="w-4 h-4" /> Nouvelle Campagne
                  </button>
                </div>

                <div className="grid gap-4">
                  {campaigns.map((c) => (
                    <article key={c.id} className="bg-card border rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold">{c.name}</h3>
                          <Badge variant={c.status === "active" ? "default" : "secondary"}>
                            {c.status === "active" ? "Active" : "En pause"}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Budget: <span className="font-semibold text-foreground">{c.budget} DA/jour</span> • 
                          Créée le: {new Date(c.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-sm font-bold">{c.clicks}</div>
                          <div className="text-[10px] text-muted-foreground uppercase">Clics</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold">{c.impressions}</div>
                          <div className="text-[10px] text-muted-foreground uppercase">Impr.</div>
                        </div>
                        <button className="p-2 hover:bg-muted rounded-lg text-primary">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <aside className="space-y-6">
                <section className="bg-card border rounded-2xl p-5">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" /> SEO & Liens
                  </h3>
                  <div className="space-y-3">
                    <a 
                      href="https://ads.google.com" 
                      target="_blank" 
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-sm font-medium"
                    >
                      Google Ads Console <ExternalLink className="w-3 h-3" />
                    </a>
                    <a 
                      href="https://search.google.com/search-console" 
                      target="_blank" 
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-sm font-medium"
                    >
                      Search Console <ExternalLink className="w-3 h-3" />
                    </a>
                    <a 
                      href="/sitemap.xml" 
                      target="_blank" 
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-sm font-medium"
                    >
                      Plan du site (XML) <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </section>

                <div className="bg-gradient-primary rounded-2xl p-5 text-white shadow-glow">
                  <h4 className="font-bold mb-2">Besoin d'aide ?</h4>
                  <p className="text-xs text-white/80 mb-4">
                    Pour configurer des campagnes Google Ads réelles avec suivi de conversion, contactez le support technique.
                  </p>
                  <button className="w-full py-2 bg-white text-primary rounded-xl text-sm font-bold shadow-sm">
                    Support Technique
                  </button>
                </div>
              </aside>
            </div>
          </TabsContent>
        </Tabs>
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
