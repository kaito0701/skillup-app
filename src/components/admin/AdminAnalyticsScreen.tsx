import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, Clock, Loader2 } from "lucide-react";
import { AnimatedCard } from "../AnimatedCard";
import { motion } from "motion/react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { getAnalytics } from "../../utils/api";
import { toast } from "sonner@2.0.3";

interface AdminAnalyticsScreenProps {
  onNavigate: (screen: string) => void;
}

export function AdminAnalyticsScreen({ onNavigate }: AdminAnalyticsScreenProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (error: any) {
      console.error("Failed to load analytics:", error);
      
      if (error.message?.includes("Unauthorized") || error.message?.includes("Admin only")) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => onNavigate("admin-login"), 1000);
      } else {
        toast.error("Failed to load analytics");
      }
    } finally {
      setIsLoading(false);
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
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </motion.div>
      </div>
    );
  }

  const modulePopularity = analytics?.module_popularity || [];
  const dropOffData = analytics?.drop_off_data || [];
  const completionRate = analytics?.completion_rate || "0";
  const avgTime = analytics?.avg_time || "0";

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 pt-8 pb-20 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => onNavigate("admin-dashboard")}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-white text-2xl">Learning Analytics</h1>
            <p className="text-purple-100">Insights & Performance</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-white" />
              <p className="text-white/80 text-sm">Completion Rate</p>
            </div>
            <h3 className="text-white">{completionRate}%</h3>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-white" />
              <p className="text-white/80 text-sm">Avg Time</p>
            </div>
            <h3 className="text-white">{avgTime} min</h3>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-12">
        {/* Module Popularity */}
        {modulePopularity.length > 0 ? (
          <AnimatedCard className="p-5 mb-6">
            <h3 className="text-gray-900 mb-4">Most Completed Modules</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={modulePopularity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af"
                  tick={{ fontSize: 11 }}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '14px'
                  }}
                />
                <Bar 
                  dataKey="completions" 
                  fill="#8b5cf6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </AnimatedCard>
        ) : (
          <AnimatedCard className="p-5 mb-6 text-center">
            <p className="text-gray-600">No module completion data yet</p>
          </AnimatedCard>
        )}

        {/* Progress Status Distribution */}
        {dropOffData.length > 0 && dropOffData.some((d: any) => d.value > 0) ? (
          <AnimatedCard className="p-5 mb-6">
            <h3 className="text-gray-900 mb-4">Module Progress Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dropOffData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dropOffData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                  }}
                  formatter={(value) => `${value}%`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </AnimatedCard>
        ) : (
          <AnimatedCard className="p-5 mb-6 text-center">
            <p className="text-gray-600">No progress data available yet</p>
          </AnimatedCard>
        )}

        {/* Insights */}
        <AnimatedCard className="p-5">
          <h3 className="text-gray-900 mb-3">Key Insights</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5"></div>
              <p className="text-gray-600 flex-1">
                {modulePopularity.length > 0 
                  ? `"${modulePopularity[0]?.name}" is the most popular module with ${modulePopularity[0]?.completions} completions`
                  : "No modules have been completed yet"}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
              <p className="text-gray-600 flex-1">
                Overall completion rate is {completionRate}%
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5"></div>
              <p className="text-gray-600 flex-1">
                Users spend an average of {avgTime} minutes per module
              </p>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}
