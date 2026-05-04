import { MessageCircle } from "lucide-react";

const WhatsAppFloating = () => {
  return (
    <a
      href="https://wa.me/919876543210?text=Hi%20Med Journey%2C%20I%27m%20interested%20in%20a%20package."
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 grid place-items-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 transition-transform animate-float"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
};

export default WhatsAppFloating;
