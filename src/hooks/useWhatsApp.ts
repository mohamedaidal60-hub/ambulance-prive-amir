import { useCallback } from "react";
import { useLang } from "@/lib/i18n";

export const useWhatsApp = () => {
  const { lang } = useLang();

  const openWhatsApp = useCallback((customMessage?: string) => {
    const defaultMessage = lang === "ar" 
      ? "مرحباً، أحتاج إلى سيارة إسعاف." 
      : "Bonjour, j'ai besoin d'une ambulance.";
    
    const message = customMessage || defaultMessage;
    const currentUrl = window.location.href;
    
    const sendWA = (msg: string) => {
      const waUrl = `https://wa.me/213550838380?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, "_blank");
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
          const fullMessage = `${message}\n\nPage: ${currentUrl}\nLocalisation: ${locationUrl}`;
          sendWA(fullMessage);
        },
        (error) => {
          console.error("Error getting location:", error);
          const fullMessage = `${message}\n\nPage: ${currentUrl}`;
          sendWA(fullMessage);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      const fullMessage = `${message}\n\nPage: ${currentUrl}`;
      sendWA(fullMessage);
    }
  }, [lang]);

  return { openWhatsApp };
};
