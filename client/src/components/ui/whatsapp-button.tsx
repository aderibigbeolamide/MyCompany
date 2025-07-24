import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WhatsAppButton() {
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "1234567890";
  
  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=Hi! I found your website and I'm interested in learning more about your services. Can you help me get started?`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="group relative">
        <Button
          onClick={handleWhatsAppClick}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 group-hover:shadow-xl"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        
        {/* Tooltip */}
        <div className="absolute bottom-16 right-0 mb-2 hidden group-hover:block">
          <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            💬 Chat with us on WhatsApp
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
