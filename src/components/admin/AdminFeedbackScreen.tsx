import { useState, useEffect } from "react";
import { ArrowLeft, Search, MessageSquare, Loader2, CheckCircle } from "lucide-react";
import { AnimatedCard } from "../AnimatedCard";
import { AnimatedButton } from "../AnimatedButton";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { motion } from "motion/react";
import { getAllFeedback, updateFeedbackStatus } from "../../utils/api";
import { toast } from "sonner@2.0.3";

interface AdminFeedbackScreenProps {
  onNavigate: (screen: string) => void;
}

export function AdminFeedbackScreen({ onNavigate }: AdminFeedbackScreenProps) {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "read" | "resolved">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      setIsLoading(true);
      const data = await getAllFeedback();
      setFeedback(data || []);
    } catch (error: any) {
      console.error("Failed to load feedback:", error);
      
      // If unauthorized, redirect to admin login
      if (error.message?.includes("Unauthorized") || error.message?.includes("Admin only")) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => onNavigate("admin-login"), 1000);
      } else {
        toast.error("Failed to load feedback");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (feedbackId: string, newStatus: string) => {
    try {
      await updateFeedbackStatus(feedbackId, newStatus);
      toast.success("Feedback status updated!");
      loadFeedback();
    } catch (error: any) {
      console.error("Update status error:", error);
      toast.error(error.message || "Failed to update status");
    }
  };

  const filteredFeedback = feedback.filter((f) => {
    const matchesSearch =
      f.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.user_email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading feedback...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
            <h1 className="text-white text-2xl">User Feedback</h1>
            <p className="text-purple-100">{filteredFeedback.length} feedback items</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search feedback..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-white rounded-xl border-0"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {["all", "unread", "read", "resolved"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? "bg-white text-purple-600"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback List */}
      <div className="px-6 -mt-12 pb-8">
        <div className="space-y-3">
          {filteredFeedback.length === 0 ? (
            <AnimatedCard className="bg-white p-6 rounded-2xl shadow-md text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">
                {searchQuery ? "No feedback found matching your search." : "No feedback yet."}
              </p>
            </AnimatedCard>
          ) : (
            filteredFeedback.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <AnimatedCard className="bg-white p-4 rounded-2xl shadow-md">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-gray-900">{item.user_name}</h3>
                        <Badge
                          className={`text-xs ${
                            item.status === "unread"
                              ? "bg-blue-100 text-blue-700"
                              : item.status === "read"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{item.user_email}</p>
                      <p className="text-gray-700 mb-2">{item.message}</p>
                      <p className="text-gray-500 text-sm">
                        {new Date(item.timestamp).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {item.status === "unread" && (
                      <AnimatedButton
                        onClick={() => handleUpdateStatus(item.id, "read")}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        Mark as Read
                      </AnimatedButton>
                    )}
                    {item.status !== "resolved" && (
                      <AnimatedButton
                        onClick={() => handleUpdateStatus(item.id, "resolved")}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Mark Resolved
                      </AnimatedButton>
                    )}
                  </div>
                </AnimatedCard>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
