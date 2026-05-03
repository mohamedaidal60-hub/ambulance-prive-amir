import { motion, type Variants } from "framer-motion";
import { Phone, MessageCircle, Clock, Shield, Heart, MapPin, Ambulance, Stethoscope, Cross, CheckCircle2, Star, ChevronDown, Calendar, Languages } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { useLang } from "@/lib/i18n";
import logo from "@/assets/logo.png";
import heroImg from "@/assets/hero-ambulance.jpg";
import transportImg from "@/assets/service-transport.jpg";
import doctorImg from "@/assets/service-doctor.jpg";
import funeralImg from "@/assets/service-funeral.jpg";

import { useWhatsApp } from "@/hooks/useWhatsApp";

const PHONE = "0550838380";
const PHONE_DISPLAY = "0550 83 83 80";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as any } },
};

const Counter = ({ to, suffix = "" }: { to: number; suffix?: string }) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - startTime) / duration, 1);
      setN(Math.floor(start + (to - start) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to]);
  return <span>{n.toLocaleString()}{suffix}</span>;
};

const Nav = () => {
  const { tr, lang, setLang } = useLang();
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between py-3 px-4 gap-3">
        <a href="#" className="flex items-center gap-3">
          <img src={logo} alt="Logo Ambulance Amir Algérie" className="h-12 w-12 object-contain" width={48} height={48} />
          <div className="leading-tight">
            <div className="font-extrabold text-lg text-secondary">Ambulance Amir</div>
            <div className="text-xs text-muted-foreground">Service 24/7</div>
          </div>
        </a>
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold">
          <a href="#services" className="hover:text-primary transition-colors">{tr("nav_services")}</a>
          <a href="#about" className="hover:text-primary transition-colors">{tr("nav_about")}</a>
          <a href="#zones" className="hover:text-primary transition-colors">{tr("nav_zones")}</a>
          <Link to="/reserver" className="hover:text-primary transition-colors">{tr("nav_book")}</Link>
          <Link to="/admin" className="hover:text-primary transition-colors">{tr("nav_admin")}</Link>
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => setLang(lang === "fr" ? "ar" : "fr")} className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full border hover:bg-muted">
            <Languages className="w-3.5 h-3.5" />{lang === "fr" ? "العربية" : "FR"}
          </button>
          <a
            href={`tel:+213${PHONE.slice(1)}`}
            className="relative inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground font-bold px-4 py-2.5 rounded-full shadow-glow hover:scale-105 transition-transform"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
            </span>
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">{PHONE_DISPLAY}</span>
          </a>
        </div>
      </div>
    </header>
  );
};

