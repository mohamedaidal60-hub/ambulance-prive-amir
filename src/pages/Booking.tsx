import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, MapPin, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";
import logo from "@/assets/logo.png";

const PHONE_DISPLAY = "0550 83 83 80";

const schema = z.object({
  full_name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(30),
  service: z.string().min(2).max(80),
  wilaya: z.string().max(60).optional(),
  address: z.string().max(300).optional(),
  scheduled_at: z.string().min(1),
  notes: z.string().max(500).optional(),
});

const wilayas = ["Alger", "Oran", "Constantine", "Annaba", "Blida", "Sétif", "Tizi Ouzou", "Béjaïa", "Batna", "Tlemcen", "Tipaza", "Boumerdès", "Médéa", "Chlef", "Mostaganem", "Skikda"];

const Booking = () => {
  const { tr, lang, setLang } = useLang();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    service: lang === "ar" ? "النقل الطبي" : "Transport médicalisé",
    wilaya: "Alger",
    address: "",
    scheduled_at: "",
    notes: "",
  });

  const services = [
    { fr: "Transport médicalisé", ar: "النقل الطبي" },
    { fr: "Médecin à domicile", ar: "طبيب في المنزل" },
    { fr: "Transport funéraire", ar: "نقل الجنازات" },
    { fr: "Inter-wilayas", ar: "بين الولايات" },
  ];

  const locate = () => {
    if (!navigator.geolocation) return toast.error(tr("f_loc_err"));
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        toast.success(tr("f_loc_ok"));
        setLocating(false);
      },
      () => { toast.error(tr("f_loc_err")); setLocating(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const d = parsed.data;
    const { error } = await supabase.from("bookings").insert([{
      full_name: d.full_name,
      phone: d.phone,
      service: d.service,
      wilaya: d.wilaya ?? null,
      address: d.address ?? null,
      notes: d.notes ?? null,
      latitude: coords?.lat ?? null,
      longitude: coords?.lng ?? null,
      scheduled_at: new Date(d.scheduled_at).toISOString(),
    }]);
    setLoading(false);
    if (error) { toast.error(tr("f_error")); return; }
    toast.success(tr("f_success"));
    setTimeout(() => nav("/"), 1500);
  };

  const Arrow = lang === "ar" ? ArrowRight : ArrowLeft;
  const minDate = new Date(Date.now() - 5 * 60000).toISOString().slice(0, 16);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-10 w-10" width={40} height={40} />
            <span className="font-extrabold text-secondary">Ambulance Amir</span>
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={() => setLang(lang === "fr" ? "ar" : "fr")} className="text-sm font-bold px-3 py-1.5 rounded-full border hover:bg-muted">
              {lang === "fr" ? "العربية" : "Français"}
            </button>
            <a href="tel:+213550838380" className="hidden sm:inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground font-bold px-4 py-2 rounded-full">
              <Phone className="w-4 h-4" /> {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <Arrow className="w-4 h-4" /> {tr("back_home")}
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-3xl shadow-elegant p-8 md:p-10">
          <h1 className="text-3xl md:text-4xl font-black text-secondary mb-2">{tr("book_title")}</h1>
          <p className="text-muted-foreground mb-8">{tr("book_sub")}</p>

          <form onSubmit={submit} className="space-y-5">
            <Field label={tr("f_name")}>
              <input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="input" />
            </Field>
            <Field label={tr("f_phone")}>
              <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" placeholder="0550 ..." />
            </Field>
            <Field label={tr("f_service")}>
              <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="input">
                {services.map((s) => <option key={s.fr} value={lang === "ar" ? s.ar : s.fr}>{lang === "ar" ? s.ar : s.fr}</option>)}
              </select>
            </Field>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label={tr("f_wilaya")}>
                <select value={form.wilaya} onChange={(e) => setForm({ ...form, wilaya: e.target.value })} className="input">
                  {wilayas.map((w) => <option key={w} value={w}>{w}</option>)}
                </select>
              </Field>
              <Field label={tr("f_date")}>
                <input required type="datetime-local" min={minDate} value={form.scheduled_at} onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })} className="input" />
              </Field>
            </div>
            <Field label={tr("f_address")}>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input" />
            </Field>
            <button type="button" onClick={locate} disabled={locating} className="inline-flex items-center gap-2 bg-accent/10 text-accent border border-accent/30 font-semibold px-4 py-2 rounded-full hover:bg-accent/20 transition-colors">
              {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
              {locating ? tr("f_locating") : coords ? `✓ ${tr("f_loc_ok")}` : tr("f_locate")}
            </button>
            <Field label={tr("f_notes")}>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="input" />
            </Field>

            <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 bg-gradient-primary text-primary-foreground font-bold py-4 rounded-full shadow-glow hover:shadow-elegant transition-all disabled:opacity-60">
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {tr("f_submit")}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="block text-sm font-semibold text-secondary mb-1.5">{label}</span>
    {children}
  </label>
);

export default Booking;
