import { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { AnimatedButton } from "./AnimatedButton";
import { AnimatedCard } from "./AnimatedCard";
import { Progress } from "./ui/progress";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { generateAIAssessment, analyzeAssessmentWithAI } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface CareerAssessmentScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function CareerAssessmentScreen({ onNavigate }: CareerAssessmentScreenProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [responses, setResponses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadAssessment();
  }, []);

  const loadAssessment = async () => {
    try {
      setIsLoading(true);
      const aiQuestions = await generateAIAssessment();
      setQuestions(aiQuestions);
    } catch (error: any) {
      console.error("Failed to load assessment:", error);
      toast.error("Failed to load assessment. Please try again.");
      // Fallback to hardcoded questions
      setQuestions([
        {
          id: 1,
          question: "What do you enjoy doing most in your free time?",
          options: {
            A: "Helping people solve their problems",
            B: "Working with computers and technology",
            C: "Creating art or designing things",
            D: "Organizing and planning events"
          }
        },
        {
          id: 2,
          question: "Which skill do you think is your strongest?",
          options: {
            A: "Communication and teamwork",
            B: "Logical thinking and problem-solving",
            C: "Creativity and innovation",
            D: "Leadership and management"
          }
        },
        {
          id: 3,
          question: "What type of work environment appeals to you?",
          options: {
            A: "Working directly with people",
            B: "Tech-focused office or remote work",
            C: "Creative studio or flexible space",
            D: "Corporate or structured environment"
          }
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleNext = () => {
    if (selectedAnswer) {
      const newResponse = {
        question_id: questions[currentQuestion].id,
        question: questions[currentQuestion].question,
        answer: selectedAnswer,
        answer_text: questions[currentQuestion].options[selectedAnswer]
      };
      
      const newResponses = [...responses, newResponse];
      setResponses(newResponses);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer("");
      } else {
        // Submit and analyze
        analyzeResults(newResponses);
      }
    }
  };

  const analyzeResults = async (allResponses: any[]) => {
    try {
      setIsAnalyzing(true);
      const analysis = await analyzeAssessmentWithAI(allResponses);
      
      // Navigate to results with analysis data
      onNavigate("results", {
        responses: allResponses,
        analysis: analysis
      });
    } catch (error: any) {
      console.error("Failed to analyze assessment:", error);
      toast.error("Failed to analyze results. Please try again.");
      setIsAnalyzing(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setResponses(responses.slice(0, -1));
      const prevResponse = responses[responses.length - 1];
      setSelectedAnswer(prevResponse?.answer || "");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Generating your personalized assessment...</p>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
        <AnimatedCard className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl text-center max-w-md">
          <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-6" />
          <h2 className="text-gray-900 mb-3">Analyzing Your Responses</h2>
          <p className="text-gray-600">
            Our AI is analyzing your answers to provide personalized career recommendations...
          </p>
        </AnimatedCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 pt-8 pb-20 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => onNavigate("dashboard")}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-white text-2xl">Career Discovery Quiz 🎯</h1>
            <p className="text-indigo-100">AI-powered personalized assessment</p>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white/20 rounded-full p-1">
          <div className="bg-white rounded-full p-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-700">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm text-indigo-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="px-6 -mt-12 pb-24">
        <AnimatedCard className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-gray-900 mb-6">
            {questions[currentQuestion]?.question}
          </h2>

          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3">
            {Object.entries(questions[currentQuestion]?.options || {}).map(([key, value]) => (
              <div
                key={key}
                className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedAnswer === key
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-300"
                }`}
                onClick={() => setSelectedAnswer(key)}
              >
                <RadioGroupItem value={key} id={`option-${key}`} />
                <Label
                  htmlFor={`option-${key}`}
                  className="flex-1 cursor-pointer text-gray-800"
                >
                  {key}) {value as string}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex gap-3 mt-8">
            {currentQuestion > 0 && (
              <AnimatedButton
                onClick={handlePrevious}
                variant="outline"
                className="flex-1 h-12"
              >
                Previous
              </AnimatedButton>
            )}
            <AnimatedButton
              onClick={handleNext}
              disabled={!selectedAnswer}
              className="flex-1 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white disabled:opacity-50"
              glowColor="amber"
            >
              {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
            </AnimatedButton>
          </div>
        </AnimatedCard>

        {/* Tips Card */}
        <AnimatedCard className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl mt-4">
          <p className="text-sm text-gray-700 text-center">
            💡 <strong>Tip:</strong> Answer honestly to get the most accurate career recommendations!
          </p>
        </AnimatedCard>
      </div>
    </div>
  );
}
