import { MessageCircle } from "lucide-react";

interface FeedbackFooterLinkProps {
  onNavigate: (screen: string) => void;
  variant?: "light" | "dark";
}

export function FeedbackFooterLink({ onNavigate, variant = "dark" }: FeedbackFooterLinkProps) {
  const isLight = variant === "light";
  
  return (
    <div className="absolute bottom-6 left-6 z-50 max-w-[300px]">
      <button
        onClick={() => onNavigate("feedback")}
        className={`flex items-start gap-3 text-left group p-3 rounded-lg transition-all shadow-lg ${
          isLight 
            ? "bg-white/20 hover:bg-white/30 backdrop-blur-sm" 
            : "bg-indigo-50 hover:bg-indigo-100 border border-indigo-200"
        }`}
      >
        <MessageCircle 
          className={`w-6 h-6 flex-shrink-0 group-hover:scale-110 transition-transform ${
            isLight 
              ? "text-white" 
              : "text-indigo-600"
          }`} 
        />
      </button>
    </div>
  );
}