const Hero = () => {
  const { tr } = useLang();
  const { openWhatsApp } = useWhatsApp();
  return (
  <section className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-gradient-hero">
    <div className="absolute inset-0">
      <img src={heroImg} alt="Ambulance privée Amir en intervention en Algérie" className="w-full h-full object-cover opacity-30" width={1920} height={1080} fetchPriority="high" />
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-transparent" />
    </div>

    <div className="container relative mx-auto px-4 grid md:grid-cols-2 gap-12 items-center py-20">
      <motion.div initial="hidden" animate="show" variants={fadeUp} className="text-white">
        <motion.span variants={fadeUp} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          {tr("hero_badge")}
        </motion.span>
        <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black leading-[1.05] mb-6">
          {tr("hero_title_1")}
          <span className="block text-gradient bg-gradient-to-r from-primary-glow to-accent bg-clip-text text-transparent">
            {tr("hero_title_2")}
          </span>
        </motion.h1>
        <motion.p variants={fadeUp} className="text-lg md:text-xl text-white/85 mb-8 max-w-xl">
          {tr("hero_desc")}
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
          <a href={`tel:+213${PHONE.slice(1)}`} className="group inline-flex items-center gap-3 bg-gradient-primary text-primary-foreground font-bold px-7 py-4 rounded-full shadow-glow hover:shadow-elegant transition-all hover:-translate-y-0.5">
            <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            {tr("cta_emergency")}
          </a>
          <Link to="/reserver" className="inline-flex items-center gap-3 bg-white text-secondary font-bold px-7 py-4 rounded-full shadow-card hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5" />
            {tr("cta_book_now")}
          </Link>
          <button onClick={() => openWhatsApp()} className="inline-flex items-center gap-3 bg-accent text-accent-foreground font-bold px-7 py-4 rounded-full shadow-card hover:scale-105 transition-transform">
            <MessageCircle className="w-5 h-5" />
            {tr("cta_whatsapp")}
          </button>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-6 text-sm text-white/80">
          <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-accent" /> {tr("feat_fast")}</div>
          <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-accent" /> {tr("feat_certified")}</div>
          <div className="flex items-center gap-2"><Heart className="w-4 h-4 text-accent" /> {tr("feat_human")}</div>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }} className="hidden md:block relative">
        <div className="relative animate-float">
          <div className="absolute -inset-8 bg-primary/30 blur-3xl rounded-full" />
          <img src={heroImg} alt="Service ambulance Amir" className="relative rounded-3xl shadow-elegant w-full" width={1920} height={1080} />
          <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-elegant flex items-center gap-3">
            <div className="bg-gradient-primary text-white rounded-xl p-3"><Ambulance className="w-6 h-6" /></div>
            <div>
              <div className="text-xs text-muted-foreground">{tr("intervention")}</div>
              <div className="font-bold text-secondary">24h/24 • 7j/7</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>

    <a href="#services" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 animate-bounce">
      <ChevronDown className="w-8 h-8" />
    </a>
  </section>
  );
};

