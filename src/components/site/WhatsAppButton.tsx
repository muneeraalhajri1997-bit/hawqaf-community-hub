import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/0558432000"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معنا على واتساب"
      className="group fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg animate-wa-pulse transition-transform hover:scale-110"
    >
      <MessageCircle className="h-7 w-7" />
      <span className="pointer-events-none absolute bottom-full left-0 mb-2 whitespace-nowrap rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
        تواصل معنا على واتساب
      </span>
    </a>
  );
}
