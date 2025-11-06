import { useState } from "react";
import { ArrowLeft, Send, Mail, User, MessageSquare } from "lucide-react";
import { AnimatedButton } from "./AnimatedButton";
import { AnimatedCard } from "./AnimatedCard";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { submitFeedback } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface FeedbackScreenProps {
  onNavigate: (screen: string) => void;
  previousScreen?: string;
}

export function FeedbackScreen({ onNavigate, previousScreen = "dashboard" }: FeedbackScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      toast.error("Please write your feedback before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitFeedback(feedback.trim(), 'general');
      
      setSubmitted(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        onNavigate(previousScreen);
      }, 2000);
    } catch (error: any) {
      console.error("Feedback submission error:", error);
      toast.error(error.message || "Failed to submit feedback. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
        <AnimatedCard className="w-full max-w-md bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl text-center">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-gray-900 mb-3">Thank You!</h2>
          <p className="text-gray-600 mb-2">
            Your feedback has been sent to our admin team.
          </p>
          <p className="text-gray-500 text-sm">
            We appreciate your input and will review it shortly.
          </p>
        </AnimatedCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => onNavigate(previousScreen)}
            className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-white text-2xl">Send Feedback</h1>
            <p className="text-indigo-100">Help us improve SKILL-UP</p>
          </div>
        </div>

        {/* Feedback Form */}
        <AnimatedCard className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-2xl">
          <div className="text-center mb-6">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-gray-900 mb-2">We Value Your Feedback</h2>
            <p className="text-gray-600 text-sm">
              Tell us what you think! Your feedback helps us make SKILL-UP better for everyone.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name (Optional) */}
            <div>
              <Label htmlFor="name" className="text-gray-700 mb-2 block">
                Your Name <span className="text-gray-400">(Optional)</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Maria Santos"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-11 h-12 rounded-xl border-gray-300"
                />
              </div>
            </div>

            {/* Email (Optional) */}
            <div>
              <Label htmlFor="email" className="text-gray-700 mb-2 block">
                Your Email <span className="text-gray-400">(Optional)</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="maria@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 rounded-xl border-gray-300"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                We'll only use this if we need to follow up with you
              </p>
            </div>

            {/* Feedback (Required) */}
            <div>
              <Label htmlFor="feedback" className="text-gray-700 mb-2 block">
                Your Feedback <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="feedback"
                placeholder="Tell us what you love, what could be better, or share your ideas..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[150px] rounded-xl border-gray-300 resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {feedback.length} / 500 characters
              </p>
            </div>

            {/* Submit Button */}
            <AnimatedButton
              type="submit"
              disabled={isSubmitting || !feedback.trim()}
              className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Send Feedback
                </span>
              )}
            </AnimatedButton>
          </form>

          <p className="text-center text-gray-500 text-xs mt-4">
            Your feedback will be reviewed by our admin team
          </p>
        </AnimatedCard>
      </div>
    </div>
  );
}