const Marquee = () => (
  <div className="bg-secondary text-white py-6 overflow-hidden border-y border-white/10">
    <div className="flex gap-12 animate-marquee whitespace-nowrap text-lg font-bold uppercase tracking-wider">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex gap-12">
          {["🚑 Intervention rapide", "🕊️ Respect & dignité", "⏱️ 24/7 toute l'année", "🇩🇿 Partout en Algérie", "❤️ Équipe certifiée", "📞 0550 83 83 80"].map((t) => (
            <span key={t} className="flex items-center gap-12">{t}<span className="text-primary-glow">•</span></span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const services = [
  { icon: Ambulance, titleKey: "svc_transport_t", descKey: "svc_transport_d", img: transportImg },
  { icon: Stethoscope, titleKey: "svc_doctor_t", descKey: "svc_doctor_d", img: doctorImg },
  { icon: Cross, titleKey: "svc_funeral_t", descKey: "svc_funeral_d", img: funeralImg },
];

const Services = () => {
  const { tr } = useLang();
  return (
  <section id="services" className="py-24 bg-gradient-soft">
    <div className="container mx-auto px-4">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-primary font-bold uppercase tracking-widest text-sm">{tr("services_kicker")}</span>
        <h2 className="text-4xl md:text-5xl mt-3 mb-4">{tr("services_title")}</h2>
        <p className="text-muted-foreground text-lg">{tr("services_sub")}</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {services.map((s, i) => (
          <motion.article
            key={s.titleKey}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className="group bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-elegant transition-all hover:-translate-y-2"
          >
            <div className="relative h-56 overflow-hidden">
              <img src={s.img} alt={tr(s.titleKey as any)} loading="lazy" width={1280} height={896} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
              <div className="absolute bottom-4 left-4 bg-gradient-primary text-white p-3 rounded-2xl shadow-glow">
                <s.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="p-7">
              <h3 className="text-2xl font-bold mb-3 text-secondary">{tr(s.titleKey as any)}</h3>
              <p className="text-muted-foreground mb-5">{tr(s.descKey as any)}</p>
              <Link to="/reserver" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                <Calendar className="w-4 h-4" /> {tr("cta_book_now")}
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
  );
};

const Stats = () => (
  <section className="py-20 bg-gradient-hero text-white relative overflow-hidden">
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
    <div className="container relative mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      {[
        { n: 12000, s: "+", l: "Patients transportés" },
        { n: 48, s: "", l: "Wilayas couvertes" },
        { n: 24, s: "/7", l: "Disponibilité" },
        { n: 98, s: "%", l: "Clients satisfaits" },
      ].map((stat, i) => (
        <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
          <div className="text-5xl md:text-6xl font-black text-gradient bg-gradient-to-b from-white to-primary-glow bg-clip-text text-transparent">
            <Counter to={stat.n} suffix={stat.s} />
          </div>
          <div className="mt-2 text-white/80 font-semibold uppercase tracking-wider text-sm">{stat.l}</div>
        </motion.div>
      ))}
    </div>
  </section>
);

const About = () => {
  const { tr } = useLang();
  return (
  <section id="about" className="py-24">
    <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
      <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative">
        <img src={transportImg} alt="Équipe Ambulance Amir en intervention" loading="lazy" width={1280} height={896} className="rounded-3xl shadow-elegant" />
        <div className="absolute -bottom-8 -right-4 md:-right-8 bg-card rounded-2xl shadow-elegant p-6 max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
          </div>
          <p className="text-sm font-medium">"Service rapide et professionnel."</p>
          <p className="text-xs text-muted-foreground mt-2">— Famille Benali, Alger</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
        <span className="text-primary font-bold uppercase tracking-widest text-sm">{tr("about_kicker")}</span>
        <h2 className="text-4xl md:text-5xl mt-3 mb-6">{tr("about_title")}</h2>
        <p className="text-muted-foreground text-lg mb-6">{tr("hero_desc")}</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Clock, t: tr("feat_fast") },
            { icon: Shield, t: tr("feat_certified") },
            { icon: Heart, t: tr("feat_human") },
            { icon: MapPin, t: tr("zones_title") },
          ].map(({ icon: Icon, t }) => (
            <div key={t} className="flex items-center gap-3 bg-muted rounded-xl p-4">
              <div className="bg-gradient-primary text-white p-2 rounded-lg"><Icon className="w-5 h-5" /></div>
              <span className="font-semibold text-sm">{t}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
  );
};

const Zones = () => {
  const { tr } = useLang();
  const wilayas = ["Alger", "Oran", "Constantine", "Annaba", "Blida", "Sétif", "Tizi Ouzou", "Béjaïa", "Batna", "Tlemcen", "Tipaza", "Boumerdès", "Médéa", "Chlef", "Mostaganem", "Skikda"];
  return (
    <section id="zones" className="py-24 bg-gradient-soft">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
          <span className="text-primary font-bold uppercase tracking-widest text-sm">{tr("zones_kicker")}</span>
          <h2 className="text-4xl md:text-5xl mt-3 mb-4">{tr("zones_title")}</h2>
          <p className="text-muted-foreground text-lg">{tr("zones_sub")}</p>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {wilayas.map((w, i) => (
            <motion.span
              key={w}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="bg-card border border-border px-5 py-2.5 rounded-full font-semibold text-secondary hover:bg-gradient-primary hover:text-white hover:border-transparent transition-all cursor-default shadow-card"
            >
              <MapPin className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />{w}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
};

const testimonials = [
  { name: "Karim B.", city: "Alger", text: { fr: "Service exceptionnel, l'ambulance est arrivée en moins de 15 minutes.", ar: "خدمة استثنائية، وصلت سيارة الإسعاف في أقل من 15 دقيقة." }, rating: 5 },
  { name: "Fatima Z.", city: "Oran", text: { fr: "Ils ont accompagné ma mère avec énormément de respect.", ar: "رافقوا والدتي باحترام كبير." }, rating: 5 },
  { name: "Mohamed L.", city: "Constantine", text: { fr: "Disponibles même la nuit. Tarifs corrects et équipe humaine.", ar: "متوفرون حتى ليلاً. أسعار معقولة وفريق إنساني." }, rating: 5 },
  { name: "Amina K.", city: "Blida", text: { fr: "Transport funéraire géré avec dignité dans un moment difficile.", ar: "تم تدبير نقل الجنازة بكرامة في لحظة صعبة." }, rating: 5 },
];

const Testimonials = () => {
  const { tr, lang } = useLang();
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="py-24 bg-secondary text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary-glow font-bold uppercase tracking-widest text-sm">{tr("testi_kicker")}</span>
          <h2 className="text-4xl md:text-5xl mt-3">{tr("testi_title")}</h2>
        </div>
        <div className="max-w-3xl mx-auto relative h-64">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              animate={{ opacity: i === idx ? 1 : 0, y: i === idx ? 0 : 20 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex flex-col items-center text-center"
              style={{ pointerEvents: i === idx ? "auto" : "none" }}
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="w-5 h-5 fill-primary-glow text-primary-glow" />)}
              </div>
              <p className="text-xl md:text-2xl italic mb-6 text-white/90">"{t.text[lang]}"</p>
              <div className="font-bold">{t.name}</div>
              <div className="text-sm text-white/60">{t.city}</div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} className={`h-2 rounded-full transition-all ${i === idx ? "w-8 bg-primary" : "w-2 bg-white/30"}`} aria-label={`Témoignage ${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  const { tr } = useLang();
  const { openWhatsApp } = useWhatsApp();
  return (
  <section id="contact" className="py-24 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-primary" />
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="container relative mx-auto px-4 text-center text-white max-w-3xl">
      <h2 className="text-4xl md:text-6xl font-black mb-6">{tr("cta_title")}</h2>
      <p className="text-xl text-white/90 mb-10">{tr("cta_sub")}</p>
      <div className="flex flex-wrap justify-center gap-4">
        <a href={`tel:+213${PHONE.slice(1)}`} className="inline-flex items-center gap-3 bg-white text-primary font-black text-xl px-10 py-5 rounded-full shadow-elegant hover:scale-105 transition-transform">
          <Phone className="w-6 h-6" /> {PHONE_DISPLAY}
        </a>
        <Link to="/reserver" className="inline-flex items-center gap-3 bg-secondary text-white font-bold px-8 py-5 rounded-full shadow-elegant hover:scale-105 transition-transform">
          <Calendar className="w-5 h-5" /> {tr("cta_book_now")}
        </Link>
        <button onClick={() => openWhatsApp()} className="inline-flex items-center gap-3 bg-accent text-white font-bold px-8 py-5 rounded-full shadow-elegant hover:scale-105 transition-transform">
          <MessageCircle className="w-5 h-5" /> {tr("cta_whatsapp")}
        </button>
      </div>
    </motion.div>
  </section>
  );
};

const Footer = () => (
  <footer className="bg-secondary text-white/80 py-12">
    <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <img src={logo} alt="Logo" className="h-12 w-12 bg-white rounded-xl p-1" width={48} height={48} />
          <div className="font-extrabold text-xl text-white">Ambulance Amir</div>
        </div>
        <p className="text-sm">Service d'ambulance privée et de transport médical 24h/24 partout en Algérie.</p>
      </div>
      <div>
        <h4 className="font-bold text-white mb-4">Services</h4>
        <ul className="space-y-2 text-sm">
          <li>Transport médicalisé</li>
          <li>Médecin à domicile</li>
          <li>Transport funéraire</li>
          <li>Inter-wilayas</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-white mb-4">Contact</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> {PHONE_DISPLAY}</li>
          <li className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> WhatsApp 24/7</li>
          <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Algérie — toutes wilayas</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-white/10 mt-10 pt-6 text-center text-sm">
      © {new Date().getFullYear()} Ambulance Amir — Tous droits réservés.
    </div>
  </footer>
);


const Index = () => {
  const { lang } = useLang();
  return (
  <HelmetProvider>
    <Helmet>
      <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} />
    </Helmet>
    <div className="min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Stats />
        <About />
        <Zones />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  </HelmetProvider>
  );
};

export default Index;
