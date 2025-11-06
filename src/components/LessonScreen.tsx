import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, BookOpen, Target, Lightbulb, Award, Loader2 } from "lucide-react";
import { AnimatedButton } from "./AnimatedButton";
import { AnimatedCard } from "./AnimatedCard";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import { generateAILesson, updateModuleProgress } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface LessonScreenProps {
  onNavigate: (screen: string) => void;
  moduleId: string;
}

// Helper function to clean markdown formatting
const cleanMarkdown = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/\*\*\*/g, "") // Remove bold+italic markers
    .replace(/\*\*/g, "")   // Remove bold markers
    .replace(/\*/g, "")     // Remove italic markers
    .replace(/___/g, "")    // Remove underline markers
    .replace(/__/g, "")     // Remove underline markers
    .replace(/_/g, "")      // Remove single underline markers
    .trim();
};

export function LessonScreen({ onNavigate, moduleId }: LessonScreenProps) {
  const [lesson, setLesson] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<"content" | "quiz" | "complete">("content");
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    loadLesson();
  }, [moduleId]);

  // Track when user views content for some time (50% progress)
  useEffect(() => {
    if (currentView === "content" && lesson) {
      const timer = setTimeout(async () => {
        try {
          await updateModuleProgress(moduleId, false, 50, lesson.title);
        } catch (error) {
          console.error("Failed to update progress:", error);
        }
      }, 5000); // Update after 5 seconds of viewing content

      return () => clearTimeout(timer);
    }
  }, [currentView, lesson, moduleId]);

  const loadLesson = async () => {
    try {
      setIsLoading(true);
      
      // Generate AI lesson content
      const moduleTitle = moduleId.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
      const aiLesson = await generateAILesson(moduleTitle, "");
      
      // Store the lesson with title for tracking
      setLesson({ ...aiLesson, title: moduleTitle });
      
      // Track module access (for "Continue Learning" feature)
      try {
        await updateModuleProgress(moduleId, false, 0, moduleTitle);
      } catch (progressError) {
        console.log("Could not track module access (user might not be logged in):", progressError);
        // Don't fail the entire lesson load if progress tracking fails
      }
    } catch (error: any) {
      console.error("Failed to load lesson:", error);
      toast.error("Failed to load lesson content");
      
      // Fallback content
      setLesson({
        objectives: [
          "Understand the fundamental concepts",
          "Apply knowledge in real-world scenarios",
          "Build practical skills"
        ],
        sections: [
          {
            heading: "Introduction",
            content: "Welcome to this learning module. This lesson will help you build essential skills."
          },
          {
            heading: "Key Concepts",
            content: "Understanding these core principles will help you succeed in your learning journey."
          }
        ],
        examples: [
          "Example 1: Practical application in daily work",
          "Example 2: Real-world scenario"
        ],
        key_takeaways: [
          "Key learning point 1",
          "Key learning point 2",
          "Key learning point 3"
        ],
        quiz: [
          {
            question: "What is the main concept covered in this lesson?",
            options: ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
            correct_answer: "A",
            explanation: "This is the correct answer because..."
          }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuiz = async () => {
    // Update progress to 90% when starting quiz
    try {
      await updateModuleProgress(moduleId, false, 90, lesson?.title);
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
    
    setCurrentView("quiz");
    setCurrentQuizQuestion(0);
    setQuizAnswers([]);
    setSelectedAnswer("");
  };

  const handleQuizNext = () => {
    if (selectedAnswer) {
      const newAnswers = [...quizAnswers, selectedAnswer];
      setQuizAnswers(newAnswers);

      if (currentQuizQuestion < lesson.quiz.length - 1) {
        setCurrentQuizQuestion(currentQuizQuestion + 1);
        setSelectedAnswer("");
      } else {
        // Calculate score
        let score = 0;
        lesson.quiz.forEach((q: any, index: number) => {
          if (newAnswers[index] === q.correct_answer) {
            score++;
          }
        });
        setQuizScore(score);
        completeLesson(score, lesson.quiz.length);
      }
    }
  };

  const completeLesson = async (score: number, total: number) => {
    try {
      const percentage = Math.round((score / total) * 100);
      const passed = percentage >= 60;

      if (passed) {
        await updateModuleProgress(moduleId, true, 100, lesson?.title);
        setCurrentView("complete");
        toast.success("Module completed! 🎉");
      } else {
        toast.error("You need 60% to pass. Try again!");
        setCurrentView("content");
      }
    } catch (error: any) {
      console.error("Failed to save progress:", error);
      toast.error("Failed to save progress");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Generating lesson content...</p>
        </div>
      </div>
    );
  }

  // Content View
  if (currentView === "content") {
    return (
      <div className="min-h-screen bg-background pb-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 pt-8 pb-20 rounded-b-3xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate("modules")}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-white text-2xl">Lesson</h1>
              <p className="text-indigo-100">AI-Powered Learning</p>
            </div>
          </div>
        </div>

        <div className="px-6 -mt-12 pb-8 space-y-6">
          {/* Learning Objectives */}
          <AnimatedCard className="bg-white p-5 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-indigo-600" />
              <h2 className="text-gray-900">Learning Objectives</h2>
            </div>
            <ul className="space-y-2">
              {lesson.objectives?.map((obj: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{cleanMarkdown(obj)}</span>
                </li>
              ))}
            </ul>
          </AnimatedCard>

          {/* Content Sections */}
          {lesson.sections?.map((section: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AnimatedCard className="bg-white p-5 rounded-2xl shadow-md">
                <h3 className="text-gray-900 mb-3">{cleanMarkdown(section.heading)}</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{cleanMarkdown(section.content)}</p>
              </AnimatedCard>
            </motion.div>
          ))}

          {/* Examples */}
          {lesson.examples && lesson.examples.length > 0 && (
            <AnimatedCard className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                <h3 className="text-gray-900">Practical Examples</h3>
              </div>
              <ul className="space-y-2">
                {lesson.examples.map((example: string, index: number) => (
                  <li key={index} className="text-gray-700">
                    • {cleanMarkdown(example)}
                  </li>
                ))}
              </ul>
            </AnimatedCard>
          )}

          {/* Key Takeaways */}
          <AnimatedCard className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <h3 className="text-gray-900">Key Takeaways</h3>
            </div>
            <ul className="space-y-2">
              {lesson.key_takeaways?.map((takeaway: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-purple-600">✓</span>
                  <span>{cleanMarkdown(takeaway)}</span>
                </li>
              ))}
            </ul>
          </AnimatedCard>

          {/* Start Quiz Button */}
          <AnimatedButton
            onClick={handleStartQuiz}
            className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
            glowColor="amber"
          >
            <Award className="w-5 h-5 mr-2" />
            Take Quiz to Complete
          </AnimatedButton>
        </div>
      </div>
    );
  }

  // Quiz View
  if (currentView === "quiz") {
    const quizProgress = ((currentQuizQuestion + 1) / lesson.quiz.length) * 100;
    const currentQuestion = lesson.quiz[currentQuizQuestion];

    return (
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 pt-8 pb-20 rounded-b-3xl">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setCurrentView("content")}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-white text-2xl">Quiz 📝</h1>
              <p className="text-indigo-100">Test your knowledge</p>
            </div>
          </div>

          <div className="bg-white/20 rounded-full p-1">
            <div className="bg-white rounded-full p-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-700">
                  Question {currentQuizQuestion + 1} of {lesson.quiz.length}
                </span>
                <span className="text-sm text-indigo-600">{Math.round(quizProgress)}%</span>
              </div>
              <Progress value={quizProgress} className="h-2" />
            </div>
          </div>
        </div>

        <div className="px-6 -mt-12 pb-24">
          <AnimatedCard className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-gray-900 mb-6">{currentQuestion.question}</h2>

            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3">
              {currentQuestion.options.map((option: string, index: number) => {
                const optionLetter = option.charAt(0);
                return (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedAnswer === optionLetter
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                    onClick={() => setSelectedAnswer(optionLetter)}
                  >
                    <RadioGroupItem value={optionLetter} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-gray-800">
                      {option}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>

            <AnimatedButton
              onClick={handleQuizNext}
              disabled={!selectedAnswer}
              className="w-full h-12 mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white disabled:opacity-50"
              glowColor="amber"
            >
              {currentQuizQuestion === lesson.quiz.length - 1 ? "Finish Quiz" : "Next Question"}
            </AnimatedButton>
          </AnimatedCard>
        </div>
      </div>
    );
  }

  // Complete View
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
      <AnimatedCard className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl text-center max-w-md">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Award className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-gray-900 mb-3">Module Completed! 🎉</h2>
        <p className="text-gray-600 mb-2">
          You scored {quizScore} out of {lesson.quiz.length}
        </p>
        <p className="text-gray-500 text-sm mb-6">
          +50 XP earned!
        </p>

        <div className="space-y-3">
          <AnimatedButton
            onClick={() => onNavigate("modules")}
            className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          >
            Continue Learning
          </AnimatedButton>
          <AnimatedButton
            onClick={() => onNavigate("dashboard")}
            variant="outline"
            className="w-full h-12"
          >
            Back to Dashboard
          </AnimatedButton>
        </div>
      </AnimatedCard>
    </div>
  );
}
