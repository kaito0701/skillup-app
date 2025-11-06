import { useState } from "react";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, GraduationCap } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { FeedbackFooterLink } from "./FeedbackFooterLink";
import { AnimatedButton } from "./AnimatedButton";
import { motion } from "motion/react";
import { getLocaleStrings, type Locale } from "../utils/locales";
import { login } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface LoginScreenProps {
  onNavigate: (screen: string) => void;
  locale: Locale;
}

export function LoginScreen({ onNavigate, locale }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const t = getLocaleStrings(locale);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email.trim(), password);
      
      if (result.success) {
        toast.success("Welcome back!");
        onNavigate("dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background pb-32">
      <FeedbackFooterLink onNavigate={onNavigate} />
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 pt-8 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate("welcome")}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-white text-2xl">Login</h1>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-6 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-gray-900 mb-2">{t.welcomeBack}! 😊</h2>
          <p className="text-gray-600">
            Let's continue your learning journey
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-5"
        >
          {/* Email Field */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <Label htmlFor="email" className="text-gray-700">
              Email Address
            </Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="pl-12 h-14 rounded-xl border-2 border-gray-200 focus:border-indigo-500 transition-colors"
                disabled={isLoading}
              />
            </div>
          </motion.div>

          {/* Password Field */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <Label htmlFor="password" className="text-gray-700">
              Password
            </Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="pl-12 pr-12 h-14 rounded-xl border-2 border-gray-200 focus:border-indigo-500 transition-colors"
                disabled={isLoading}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Remember Me & Forgot Password */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label
                htmlFor="remember"
                className="text-sm text-gray-600 cursor-pointer"
              >
                Remember me
              </Label>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Forgot Password?
            </motion.button>
          </motion.div>

          {/* Login Button */}
          <AnimatedButton
            onClick={handleLogin}
            className="w-full h-14 mt-6"
            variant="primary"
            slideFrom="bottom"
            delay={0.6}
            glowColor="indigo"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </AnimatedButton>

          {/* Divider */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="relative my-6"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-gray-500">Or continue with</span>
            </div>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-6"
          >
            <p className="text-gray-600">
              Don't have an account?{" "}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => onNavigate("signup")}
                className="text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Sign Up
              </motion.button>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
