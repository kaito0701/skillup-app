import { useState, useEffect } from "react";
import { ArrowLeft, User, Bell, Lock, Globe, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import { AnimatedCard } from "./AnimatedCard";
import { AnimatedButton } from "./AnimatedButton";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { LanguageSelector } from "./LanguageSelector";
import { type Locale } from "../utils/locales";
import { getUserProfile, updateUserProfile, logout } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface SettingsScreenProps {
  onNavigate: (screen: string) => void;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export function SettingsScreen({ onNavigate, locale, onLocaleChange }: SettingsScreenProps) {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Edit profile form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  
  // Change password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userProfile = await getUserProfile();
      setProfile(userProfile);
      setFullName(userProfile.full_name);
      setEmail(userProfile.email);
    } catch (error: any) {
      console.error("Failed to load profile:", error);
      toast.error("Failed to load profile");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setIsLoading(true);
      await updateUserProfile({
        full_name: fullName.trim(),
        email: email.trim(),
      });
      
      toast.success("Profile updated successfully!");
      setShowEditProfile(false);
      loadProfile();
    } catch (error: any) {
      console.error("Update profile error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setIsLoading(true);
      await updateUserProfile({
        current_password: currentPassword,
        new_password: newPassword,
      });
      
      toast.success("Password changed successfully!");
      setShowChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Change password error:", error);
      toast.error(error.message || "Failed to change password");
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 pt-8 pb-20 rounded-b-3xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate("profile")}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-white text-2xl">Settings</h1>
            <p className="text-indigo-100">Manage your preferences</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-12 pb-8">
        {/* Account Section */}
        <div className="mb-6">
          <h3 className="text-gray-800 mb-3">Account</h3>
          <AnimatedCard className="bg-white rounded-2xl shadow-md overflow-hidden">
            <button 
              onClick={() => setShowEditProfile(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 w-10 h-10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-left">
                  <p className="text-gray-900">Edit Profile</p>
                  <p className="text-gray-500 text-sm">Update your personal information</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            
            <div className="border-t border-gray-100"></div>
            
            <button 
              onClick={() => setShowChangePassword(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 w-10 h-10 rounded-full flex items-center justify-center">
                  <Lock className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-left">
                  <p className="text-gray-900">Change Password</p>
                  <p className="text-gray-500 text-sm">Update your password</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </AnimatedCard>
        </div>

        {/* Notifications Section */}
        <div className="mb-6">
          <h3 className="text-gray-800 mb-3">Notifications</h3>
          <AnimatedCard className="bg-white rounded-2xl shadow-md p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 w-10 h-10 rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <Label htmlFor="push-notifications" className="text-gray-900 cursor-pointer">
                    Push Notifications
                  </Label>
                  <p className="text-gray-500 text-sm">Get notified about new modules</p>
                </div>
              </div>
              <Switch id="push-notifications" defaultChecked />
            </div>

            <div className="border-t border-gray-100"></div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <Label htmlFor="email-notifications" className="text-gray-900 cursor-pointer">
                    Email Notifications
                  </Label>
                  <p className="text-gray-500 text-sm">Receive weekly progress updates</p>
                </div>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>

            <div className="border-t border-gray-100"></div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <Label htmlFor="event-reminders" className="text-gray-900 cursor-pointer">
                    Event Reminders
                  </Label>
                  <p className="text-gray-500 text-sm">Alerts for job fairs and training</p>
                </div>
              </div>
              <Switch id="event-reminders" />
            </div>
          </AnimatedCard>
        </div>

        {/* Preferences Section */}
        <div className="mb-6">
          <h3 className="text-gray-800 mb-3">Preferences</h3>
          <AnimatedCard className="bg-white rounded-2xl shadow-md overflow-hidden">
            <LanguageSelector currentLocale={locale} onLocaleChange={onLocaleChange} />
          </AnimatedCard>
        </div>

        {/* Support Section */}
        <div className="mb-6">
          <h3 className="text-gray-800 mb-3">Support</h3>
          <AnimatedCard className="bg-white rounded-2xl shadow-md overflow-hidden">
            <button 
              onClick={() => onNavigate("feedback")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 w-10 h-10 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="text-left">
                  <p className="text-gray-900">Contact Us</p>
                  <p className="text-gray-500 text-sm">Get in touch with our team</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </AnimatedCard>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 hover:bg-red-100 rounded-2xl transition-colors"
        >
          <LogOut className="w-5 h-5 text-red-600" />
          <span className="text-red-600">Log Out</span>
        </button>

        {/* App Version */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">SKILL-UP Version 1.0.0</p>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateProfile} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Juan Dela Cruz"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@example.com"
                className="mt-1"
                required
              />
            </div>
            <div className="flex gap-3 pt-2">
              <AnimatedButton
                type="button"
                onClick={() => setShowEditProfile(false)}
                variant="outline"
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </AnimatedButton>
              <AnimatedButton
                type="submit"
                className="flex-1 bg-indigo-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </AnimatedButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
                required
              />
            </div>
            <div className="flex gap-3 pt-2">
              <AnimatedButton
                type="button"
                onClick={() => {
                  setShowChangePassword(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                variant="outline"
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </AnimatedButton>
              <AnimatedButton
                type="submit"
                className="flex-1 bg-indigo-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Password"}
              </AnimatedButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
