import { useState, useEffect } from "react";
import { ArrowLeft, Award, Trophy, BookOpen, Settings, Home, User, MapPin } from "lucide-react";
import { AnimatedCard } from "./AnimatedCard";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { motion } from "motion/react";
import { getUserProfile } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
}

const badgeDefinitions = [
  { id: "first-steps", name: "First Steps", icon: "🎯", color: "from-blue-500 to-blue-600" },
  { id: "quick-learner", name: "Quick Learner", icon: "⚡", color: "from-yellow-500 to-yellow-600" },
  { id: "social-star", name: "Social Star", icon: "⭐", color: "from-purple-500 to-purple-600" },
  { id: "week-streak", name: "Week Streak", icon: "🔥", color: "from-orange-500 to-orange-600" },
  { id: "top-scorer", name: "Top Scorer", icon: "🏆", color: "from-emerald-500 to-emerald-600" },
  { id: "team-player", name: "Team Player", icon: "🤝", color: "from-pink-500 to-pink-600" },
  { id: "expert", name: "Expert", icon: "💎", color: "from-indigo-500 to-indigo-600" },
  { id: "master", name: "Master", icon: "👑", color: "from-amber-500 to-amber-600" }
];

export function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const userProfile = await getUserProfile();
      setProfile(userProfile);
    } catch (error: any) {
      console.error("Load profile error:", error);
      
      // If unauthorized, redirect to dashboard (which will handle redirect to login)
      if (error.message?.includes("Unauthorized") || error.message?.includes("Invalid session")) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => onNavigate("dashboard"), 1000);
      } else {
        toast.error("Failed to load profile: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Could not load profile</p>
          <button
            onClick={() => onNavigate("dashboard")}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const userInitials = profile?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  const earnedBadges = profile?.badges || [];
  const badges = badgeDefinitions.map(b => ({
    ...b,
    earned: earnedBadges.includes(b.id)
  }));

  const xpProgress = profile?.xp ? ((profile.xp % 500) / 500) * 100 : 0;
  const xpCurrent = profile?.xp ? profile.xp % 500 : 0;
  const xpNeeded = 500 - xpCurrent;
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 pt-8 pb-20 rounded-b-3xl">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => onNavigate("dashboard")}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onNavigate("settings")}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white shadow-lg">
            <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-400 text-white text-2xl">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-white text-2xl mb-1">{profile?.full_name || 'User'}</h1>
          <p className="text-indigo-100 mb-4">{profile?.email || ''}</p>
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-white text-xl">{profile?.modules_completed || 0}</div>
              <div className="text-indigo-100 text-sm">Modules</div>
            </div>
            <div className="w-px h-10 bg-white/30"></div>
            <div className="text-center">
              <div className="text-white text-xl">{earnedBadges.length}</div>
              <div className="text-indigo-100 text-sm">Badges</div>
            </div>
            <div className="w-px h-10 bg-white/30"></div>
            <div className="text-center">
              <div className="text-white text-xl">{profile?.level || 1}</div>
              <div className="text-indigo-100 text-sm">Level</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-12 pb-24">
        {/* XP Progress */}
        <AnimatedCard className="bg-white p-5 rounded-2xl shadow-lg mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 w-12 h-12 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-900">Level {profile?.level || 1}</span>
                <span className="text-sm text-gray-600">{xpCurrent} / 500 XP</span>
              </div>
              <Progress value={xpProgress} className="h-2" />
            </div>
          </div>
          <p className="text-gray-600 text-sm">{xpNeeded > 0 ? `Just ${xpNeeded} XP more to Level ${(profile?.level || 1) + 1} — You're doing great! 🚀` : 'Amazing progress! Keep learning! 🚀'}</p>
        </AnimatedCard>

        {/* Achievements/Badges */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">Your Achievements 🏆</h2>
            <div className="flex items-center gap-1 text-indigo-600">
              <Award className="w-5 h-5" />
              <span className="text-sm">{earnedBadges.length}/{badges.length} Earned</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {badges.map((badge, index) => (
              <div key={index} className="text-center">
                <div
                  className={`bg-gradient-to-br ${badge.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-md ${
                    !badge.earned ? 'opacity-30 grayscale' : ''
                  }`}
                >
                  <span className="text-2xl">{badge.icon}</span>
                </div>
                <p className={`text-xs ${badge.earned ? 'text-gray-700' : 'text-gray-400'}`}>
                  {badge.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Modules/Certificates */}
        <div className="mb-6">
          <h2 className="text-gray-900 mb-4">Completed Modules 📜</h2>
          {profile?.completed_modules && profile.completed_modules.length > 0 ? (
            <div className="space-y-3">
              {profile.completed_modules.map((module: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AnimatedCard className="bg-white p-4 rounded-xl shadow-md">
                    <div className="flex items-start gap-3">
                      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-gray-900 mb-1">{module.module_name || module.module_id.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</h4>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-gray-500 text-sm">
                            {new Date(module.completed_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Award className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    </div>
                  </AnimatedCard>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-2xl">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No completed modules yet</p>
              <p className="text-gray-400 text-sm mt-1">Start learning to earn certificates!</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 z-30">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button
            onClick={() => onNavigate("dashboard")}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-indigo-600"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => onNavigate("modules")}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-indigo-600"
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-xs">Learn</span>
          </button>
          <button
            onClick={() => onNavigate("community")}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-indigo-600"
          >
            <MapPin className="w-6 h-6" />
            <span className="text-xs">Community</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-indigo-600">
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
