import { motion } from "motion/react";
import { ReactNode } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  slideFrom?: "left" | "right" | "bottom" | "top";
  delay?: number;
  glowColor?: "orange" | "amber" | "yellow" | "pink" | "rose" | "purple" | "indigo";
  disabled?: boolean;
}

export function AnimatedButton({
  children,
  onClick,
  className = "",
  variant = "primary",
  slideFrom = "bottom",
  delay = 0,
  glowColor = "orange",
  disabled = false,
}: AnimatedButtonProps) {
  // Slide animation variants
  const slideVariants = {
    left: { x: -40, opacity: 0 },
    right: { x: 40, opacity: 0 },
    bottom: { y: 20, opacity: 0 },
    top: { y: -20, opacity: 0 },
  };

  // Glow color classes
  const glowColors = {
    orange: "hover:shadow-[0_0_24px_rgba(251,146,60,0.5)]",
    amber: "hover:shadow-[0_0_24px_rgba(251,191,36,0.5)]",
    yellow: "hover:shadow-[0_0_24px_rgba(250,204,21,0.5)]",
    pink: "hover:shadow-[0_0_24px_rgba(236,72,153,0.5)]",
    rose: "hover:shadow-[0_0_24px_rgba(251,113,133,0.5)]",
    purple: "hover:shadow-[0_0_24px_rgba(168,85,247,0.5)]",
    indigo: "hover:shadow-[0_0_24px_rgba(99,102,241,0.5)]",
  };

  // Base variant styles
  const variantStyles = {
    primary: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700",
    secondary: "bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:from-pink-600 hover:to-orange-600",
    outline: "border-2 border-indigo-600 text-indigo-600 bg-white hover:bg-indigo-50",
    ghost: "text-indigo-600 bg-transparent hover:bg-indigo-50",
  };

  return (
    <motion.button
      initial={slideVariants[slideFrom]}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 120,
        damping: 15,
      }}
      whileHover={disabled ? {} : { scale: 1.02, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantStyles[variant]}
        ${!disabled && glowColors[glowColor]}
        ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        transition-all duration-300 ease-out
        rounded-2xl
        shadow-lg hover:shadow-xl
        flex items-center justify-center
        active:shadow-md
      `}
    >
      {children}
    </motion.button>
  );
}
