import { GraduationCap } from "lucide-react";
import { Button } from "./ui/button";
import { FeedbackFooterLink } from "./FeedbackFooterLink";
import { AnimatedButton } from "./AnimatedButton";
import { motion } from "motion/react";
import { getLocaleStrings, type Locale } from "../utils/locales";

interface WelcomeScreenProps {
  onNavigate: (screen: string) => void;
  locale: Locale;
}

export function WelcomeScreen({ onNavigate, locale }: WelcomeScreenProps) {
  const t = getLocaleStrings(locale);
  
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-6 pb-32">
      <FeedbackFooterLink onNavigate={onNavigate} variant="light" />
      <div className="w-full max-w-md">
        {/* Logo and App Name */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 120 }}
          className="text-center mb-12"
        >
          <motion.div 
            initial={{ y: -30, opacity: 0, rotate: -10 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 150 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl shadow-2xl mb-6"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <GraduationCap className="w-14 h-14 text-indigo-600" />
            </motion.div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-white text-4xl mb-2"
          >
            SKILL-UP
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-indigo-100"
          >
            Your Journey to Success Starts Here
          </motion.p>
        </motion.div>

        {/* Welcome Card */}
        <motion.div 
          initial={{ y: 40, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6, type: "spring", stiffness: 100 }}
          className="bg-white rounded-3xl p-8 shadow-2xl"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center text-gray-800 mb-2"
          >
            {t.hello}! {t.welcome}! 👋
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center text-gray-600 mb-8"
          >
            Learn new skills, discover your dream career, and unlock amazing opportunities — all at your own pace!
          </motion.p>

          <div className="space-y-3">
            <AnimatedButton
              onClick={() => onNavigate("login")}
              className="w-full h-14"
              variant="primary"
              slideFrom="bottom"
              delay={1.0}
              glowColor="indigo"
            >
              Login
            </AnimatedButton>
            <AnimatedButton
              onClick={() => onNavigate("signup")}
              className="w-full h-14"
              variant="outline"
              slideFrom="bottom"
              delay={1.1}
              glowColor="purple"
            >
              Sign Up
            </AnimatedButton>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate("admin-login")}
              className="text-gray-500 hover:text-gray-700 text-sm block w-full transition-colors"
            >
              Admin Portal
            </motion.button>
          </motion.div>
        </motion.div>

        <p className="text-center text-white text-sm mt-8">
          ISS120 FINAL PROJECT
        </p>
      </div>
    </div>
  );
}
