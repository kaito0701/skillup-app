import { useState } from "react";
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, GraduationCap } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { FeedbackFooterLink } from "./FeedbackFooterLink";
import { AnimatedButton } from "./AnimatedButton";
import { motion } from "motion/react";
import { getLocaleStrings, type Locale } from "../utils/locales";
import { signUp } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface SignupScreenProps {
  onNavigate: (screen: string) => void;
  locale: Locale;
}

export function SignupScreen({ onNavigate, locale }: SignupScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const t = getLocaleStrings(locale);

  const handleSignup = async () => {
    // Validation
    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    
    if (!password) {
      toast.error("Please enter a password");
      return;
    }
    
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (!termsAccepted) {
      toast.error("Please accept the Terms & Conditions");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp(fullName.trim(), email.trim(), password);
      
      if (result.success) {
        toast.success("Account created successfully!");
        // Navigate to loading screen, then dashboard
        onNavigate("dashboard");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account. Please try again.");
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
            <h1 className="text-white text-2xl">Create Account</h1>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-6 py-8 pb-12">
        <div className="mb-6">
          <h2 className="text-gray-900 mb-2">Join SKILL-UP Today! 🎉</h2>
          <p className="text-gray-600">
            Start your journey to success — it's free and easy!
          </p>
        </div>

        <div className="space-y-5">
          {/* Full Name Field */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-gray-700">
              Full Name
            </Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="w-5 h-5" />
              </div>
              <Input
                id="fullName"
                type="text"
                placeholder="Juan Dela Cruz"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-12 h-14 rounded-xl border-2 border-gray-200 focus:border-indigo-500"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
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
                placeholder="juan.delacruz@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 h-14 rounded-xl border-2 border-gray-200 focus:border-indigo-500"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
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
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 pr-12 h-14 rounded-xl border-2 border-gray-200 focus:border-indigo-500"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Must be at least 8 characters with letters and numbers
            </p>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-700">
              Confirm Password
            </Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-12 pr-12 h-14 rounded-xl border-2 border-gray-200 focus:border-indigo-500"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start gap-3 bg-indigo-50 p-4 rounded-xl border border-indigo-200">
            <Checkbox 
              id="terms" 
              className="mt-1" 
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              disabled={isLoading}
            />
            <Label
              htmlFor="terms"
              className="text-sm text-gray-700 cursor-pointer leading-relaxed"
            >
              I agree to the{" "}
              <button type="button" className="text-indigo-600 hover:text-indigo-700" disabled={isLoading}>
                Terms & Conditions
              </button>{" "}
              and{" "}
              <button type="button" className="text-indigo-600 hover:text-indigo-700" disabled={isLoading}>
                Privacy Policy
              </button>
            </Label>
          </div>

          {/* Sign Up Button */}
          <AnimatedButton
            onClick={handleSignup}
            className="w-full h-14 mt-6"
            variant="primary"
            slideFrom="bottom"
            delay={0.4}
            glowColor="pink"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </AnimatedButton>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-gray-500">Or sign up with</span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => onNavigate("login")}
                className="text-indigo-600 hover:text-indigo-700"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
