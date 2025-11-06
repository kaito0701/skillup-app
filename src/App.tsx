import { useState, useEffect } from "react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { LoginScreen } from "./components/LoginScreen";
import { SignupScreen } from "./components/SignupScreen";
import { DashboardScreen } from "./components/DashboardScreen";
import { CareerAssessmentScreen } from "./components/CareerAssessmentScreen";
import { AssessmentResultsScreen } from "./components/AssessmentResultsScreen";
import { ModuleListScreen } from "./components/ModuleListScreen";
import { LessonScreen } from "./components/LessonScreen";
import { CommunityResourcesScreen } from "./components/CommunityResourcesScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { FeedbackScreen } from "./components/FeedbackScreen";
import { AdminLoginScreen } from "./components/admin/AdminLoginScreen";
import { AdminDashboardScreen } from "./components/admin/AdminDashboardScreen";
import { AdminUsersScreen } from "./components/admin/AdminUsersScreen";
import { AdminAnalyticsScreen } from "./components/admin/AdminAnalyticsScreen";
import { AdminResourcesScreen } from "./components/admin/AdminResourcesScreen";
import { AdminReportsScreen } from "./components/admin/AdminReportsScreen";
import { AdminFeedbackScreen } from "./components/admin/AdminFeedbackScreen";
import { LoadingScreen } from "./components/LoadingScreen";
import { FeedbackButton } from "./components/FeedbackButton";
import { loadLocale, saveLocale, type Locale } from "./utils/locales";
import { Toaster } from "./components/ui/sonner";

