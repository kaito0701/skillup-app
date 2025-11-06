import { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, Clock, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { Badge } from "./ui/badge";
import { AnimatedCard } from "./AnimatedCard";
import { AnimatedButton } from "./AnimatedButton";
import { motion } from "motion/react";
import { generateAIModules, getAssessmentResults, getUserModules, getSessionToken } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface ModuleListScreenProps {
  onNavigate: (screen: string, moduleId?: string) => void;
}

export function ModuleListScreen({ onNavigate }: ModuleListScreenProps) {
  const [modules, setModules] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasAssessment, setHasAssessment] = useState(false);
  const [careerPath, setCareerPath] = useState<string>("");

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    try {
      setIsLoading(true);

      // Check if user is authenticated
      const token = getSessionToken();
      if (!token) {
        console.log("No session token found, user might not be authenticated");
      }

      // Check if user has completed assessment
      try {
        const assessment = await getAssessmentResults();
        if (assessment && assessment.analysis) {
          setHasAssessment(true);
          const topCareer = assessment.analysis.career_paths?.[0]?.title || "";
          setCareerPath(topCareer);
        }
      } catch (assessmentError: any) {
        console.log("No assessment found or error loading:", assessmentError.message);
      }

      // Load user progress (with error handling)
      try {
        const userProgress = await getUserModules();
        setProgress(userProgress || {});
      } catch (progressError: any) {
        console.log("Could not load user progress, using empty progress:", progressError.message);
        setProgress({});
      }

      // Generate AI modules based on assessment
      const aiModules = await generateAIModules(careerPath, hasAssessment);
      setModules(aiModules);
    } catch (error: any) {
      console.error("Failed to load modules:", error);
      
      // Check if it's an auth error
      if (error.message?.includes("Unauthorized")) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to load modules");
      }
      
      // Fallback modules
      setModules([
        {
          id: "module-1",
          title: "Communication Skills",
          description: "Master effective communication for career success",
          category: "Professional Skills",
          duration: "15 min",
          level: "Beginner",
          icon: "BookOpen"
        },
        {
          id: "module-2",
          title: "Digital Literacy",
          description: "Essential computer and internet skills",
          category: "Technology",
          duration: "20 min",
          level: "Beginner",
          icon: "BookOpen"
        },
        {
          id: "module-3",
          title: "Problem Solving",
          description: "Develop critical thinking abilities",
          category: "Professional Skills",
          duration: "18 min",
          level: "Intermediate",
          icon: "BookOpen"
        }
      ]);
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
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading personalized modules...</p>
        </motion.div>
      </div>
    );
  }

  // Group modules by category
  const modulesByCategory = modules.reduce((acc: any, module: any) => {
    const category = module.category || "General";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(module);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 pt-8 pb-20 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => onNavigate("dashboard")}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-white text-2xl">Learning Modules 📚</h1>
            {hasAssessment && careerPath ? (
              <p className="text-indigo-100">Personalized for: {careerPath}</p>
            ) : (
              <p className="text-indigo-100">Quick lessons, big dreams!</p>
            )}
          </div>
        </div>

        {!hasAssessment && (
          <AnimatedCard className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-white text-sm mb-2">
                  Get personalized module recommendations by taking the career assessment!
                </p>
                <AnimatedButton
                  onClick={() => onNavigate("assessment")}
                  variant="secondary"
                  className="bg-white text-indigo-600 hover:bg-indigo-50 h-9 text-sm"
                >
                  Take Assessment
                </AnimatedButton>
              </div>
            </div>
          </AnimatedCard>
        )}
      </div>

      {/* Module Categories */}
      <div className="px-6 -mt-12 pb-24 space-y-6">
        {Object.entries(modulesByCategory).map(([category, categoryModules]: [string, any], catIndex: number) => (
          <motion.div 
            key={catIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.1, duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-gray-900">{category}</h2>
            </div>

            <div className="space-y-3">
              {categoryModules.map((module: any, modIndex: number) => {
                const moduleProgress = progress[module.id];
                const isCompleted = moduleProgress?.completed || false;
                const progressPercentage = moduleProgress?.progress_percentage || 0;

                return (
                  <AnimatedCard
                    key={modIndex}
                    onClick={() => onNavigate("lesson", module.id)}
                    className="bg-white p-4 rounded-2xl shadow-md"
                    slideFrom={modIndex % 2 === 0 ? "left" : "right"}
                    delay={catIndex * 0.1 + modIndex * 0.05}
                    glowColor="amber"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-4">
                        <div className="flex items-start gap-2 mb-2">
                          <h3 className="text-gray-900 flex-1">{module.title}</h3>
                          {isCompleted && (
                            <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                              ✓ Done
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {module.duration}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {module.level}
                          </Badge>
                        </div>
                        
                        {!isCompleted && progressPercentage > 0 && (
                          <div className="mt-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-indigo-600 h-2 rounded-full transition-all" 
                                style={{ width: `${progressPercentage}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{progressPercentage}% complete</p>
                          </div>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </AnimatedCard>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
