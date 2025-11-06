import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";

interface FeedbackButtonProps {
  onNavigate: (screen: string) => void;
}

export function FeedbackButton({ onNavigate }: FeedbackButtonProps) {
  return (
    <div 
      className="fixed z-[60] pointer-events-none"
      style={{ 
        isolation: 'isolate',
        bottom: 'calc(50vh - 50% * min(100vw / 28rem, 1) + 6rem * min(100vw / 28rem, 1))',
        right: 'calc(50vw - 14rem * min(100vw / 28rem, 1) + 1.5rem)',
        transform: 'scale(' + Math.min(1, window.innerWidth / 448) + ')',
        width: '56px',
        height: '56px',
      }}
    >
      <motion.button
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ 
          delay: 0.5,
          duration: 0.6,
          type: "spring",
          stiffness: 180,
          damping: 12
        }}
        whileHover={{ 
          scale: 1.15,
          rotate: 5,
          transition: { duration: 0.2, type: "spring", stiffness: 300 }
        }}
        whileTap={{ 
          scale: 0.9,
          rotate: -5
        }}
        onClick={() => onNavigate("feedback")}
        className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-2xl hover:from-orange-500 hover:to-pink-500 border-3 border-white pointer-events-auto"
        aria-label="Send Feedback"
        style={{
          willChange: 'transform',
        }}
      >
        {/* Animated glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-50"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            filter: 'blur(8px)',
          }}
        />

        {/* Pulse effect */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white"
          animate={{
            scale: [1, 1.5],
            opacity: [1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />

        {/* Icon with bounce */}
        <motion.div
          className="relative z-10"
          animate={{ 
            y: [0, -4, 0],
            rotate: [0, -5, 5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.3, 0.6, 1]
          }}
        >
          <MessageCircle className="w-6 h-6" />
        </motion.div>

        {/* Notification dot */}
        <motion.div
          className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.button>
    </div>
  );
}