type Screen = 
  | "welcome"
  | "login"
  | "signup"
  | "dashboard" 
  | "assessment" 
  | "results" 
  | "modules" 
  | "lesson" 
  | "community" 
  | "profile"
  | "settings"
  | "feedback"
  | "admin-login"
  | "admin-dashboard"
  | "admin-users"
  | "admin-analytics"
  | "admin-resources"
  | "admin-reports"
  | "admin-feedback";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [previousScreen, setPreviousScreen] = useState<Screen>("dashboard");
  const [isLoading, setIsLoading] = useState(false);
  const [nextScreen, setNextScreen] = useState<Screen | null>(null);
  const [nextModuleId, setNextModuleId] = useState<string | undefined>(undefined);
  const [locale, setLocale] = useState<Locale>(() => loadLocale());
  const [sessionChecked, setSessionChecked] = useState(false);
  const [assessmentData, setAssessmentData] = useState<any>(null);

  // Load locale from localStorage on mount
  useEffect(() => {
    const savedLocale = loadLocale();
    setLocale(savedLocale);
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const { verifySession, getSessionToken } = await import("./utils/api");
      const token = getSessionToken();
      
      if (token) {
        const session = await verifySession();
        if (session) {
          // User has valid session, redirect to appropriate dashboard
          if (session.is_admin) {
            setCurrentScreen("admin-dashboard");
          } else {
            setCurrentScreen("dashboard");
          }
        }
      }
    } catch (error) {
      console.log("No valid session found");
    } finally {
      setSessionChecked(true);
    }
  };

  // Save locale whenever it changes
  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    saveLocale(newLocale);
  };

  const handleNavigate = (screen: string, dataOrModuleId?: any) => {
    // Store previous screen before navigating to feedback
    if (screen === "feedback" && !currentScreen.startsWith("admin-")) {
      setPreviousScreen(currentScreen);
    }
    
    // Handle assessment data passing
    if (screen === "results" && dataOrModuleId && typeof dataOrModuleId === 'object') {
      setAssessmentData(dataOrModuleId);
    }
    
    // Handle module ID (backward compatibility)
    const moduleId = typeof dataOrModuleId === 'string' ? dataOrModuleId : undefined;
    
    // Show loading screen when logging in or signing up (going to dashboard or admin-dashboard)
    const isLoggingIn = 
      (currentScreen === "login" && screen === "dashboard") || 
      (currentScreen === "signup" && screen === "dashboard") ||
      (currentScreen === "admin-login" && screen === "admin-dashboard");
    
    if (isLoggingIn) {
      // Store the next screen and module
      setNextScreen(screen as Screen);
      setNextModuleId(moduleId);
      
      // Show loading screen
      setIsLoading(true);
      
      // Random duration between 1-3 seconds (1000-3000ms)
      const loadingDuration = Math.floor(Math.random() * 2000) + 1000;
      
      // Navigate after loading
      setTimeout(() => {
        setCurrentScreen(screen as Screen);
        if (moduleId) {
          setSelectedModule(moduleId);
        }
        setIsLoading(false);
        setNextScreen(null);
        setNextModuleId(undefined);
      }, loadingDuration);
    } else {
      // Navigate immediately without loading screen
      setCurrentScreen(screen as Screen);
      if (moduleId) {
        setSelectedModule(moduleId);
      }
    }
  };

  // Check if current screen is an admin screen
  const isAdminScreen = currentScreen.startsWith("admin-");

  return (
    <div className="size-full flex items-center justify-center bg-gray-100">
      <Toaster />
      {/* Loading Screen Overlay */}
      {isLoading && <LoadingScreen />}
      
      {/* Global Feedback Button - Only show on user screens (not admin, welcome, login, signup, or feedback) */}
      {!isAdminScreen && 
       currentScreen !== 'welcome' && 
       currentScreen !== 'login' && 
       currentScreen !== 'signup' && 
       currentScreen !== 'feedback' && (
        <FeedbackButton onNavigate={handleNavigate} />
      )}
      
      <div className={`relative w-full ${isAdminScreen ? 'max-w-full' : 'max-w-md'} h-full bg-white ${isAdminScreen ? '' : 'shadow-2xl'} overflow-y-auto`}>
        {/* User Screens */}
        {currentScreen === "welcome" && <WelcomeScreen onNavigate={handleNavigate} locale={locale} />}
        {currentScreen === "login" && <LoginScreen onNavigate={handleNavigate} locale={locale} />}
        {currentScreen === "signup" && <SignupScreen onNavigate={handleNavigate} locale={locale} />}
        {currentScreen === "dashboard" && <DashboardScreen onNavigate={handleNavigate} locale={locale} />}
        {currentScreen === "assessment" && <CareerAssessmentScreen onNavigate={handleNavigate} />}
        {currentScreen === "results" && <AssessmentResultsScreen onNavigate={handleNavigate} assessmentData={assessmentData} />}
        {currentScreen === "modules" && <ModuleListScreen onNavigate={handleNavigate} />}
        {currentScreen === "lesson" && <LessonScreen onNavigate={handleNavigate} moduleId={selectedModule} />}
        {currentScreen === "community" && <CommunityResourcesScreen key="community-screen" onNavigate={handleNavigate} />}
        {currentScreen === "profile" && <ProfileScreen onNavigate={handleNavigate} />}
        {currentScreen === "settings" && <SettingsScreen onNavigate={handleNavigate} locale={locale} onLocaleChange={handleLocaleChange} />}
        {currentScreen === "feedback" && <FeedbackScreen onNavigate={handleNavigate} previousScreen={previousScreen} />}
        
        {/* Admin Screens */}
        {currentScreen === "admin-login" && <AdminLoginScreen onNavigate={handleNavigate} />}
        {currentScreen === "admin-dashboard" && <AdminDashboardScreen onNavigate={handleNavigate} />}
        {currentScreen === "admin-users" && <AdminUsersScreen onNavigate={handleNavigate} />}
        {currentScreen === "admin-analytics" && <AdminAnalyticsScreen onNavigate={handleNavigate} />}
        {currentScreen === "admin-resources" && <AdminResourcesScreen onNavigate={handleNavigate} />}
        {currentScreen === "admin-reports" && <AdminReportsScreen onNavigate={handleNavigate} />}
        {currentScreen === "admin-feedback" && <AdminFeedbackScreen onNavigate={handleNavigate} />}
      </div>
    </div>
  );
}
