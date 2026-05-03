import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "fr" | "ar";

type Dict = Record<string, { fr: string; ar: string }>;

export const t: Dict = {
  // Nav
  nav_services: { fr: "Services", ar: "الخدمات" },
  nav_about: { fr: "À propos", ar: "من نحن" },
  nav_zones: { fr: "Zones", ar: "المناطق" },
  nav_contact: { fr: "Contact", ar: "اتصل بنا" },
  nav_book: { fr: "Réserver", ar: "احجز" },
  nav_admin: { fr: "Admin", ar: "الإدارة" },

  // Hero
  hero_badge: { fr: "Disponibles 24h/24 • 7j/7 partout en Algérie", ar: "متوفرون 24/24 • 7/7 في كامل الجزائر" },
  hero_title_1: { fr: "Ambulance Privée", ar: "سيارة إسعاف خاصة" },
  hero_title_2: { fr: "Rapide & Humaine", ar: "سريعة وإنسانية" },
  hero_desc: {
    fr: "Transport médicalisé, médecin à domicile et transport funéraire — une équipe qualifiée à vos côtés à chaque instant, avec respect et discrétion.",
    ar: "نقل طبي، طبيب في المنزل ونقل الجنازات — فريق مؤهل إلى جانبكم في كل لحظة، باحترام وتقدير.",
  },
  cta_emergency: { fr: "Appel d'urgence", ar: "اتصال طارئ" },
  cta_whatsapp: { fr: "WhatsApp", ar: "واتساب" },
  cta_book_now: { fr: "Réserver maintenant", ar: "احجز الآن" },
  feat_fast: { fr: "Réponse en moins de 10 min", ar: "استجابة في أقل من 10 دقائق" },
  feat_certified: { fr: "Personnel certifié", ar: "طاقم معتمد" },
  feat_human: { fr: "Soin & dignité", ar: "رعاية وكرامة" },
  intervention: { fr: "Intervention", ar: "تدخل" },

  // Services
  services_kicker: { fr: "Nos services", ar: "خدماتنا" },
  services_title: { fr: "Une réponse adaptée à chaque besoin", ar: "حلول مناسبة لكل احتياج" },
  services_sub: { fr: "De l'urgence au quotidien, nous sommes l'allié médical de votre famille partout en Algérie.", ar: "من الحالات الطارئة إلى الحياة اليومية، نحن الشريك الطبي لعائلتك في كامل الجزائر." },
  svc_transport_t: { fr: "Transport médicalisé", ar: "النقل الطبي" },
  svc_transport_d: { fr: "Transfert sécurisé entre hôpitaux, cliniques et domicile avec équipement médical complet et personnel formé.", ar: "نقل آمن بين المستشفيات والعيادات والمنازل بمعدات طبية كاملة وطاقم مدرب." },
  svc_doctor_t: { fr: "Médecin à domicile", ar: "طبيب في المنزل" },
  svc_doctor_d: { fr: "Consultation médicale chez vous, à toute heure. Idéal pour personnes âgées, enfants ou cas non urgents.", ar: "استشارة طبية في منزلك في أي وقت. مثالي لكبار السن والأطفال والحالات غير الطارئة." },
  svc_funeral_t: { fr: "Transport funéraire", ar: "نقل الجنازات" },
  svc_funeral_d: { fr: "Service respectueux et discret de transport du défunt vers le lieu de toilette ou la dernière demeure.", ar: "خدمة محترمة وراقية لنقل المتوفى إلى مكان التغسيل أو المثوى الأخير." },

  // About / Zones / Stats / Testimonials
  about_kicker: { fr: "Qui sommes-nous", ar: "من نحن" },
  about_title: { fr: "Votre service médical de confiance en Algérie", ar: "خدمتك الطبية الموثوقة في الجزائر" },
  zones_kicker: { fr: "Couverture", ar: "التغطية" },
  zones_title: { fr: "Présents partout en Algérie", ar: "حاضرون في كامل الجزائر" },
  zones_sub: { fr: "Nous intervenons dans toutes les wilayas, 24h/24 et 7j/7.", ar: "نتدخل في جميع الولايات، 24/24 و 7/7." },
  stats_patients: { fr: "Patients transportés", ar: "مرضى تم نقلهم" },
  stats_wilayas: { fr: "Wilayas couvertes", ar: "ولايات مغطاة" },
  stats_avail: { fr: "Disponibilité", ar: "التوفر" },
  stats_satisfied: { fr: "Clients satisfaits", ar: "عملاء راضون" },
  testi_kicker: { fr: "Témoignages", ar: "شهادات" },
  testi_title: { fr: "Ils nous font confiance", ar: "يثقون بنا" },
  cta_title: { fr: "Une urgence ? Appelez maintenant", ar: "حالة طارئة؟ اتصل الآن" },
  cta_sub: { fr: "Notre équipe est mobilisée 24h/24. Une seule sonnerie sépare votre famille de l'aide qu'elle mérite.", ar: "فريقنا متوفر 24/24. مكالمة واحدة تفصل عائلتك عن المساعدة التي تستحقها." },

  // Booking page
  book_title: { fr: "Réserver une ambulance", ar: "حجز سيارة إسعاف" },
  book_sub: { fr: "Renseignez vos informations, choisissez la date et l'heure du rendez-vous. Nous vous rappelons immédiatement.", ar: "املأ معلوماتك واختر تاريخ ووقت الموعد. سنتصل بك على الفور." },
  f_name: { fr: "Nom complet", ar: "الاسم الكامل" },
  f_phone: { fr: "Téléphone", ar: "رقم الهاتف" },
  f_service: { fr: "Service", ar: "الخدمة" },
  f_wilaya: { fr: "Wilaya", ar: "الولاية" },
  f_address: { fr: "Adresse", ar: "العنوان" },
  f_date: { fr: "Date et heure", ar: "التاريخ والوقت" },
  f_notes: { fr: "Notes (optionnel)", ar: "ملاحظات (اختياري)" },
  f_locate: { fr: "📍 Utiliser ma position", ar: "📍 استخدم موقعي" },
  f_locating: { fr: "Localisation...", ar: "جارٍ تحديد الموقع..." },
  f_loc_ok: { fr: "Position enregistrée", ar: "تم حفظ الموقع" },
  f_loc_err: { fr: "Impossible d'obtenir la position", ar: "تعذر الحصول على الموقع" },
  f_submit: { fr: "Confirmer la réservation", ar: "تأكيد الحجز" },
  f_success: { fr: "Réservation envoyée ! Nous vous contactons sous peu.", ar: "تم إرسال الحجز! سنتصل بك قريبًا." },
  f_error: { fr: "Erreur lors de l'envoi. Réessayez ou appelez-nous.", ar: "حدث خطأ أثناء الإرسال. أعد المحاولة أو اتصل بنا." },

  // Admin
  admin_login: { fr: "Espace administrateur", ar: "فضاء المسؤول" },
  admin_email: { fr: "Email", ar: "البريد الإلكتروني" },
  admin_password: { fr: "Mot de passe", ar: "كلمة المرور" },
  admin_signin: { fr: "Se connecter", ar: "تسجيل الدخول" },
  admin_dashboard: { fr: "Tableau de bord", ar: "لوحة التحكم" },
  admin_logout: { fr: "Déconnexion", ar: "تسجيل الخروج" },
  admin_change_pwd: { fr: "Changer le mot de passe", ar: "تغيير كلمة المرور" },
  admin_new_pwd: { fr: "Nouveau mot de passe", ar: "كلمة المرور الجديدة" },
  admin_no_bookings: { fr: "Aucune réservation pour l'instant.", ar: "لا توجد حجوزات حالياً." },
  st_pending: { fr: "En attente", ar: "قيد الانتظار" },
  st_confirmed: { fr: "Confirmée", ar: "مؤكدة" },
  st_done: { fr: "Terminée", ar: "منجزة" },
  st_cancelled: { fr: "Annulée", ar: "ملغاة" },

  back_home: { fr: "← Retour à l'accueil", ar: "→ العودة إلى الرئيسية" },
};

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; tr: (k: keyof typeof t) => string }>({
  lang: "fr",
  setLang: () => {},
  tr: (k) => t[k]?.fr ?? String(k),
});

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem("lang") as Lang) || "fr");
  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  const setLang = (l: Lang) => setLangState(l);
  const tr = (k: keyof typeof t) => t[k]?.[lang] ?? String(k);
  return <LangCtx.Provider value={{ lang, setLang, tr }}>{children}</LangCtx.Provider>;
};

export const useLang = () => useContext(LangCtx);
