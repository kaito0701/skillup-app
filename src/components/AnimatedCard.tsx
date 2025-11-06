import { motion } from "motion/react";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  slideFrom?: "left" | "right" | "bottom" | "top";
  delay?: number;
  glowColor?: "orange" | "amber" | "yellow" | "pink" | "rose" | "purple" | "blue" | "indigo" | "emerald";
  hoverLift?: boolean;
}

export function AnimatedCard({
  children,
  onClick,
  className = "",
  slideFrom = "bottom",
  delay = 0,
  glowColor = "orange",
  hoverLift = true,
}: AnimatedCardProps) {
  // Slide animation variants
  const slideVariants = {
    left: { x: -40, opacity: 0 },
    right: { x: 40, opacity: 0 },
    bottom: { y: 20, opacity: 0 },
    top: { y: -20, opacity: 0 },
  };

  // Glow color classes
  const glowColors = {
    orange: "hover:shadow-[0_0_28px_rgba(251,146,60,0.4)]",
    amber: "hover:shadow-[0_0_28px_rgba(251,191,36,0.4)]",
    yellow: "hover:shadow-[0_0_28px_rgba(250,204,21,0.4)]",
    pink: "hover:shadow-[0_0_28px_rgba(236,72,153,0.4)]",
    rose: "hover:shadow-[0_0_28px_rgba(251,113,133,0.4)]",
    purple: "hover:shadow-[0_0_28px_rgba(168,85,247,0.4)]",
    blue: "hover:shadow-[0_0_28px_rgba(59,130,246,0.4)]",
    indigo: "hover:shadow-[0_0_28px_rgba(99,102,241,0.4)]",
    emerald: "hover:shadow-[0_0_28px_rgba(16,185,129,0.4)]",
  };

  return (
    <motion.div
      initial={slideVariants[slideFrom]}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 120,
        damping: 15,
      }}
      whileHover={hoverLift ? { y: -6, scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`
        ${glowColors[glowColor]}
        ${className}
        transition-all duration-300 ease-out
        ${onClick ? 'cursor-pointer' : ''}
        active:shadow-md
      `}
    >
      {children}
    </motion.div>
  );
}
