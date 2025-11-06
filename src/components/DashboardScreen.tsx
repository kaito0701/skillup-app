import { useState, useEffect } from "react";
import { Home, User, BookOpen, MapPin, ClipboardList, LogOut } from "lucide-react";
import { Card } from "./ui/card";
import { AnimatedCard } from "./AnimatedCard";
import { motion } from "motion/react";
import { getLocaleStrings, type Locale } from "../utils/locales";
import { getUserProfile, logout } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface DashboardScreenProps {
  onNavigate: (screen: string) => void;
  locale: Locale;
}

export function DashboardScreen({ onNavigate, locale }: DashboardScreenProps) {
  const t = getLocaleStrings(locale);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const userProfile = await getUserProfile();
      console.log("User profile loaded:", userProfile);
      setProfile(userProfile);
    } catch (error: any) {
      console.error("Load profile error:", error);
      
      // If unauthorized, redirect to login
      if (error.message?.includes("Unauthorized") || error.message?.includes("Invalid session")) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => onNavigate("login"), 1000);
      } else {
        toast.error("Failed to load profile: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      onNavigate("welcome");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  const userName = profile?.full_name?.split(' ')[0] || 'User';
  // Calculate XP progress to next level (100 XP per level)
  const currentLevelXP = profile?.xp ? profile.xp % 100 : 0;
  const completionPercentage = (currentLevelXP / 100) * 100;
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 pt-8 pb-24 rounded-b-3xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-white text-2xl">{t.hello}, {userName}! 👋</h1>
            <p className="text-indigo-100">{t.readyToLearn}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Card */}
        <AnimatedCard 
          className="bg-white p-6 rounded-2xl shadow-lg"
          delay={0.1}
          glowColor="indigo"
          hoverLift={false}
        >
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-gray-600">Your Learning Journey 🚀</p>
              <h3 className="text-gray-900">{profile?.modules_completed || 0} modules completed — {profile?.modules_completed > 0 ? 'Great job!' : 'Start learning!'}</h3>
            </div>
            <div className="text-right">
              <p className="text-indigo-600">✨ Level {profile?.level || 1}</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full"
            />
          </div>
        </AnimatedCard>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-12 pb-24">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-gray-800 mb-4"
        >
          {t.quickAccess}
        </motion.h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <AnimatedCard
            onClick={() => onNavigate("assessment")}
            className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg"
            slideFrom="left"
            delay={0.2}
            glowColor="blue"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-3"
            >
              <ClipboardList className="w-6 h-6 text-white" />
            </motion.div>
            <h3 className="text-white mb-1">Career Assessment</h3>
            <p className="text-blue-100 text-sm">Discover your path ✨</p>
          </AnimatedCard>

          <AnimatedCard
            onClick={() => onNavigate("modules")}
            className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl shadow-lg"
            slideFrom="right"
            delay={0.25}
            glowColor="emerald"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.45, type: "spring", stiffness: 200 }}
              className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-3"
            >
              <BookOpen className="w-6 h-6 text-white" />
            </motion.div>
            <h3 className="text-white mb-1">Learn</h3>
            <p className="text-emerald-100 text-sm">Quick & fun lessons 📚</p>
          </AnimatedCard>

          <AnimatedCard
            onClick={() => onNavigate("community")}
            className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl shadow-lg"
            slideFrom="left"
            delay={0.3}
            glowColor="orange"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-3"
            >
              <MapPin className="w-6 h-6 text-white" />
            </motion.div>
            <h3 className="text-white mb-1">Community</h3>
            <p className="text-orange-100 text-sm">Find opportunities 🌟</p>
          </AnimatedCard>

          <AnimatedCard
            onClick={() => onNavigate("profile")}
            className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg"
            slideFrom="right"
            delay={0.35}
            glowColor="purple"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.55, type: "spring", stiffness: 200 }}
              className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-3"
            >
              <User className="w-6 h-6 text-white" />
            </motion.div>
            <h3 className="text-white mb-1">Profile</h3>
            <p className="text-purple-100 text-sm">Your achievements 🏆</p>
          </AnimatedCard>
        </div>

        {/* Continue Learning Section */}
        {profile?.last_accessed_module && !profile.last_accessed_module?.completed && profile.last_accessed_module?.progress_percentage < 100 && (
          <>
            <h2 className="text-gray-800 mb-4">{t.continueLearning}</h2>
            <AnimatedCard 
              onClick={() => {
                const moduleId = profile.last_accessed_module.module_id;
                onNavigate('lesson', moduleId);
              }}
              className="bg-white p-5 rounded-2xl shadow-md mb-4 cursor-pointer"
              glowColor="indigo"
            >
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 w-14 h-14 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-gray-900">
                    {profile.last_accessed_module.module_id
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${profile.last_accessed_module.progress_percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">
                      {profile.last_accessed_module.progress_percentage}%
                    </span>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 z-30 shadow-lg"
      >
        <div className="flex justify-around items-center max-w-md mx-auto">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center gap-1 text-indigo-600"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">{t.home}</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate("modules")}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-indigo-600 transition-colors"
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-xs">{t.learn}</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate("community")}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-indigo-600 transition-colors"
          >
            <MapPin className="w-6 h-6" />
            <span className="text-xs">{t.community}</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate("profile")}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-indigo-600 transition-colors"
          >
            <User className="w-6 h-6" />
            <span className="text-xs">{t.profile}</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
