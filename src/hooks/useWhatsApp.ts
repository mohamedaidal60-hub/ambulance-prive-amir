import { useCallback } from "react";

export const useWhatsApp = () => {
  const openWhatsApp = useCallback((customMessage?: string) => {
    const message = customMessage || "Bonjour, j'ai besoin d'une ambulance.";
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
        }
      );
    } else {
      const fullMessage = `${message}\n\nPage: ${currentUrl}`;
      sendWA(fullMessage);
    }
  }, []);

  return { openWhatsApp };
};
