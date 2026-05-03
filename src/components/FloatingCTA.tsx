import { MessageCircle, Phone } from "lucide-react";
import { useWhatsApp } from "@/hooks/useWhatsApp";

const PHONE = "0550838380";
const PHONE_DISPLAY = "0550 83 83 80";

export const FloatingCTA = () => {
  const { openWhatsApp } = useWhatsApp();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <button
        onClick={() => openWhatsApp()}
        aria-label="WhatsApp"
        className="relative bg-accent text-white p-4 rounded-full shadow-glow hover:scale-110 transition-transform cursor-pointer"
      >
        <span className="absolute inset-0 rounded-full pulse-ring" />
        <MessageCircle className="w-6 h-6 relative" />
      </button>
      <a
        href={`tel:+213${PHONE.slice(1)}`}
        aria-label="Appeler"
        className="relative bg-gradient-primary text-white p-4 rounded-full shadow-glow hover:scale-110 transition-transform"
      >
        <span className="absolute inset-0 rounded-full pulse-ring" />
        <Phone className="w-6 h-6 relative" />
      </a>
    </div>
  );
};
