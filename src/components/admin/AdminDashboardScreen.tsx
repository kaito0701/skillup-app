import { useState, useEffect } from "react";
import { 
  Users, 
  TrendingUp, 
  BookOpen, 
  BarChart3, 
  UserPlus,
  Activity,
  LogOut,
  MessageSquare,
  MapPin,
  ChevronRight
} from "lucide-react";
import { AnimatedCard } from "../AnimatedCard";
import { AnimatedButton } from "../AnimatedButton";
import { motion } from "motion/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getAdminStats, getAnalytics, logout } from "../../utils/api";
import { toast } from "sonner@2.0.3";

interface AdminDashboardScreenProps {
  onNavigate: (screen: string) => void;
}

export function AdminDashboardScreen({ onNavigate }: AdminDashboardScreenProps) {
  const [stats, setStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, analyticsData] = await Promise.all([
        getAdminStats(),
        getAnalytics()
      ]);
      setStats(statsData);
      setAnalytics(analyticsData);
    } catch (error: any) {
      console.error("Load dashboard data error:", error);
      
      // If unauthorized, redirect to admin login
      if (error.message?.includes("Unauthorized") || error.message?.includes("Invalid session") || error.message?.includes("Admin only")) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => onNavigate("admin-login"), 1000);
      } else {
        toast.error("Failed to load dashboard data: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      onNavigate("admin-login");
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
          <p className="text-gray-600">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  const metrics = [
    {
      title: "Total Users",
      value: stats?.total_users?.toString() || "0",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Active Users",
      value: stats?.active_users?.toString() || "0",
      change: "+8.2%",
      trend: "up",
      icon: Activity,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Modules Completed",
      value: stats?.modules_completed?.toString() || "0",
      change: "+23.1%",
      trend: "up",
      icon: BookOpen,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Avg Completion",
      value: `${stats?.avg_completion || "0"}%`,
      change: "+5.3%",
      trend: "up",
      icon: BarChart3,
      color: "from-orange-500 to-orange-600",
    },
  ];

  // Format engagement data for chart
  const engagementData = analytics?.engagement?.map((day: any) => ({
    name: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    users: day.users
  })) || [];
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 pt-8 pb-20 rounded-b-3xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-white text-2xl mb-1">Admin Dashboard</h1>
            <p className="text-indigo-100">SKILL-UP Management</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* New Sign-ups Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-sm">New Sign-ups</p>
              <h3 className="text-white">{stats?.new_signups || 0} this week</h3>
            </div>
          </div>
          <TrendingUp className="w-5 h-5 text-white" />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-12 pb-24">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AnimatedCard className="p-4">
                <div className={`bg-gradient-to-br ${metric.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
                  <metric.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-gray-600 text-sm mb-1">{metric.title}</p>
                <h3 className="text-gray-900 mb-1">{metric.value}</h3>
                <span className="text-emerald-600 text-xs flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {metric.change}
                </span>
              </AnimatedCard>
            </motion.div>
          ))}
        </div>

        {/* Engagement Chart */}
        <AnimatedCard className="p-5 mb-6">
          <h3 className="text-gray-900 mb-4">User Engagement (This Week)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                stroke="#9ca3af"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="#9ca3af"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '14px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#6366f1" 
                strokeWidth={3}
                dot={{ fill: '#6366f1', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </AnimatedCard>

        {/* Quick Actions */}
        <h3 className="text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <AnimatedButton
            onClick={() => onNavigate("admin-users")}
            className="w-full h-16 bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 rounded-2xl flex items-center justify-between px-5"
          >
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-3 rounded-xl">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <span>Manage Users</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </AnimatedButton>

          <AnimatedButton
            onClick={() => onNavigate("admin-analytics")}
            className="w-full h-16 bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 rounded-2xl flex items-center justify-between px-5"
          >
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <span>View Analytics</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </AnimatedButton>

          <AnimatedButton
            onClick={() => onNavigate("admin-resources")}
            className="w-full h-16 bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 rounded-2xl flex items-center justify-between px-5"
          >
            <div className="flex items-center gap-4">
              <div className="bg-emerald-100 p-3 rounded-xl">
                <MapPin className="w-5 h-5 text-emerald-600" />
              </div>
              <span>Manage Resources</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </AnimatedButton>

          <AnimatedButton
            onClick={() => onNavigate("admin-feedback")}
            className="w-full h-16 bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 rounded-2xl flex items-center justify-between px-5"
          >
            <div className="flex items-center gap-4">
              <div className="bg-pink-100 p-3 rounded-xl">
                <MessageSquare className="w-5 h-5 text-pink-600" />
              </div>
              <span>User Feedback</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
}
