import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, Sparkles, ArrowRight, BookOpen, Target, Lightbulb } from "lucide-react";
import { AnimatedButton } from "./AnimatedButton";
import { AnimatedCard } from "./AnimatedCard";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import { getAssessmentResults } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface AssessmentResultsScreenProps {
  onNavigate: (screen: string) => void;
  assessmentData?: any;
}

export function AssessmentResultsScreen({ onNavigate, assessmentData }: AssessmentResultsScreenProps) {
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setIsLoading(true);
      
      // If we have fresh data from assessment, use it
      if (assessmentData?.analysis) {
        setResults(assessmentData);
      } else {
        // Otherwise, load from database
        const savedAssessment = await getAssessmentResults();
        if (savedAssessment) {
          setResults(savedAssessment);
        } else {
          toast.error("No assessment found. Please take the assessment first.");
          onNavigate("dashboard");
        }
      }
    } catch (error: any) {
      console.error("Failed to load results:", error);
      toast.error("Failed to load results. Please try again.");
      onNavigate("dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  const analysis = results?.analysis;

  if (!analysis) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <AnimatedCard className="bg-white p-6 rounded-2xl shadow-lg text-center">
          <p className="text-gray-600">No assessment results found.</p>
          <AnimatedButton
            onClick={() => onNavigate("assessment")}
            className="mt-4"
          >
            Take Assessment
          </AnimatedButton>
        </AnimatedCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 pt-8 pb-20 rounded-b-3xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate("dashboard")}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-white text-2xl">Your Results 🎉</h1>
            <p className="text-indigo-100">AI-powered career insights</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-12 pb-8">
        {/* Success Message */}
        <AnimatedCard className="bg-white p-6 rounded-2xl shadow-lg mb-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-gray-900 mb-2">Assessment Complete!</h2>
            <p className="text-gray-600">
              Based on your responses, our AI has identified careers that match your interests and strengths.
            </p>
          </div>
        </AnimatedCard>

        {/* Career Recommendations */}
        <h3 className="text-gray-800 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          Recommended Career Paths
        </h3>
        <div className="space-y-4 mb-6">
          {analysis.career_paths?.map((career: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AnimatedCard className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className={`bg-gradient-to-r ${
                  index === 0 ? 'from-blue-500 to-blue-600' :
                  index === 1 ? 'from-purple-500 to-purple-600' :
                  'from-emerald-500 to-emerald-600'
                } px-5 py-3 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-5 h-5 text-white" />
                      <span className="text-white">{career.match_percentage}% match</span>
                    </div>
                  </div>
                  {index === 0 && (
                    <Badge className="bg-yellow-400 text-yellow-900">
                      Top Match
                    </Badge>
                  )}
                </div>
                <div className="p-5">
                  <h4 className="text-gray-900 mb-2">{career.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{career.description}</p>
                  <AnimatedButton
                    onClick={() => onNavigate("modules")}
                    variant="outline"
                    className="w-full"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Explore Learning Path
                  </AnimatedButton>
                </div>
              </AnimatedCard>
            </motion.div>
          ))}
        </div>

        {/* Your Strengths */}
        <h3 className="text-gray-800 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          Your Key Strengths
        </h3>
        <AnimatedCard className="bg-gradient-to-br from-yellow-50 to-orange-50 p-5 rounded-2xl shadow-md mb-6">
          <div className="flex flex-wrap gap-2">
            {analysis.strengths?.map((strength: string, index: number) => (
              <Badge
                key={index}
                className="bg-white text-gray-700 rounded-full px-4 py-2"
              >
                ✨ {strength}
              </Badge>
            ))}
          </div>
        </AnimatedCard>

        {/* Areas for Development */}
        {analysis.development_areas && analysis.development_areas.length > 0 && (
          <>
            <h3 className="text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Growth Opportunities
            </h3>
            <AnimatedCard className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-2xl shadow-md mb-6">
              <ul className="space-y-2">
                {analysis.development_areas.map((area: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-indigo-600 mt-1">▸</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </AnimatedCard>
          </>
        )}

        {/* Learning Recommendations */}
        <h3 className="text-gray-800 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Recommended Learning Path
        </h3>
        <AnimatedCard className="bg-white p-5 rounded-2xl shadow-md mb-6">
          <ul className="space-y-3">
            {analysis.learning_recommendations?.map((rec: string, index: number) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-sm">
                  {index + 1}
                </div>
                <span className="text-gray-700 flex-1">{rec}</span>
              </li>
            ))}
          </ul>
        </AnimatedCard>

        {/* Action Buttons */}
        <div className="space-y-3">
          <AnimatedButton
            onClick={() => onNavigate("modules")}
            className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
            glowColor="amber"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Start Learning Journey
          </AnimatedButton>
          <AnimatedButton
            onClick={() => onNavigate("assessment")}
            variant="outline"
            className="w-full h-14"
          >
            Retake Assessment
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
}
