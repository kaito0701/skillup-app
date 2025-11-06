import { useState } from "react";
import { Lock, Mail, Eye, EyeOff, Shield } from "lucide-react";
import { AnimatedButton } from "../AnimatedButton";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { motion } from "motion/react";
import { adminLogin, createAdminAccount } from "../../utils/api";
import { toast } from "sonner@2.0.3";

interface AdminLoginScreenProps {
  onNavigate: (screen: string) => void;
}

export function AdminLoginScreen({ onNavigate }: AdminLoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    setIsLoading(true);

    try {
      const result = await adminLogin(email.trim(), password);
      
      if (result.success) {
        toast.success("Welcome, Admin!");
        onNavigate("admin-dashboard");
      }
    } catch (error: any) {
      console.error("Admin login error:", error);
      
      // If no admin exists, offer to create one
      if (error.message?.includes("Invalid admin credentials")) {
        const createAdmin = window.confirm(
          "No admin account found. Would you like to create the default admin account?\n\n" +
          "Email: admin@skillup.com\n" +
          "Password: admin123"
        );
        
        if (createAdmin) {
          try {
            const seedResult = await createAdminAccount();
            toast.success("Admin account created! You can now log in with admin@skillup.com / admin123");
          } catch (seedError: any) {
            console.error("Create admin error:", seedError);
            toast.error(seedError.message || "Failed to create admin account");
          }
        }
      } else {
        toast.error(error.message || "Invalid admin credentials");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex flex-col">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-white mb-2">Admin Portal</h1>
          <p className="text-white/80">SKILL-UP Management</p>
        </motion.div>
      </div>

      {/* Login Form */}
      <div className="flex-1 bg-white rounded-t-[2rem] px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-gray-700 mb-2 block">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@skillup.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 rounded-2xl border-gray-200 bg-gray-50"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 mb-2 block">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-14 rounded-2xl border-gray-200 bg-gray-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert("Please contact system administrator to reset password")}
              className="text-indigo-600 hover:text-indigo-700"
            >
              Forgot Password?
            </button>

            <AnimatedButton
              type="submit"
              className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In to Admin Portal"}
            </AnimatedButton>
          </form>

          {/* Back to User App */}
          <div className="mt-8 text-center">
            <button
              onClick={() => onNavigate("welcome")}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to User App
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
