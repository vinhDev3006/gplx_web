"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { globalQuizLists, globalQuestions } from "@/lib/data" // Adjust import path as needed
import { Button } from "@/components/ui/button" // Adjust import path as needed
import { Card } from "@/components/ui/card" // Adjust import path as needed
import { Progress } from "@/components/ui/progress" // Adjust import path as needed
import { CheckCircle2, XCircle, Save, ArrowLeft, HelpCircle, RotateCcw, Award } from "lucide-react"
import { toast } from "@/components/ui/use-toast" // Adjust import path as needed
import { Toaster } from "@/components/ui/toaster" // Adjust import path as needed

// Mock data structure if not importing - replace with your actual data structure/import
// interface Question { id: number; question: string; choices: string[]; correctAnswer: string; hint?: string; image?: string; }
// interface Quiz { id: number; title: string; questionIds: number[]; enableStorage?: boolean; passPercentage?: number; description?: string; }
// const globalQuizLists: Quiz[] = [{ id: 1, title: "Sample Quiz 1", questionIds: [101, 102, 103], enableStorage: true, passPercentage: 80, description: "A sample quiz to test knowledge." }];
// const globalQuestions: Question[] = [ { id: 101, question: "What is 1 + 1?", choices: ["1", "2", "3", "4"], correctAnswer: "2", hint: "It's more than one.", image: "/path/to/image1.jpg" }, { id: 102, question: "What is the capital of France?", choices: ["Berlin", "Madrid", "Paris", "Rome"], correctAnswer: "Paris" }, { id: 103, question: "Which planet is known as the Red Planet?", choices: ["Earth", "Mars", "Jupiter", "Saturn"], correctAnswer: "Mars", hint: "Think Roman god of war." }];
// End Mock Data

export default function QuizPage({ params }: { params: { sectionId: string; quizId: string } }) {
  const router = useRouter()
  const quizId = Number.parseInt(params.quizId)
  const sectionId = Number.parseInt(params.sectionId)

  // Find the quiz using the quizId
  const quiz = globalQuizLists.find((q) => q.id === quizId)

  // --- State Variables ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [correctAnswers, setCorrectAnswers] = useState<Record<number, boolean>>({})
  const [showHint, setShowHint] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // --- Data Fetching & Processing ---
  const questions = quiz
    ? (quiz.questionIds.map((id) => globalQuestions.find((q) => q.id === id)).filter(Boolean) as typeof globalQuestions)
    : []

  const isStorageEnabled = quiz?.enableStorage === true
  const storageKey = `quiz_progress_${sectionId}_${quizId}`

  // --- Effects ---

  // Load saved progress
  useEffect(() => {
    if (typeof window !== "undefined" && quiz && isStorageEnabled) {
      setIsLoading(true); // Start loading
      try {
        const savedProgress = localStorage.getItem(storageKey)
        if (savedProgress) {
          const { answers, correct, completed, finalScore, lastQuestionIndex } = JSON.parse(savedProgress)

          setSelectedAnswers(answers || {})
          setCorrectAnswers(correct || {})

          if (completed) {
            setQuizCompleted(true)
            setScore(finalScore || 0)
          } else if (lastQuestionIndex !== undefined && lastQuestionIndex < questions.length) {
             // Ensure lastQuestionIndex is valid before setting
            setCurrentQuestionIndex(lastQuestionIndex)
          }
        }
      } catch (error) {
        console.error("Error loading saved progress:", error)
        // Optionally clear corrupted data
        // localStorage.removeItem(storageKey);
      } finally {
          setIsLoading(false) // Finish loading regardless of outcome
      }
    } else {
      setIsLoading(false) // Not loading if storage disabled or no quiz
    }
  // questions.length is added to re-validate index if questions change
  }, [storageKey, quiz, isStorageEnabled, questions.length])

  // Auto-save progress (debounced effect could be even better for performance)
   useEffect(() => {
     // Only save if loading is complete, storage is enabled, and there's something to save potentially
     if (!isLoading && isStorageEnabled) {
       // Avoid saving initial empty state immediately after load unless an action was taken
       const hasMadeProgress = Object.keys(selectedAnswers).length > 0 || quizCompleted;

       if (hasMadeProgress || currentQuestionIndex > 0) { // Save if answers exist, quiz is done, or user moved past first question
         const progressData = {
           answers: selectedAnswers,
           correct: correctAnswers,
           completed: quizCompleted,
           finalScore: score,
           lastQuestionIndex: currentQuestionIndex,
           timestamp: new Date().toISOString(),
         }
         try {
             localStorage.setItem(storageKey, JSON.stringify(progressData));
         } catch (error) {
             console.error("Error auto-saving progress:", error);
             // Maybe notify user if storage quota is exceeded
         }
       }
     }
   }, [selectedAnswers, correctAnswers, quizCompleted, score, currentQuestionIndex, isLoading, storageKey, isStorageEnabled]);


  // Close sidebar on mobile outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("question-sidebar")
      // Check if the click target is outside the sidebar and also not the toggle button
      const toggleButton = document.getElementById("sidebar-toggle-button");
      if (sidebar && !sidebar.contains(event.target as Node) &&
          toggleButton && !toggleButton.contains(event.target as Node) &&
          window.innerWidth < 768 && sidebarOpen) { // Only close if open
        setSidebarOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [sidebarOpen]) // Depend on sidebarOpen

  // Confetti effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizCompleted && score >= (quiz?.passPercentage ?? 80)) { // Use pass percentage or default
      setShowConfetti(true)
      timer = setTimeout(() => {
        setShowConfetti(false)
      }, 6000) // Slightly longer duration
    }
    return () => clearTimeout(timer)
  }, [quizCompleted, score, quiz?.passPercentage])


  // --- Event Handlers ---

  const saveProgress = () => {
    if (typeof window !== "undefined" && isStorageEnabled) {
      try {
        const progressData = {
          answers: selectedAnswers,
          correct: correctAnswers,
          completed: quizCompleted,
          finalScore: score,
          lastQuestionIndex: currentQuestionIndex,
          timestamp: new Date().toISOString(),
        }
        localStorage.setItem(storageKey, JSON.stringify(progressData))
        toast({
          title: "Progress Saved",
          description: "Your quiz progress has been saved.",
          duration: 2000,
        })
      } catch (error) {
        console.error("Error saving progress manually:", error)
        toast({
          title: "Error Saving Progress",
          description: "Could not save your progress. Local storage might be full.",
          variant: "destructive",
          duration: 3000,
        })
      }
    }
  }

  const clearProgress = () => {
    if (typeof window !== "undefined" && isStorageEnabled) {
      try {
        localStorage.removeItem(storageKey)
        toast({
          title: "Progress Cleared",
          description: "Your saved progress has been cleared.",
          duration: 2000,
        })
      } catch (error) {
        console.error("Error clearing progress:", error)
         toast({
          title: "Error Clearing Progress",
          description: "Could not clear saved progress.",
          variant: "destructive",
          duration: 3000,
        })
      }
    }
  }

  const handleAnswerSelect = (questionId: number, answer: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    const isCorrect = answer === question.correctAnswer

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))

    setCorrectAnswers((prev) => ({
      ...prev,
      [questionId]: isCorrect,
    }))

    // Optional: Automatically move to next question after selecting an answer
    // if (currentQuestionIndex < questions.length - 1) {
    //   setTimeout(() => { // Add a small delay to see feedback
    //       setCurrentQuestionIndex(currentQuestionIndex + 1);
    //       setShowHint(false);
    //   }, 300);
    // } else {
       // Maybe show a "Finish" prompt if it's the last question
    // }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowHint(false)
    } else {
      // Calculate final score
      let correctCount = 0
      questions.forEach((question) => {
        if (correctAnswers[question.id]) {
          correctCount++
        }
      })
      const finalScore = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
      setScore(finalScore)
      setQuizCompleted(true)
      // Save final state
       if (isStorageEnabled) {
          const progressData = {
            answers: selectedAnswers,
            correct: correctAnswers,
            completed: true, // Mark as completed
            finalScore: finalScore,
            lastQuestionIndex: currentQuestionIndex, // Keep last index for review maybe?
            timestamp: new Date().toISOString(),
          };
          localStorage.setItem(storageKey, JSON.stringify(progressData));
       }
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setShowHint(false)
    }
  }

  const handleRestartQuiz = () => {
     if (isStorageEnabled) {
       clearProgress(); // Clear storage first
     }
     setCurrentQuestionIndex(0)
     setSelectedAnswers({})
     setCorrectAnswers({})
     setShowHint(false)
     setQuizCompleted(false)
     setScore(0)
     setShowConfetti(false)
     // No need to manually clear state if relying on reload or if clearProgress handles it
  }

  const handleGoToQuestion = (index: number) => {
      if (index >= 0 && index < questions.length) {
          setCurrentQuestionIndex(index);
          setShowHint(false);
          if (window.innerWidth < 768) { // Close sidebar on mobile after selection
              setSidebarOpen(false);
          }
      }
  }

  // --- Helper Functions ---
  const getQuestionStatusClass = (index: number): string => {
    const question = questions[index]
    if (!question) return "bg-gray-200 border-gray-300 cursor-not-allowed"; // Should not happen

    const questionId = question.id;
    const isAnswered = selectedAnswers.hasOwnProperty(questionId);
    const isCorrect = correctAnswers[questionId]; // Will be true, false, or undefined

    if (index === currentQuestionIndex) {
      return "bg-blue-600 text-white border-blue-700 ring-2 ring-offset-1 ring-blue-500" // Highlight current
    } else if (isAnswered) {
        if (isCorrect) {
            return "bg-green-100 text-green-800 border-green-500 hover:bg-green-200" // Correctly answered
        } else {
            return "bg-red-100 text-red-800 border-red-500 hover:bg-red-200" // Incorrectly answered
        }
    } else {
        return "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400" // Not yet answered
    }
  }

  // --- Render Logic ---

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading Quiz...</p>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12">
        <div className="container mx-auto px-4 text-center">
          <Card className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto border-red-200 border">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Quiz Not Found</h1>
            <p className="text-gray-600 mb-6">The quiz you are looking for does not exist or may have been removed.</p>
            <Link href={`/`}> {/* Link to a safe fallback, maybe homepage */}
              <Button className="w-full">Go Back</Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  if (questions.length === 0 && !isLoading) {
     return (
       <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white py-12">
         <div className="container mx-auto px-4 text-center">
           <Card className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto border-yellow-200 border">
             <HelpCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
             <h1 className="text-2xl font-bold mb-4 text-gray-800">No Questions Available</h1>
             <p className="text-gray-600 mb-6">This quiz currently has no questions assigned to it.</p>
             <Link href={`/section/${sectionId}`}>
               <Button className="w-full" variant="outline">Back to Section</Button>
             </Link>
           </Card>
         </div>
       </div>
     )
   }

  const currentQuestion = questions[currentQuestionIndex];

   // This check should ideally happen *after* loading and quiz/question validation
   if (!currentQuestion && !quizCompleted && !isLoading) {
       // This state might occur if loaded index is out of bounds after questions changed
       console.warn("Current question index out of bounds, resetting.");
       setCurrentQuestionIndex(0); // Reset to first question
       // Re-render will happen, show loading briefly or handle gracefully
        return (
          <div className="flex justify-center items-center min-h-screen bg-white">
              <p className="text-lg text-gray-600">Adjusting question...</p>
          </div>
       );
   }

  // --- Completed Quiz Screen ---
  if (quizCompleted) {
    const passPercentage = quiz.passPercentage ?? 80; // Default pass mark if not set
    const passed = score >= passPercentage;
    const correctCount = Object.values(correctAnswers).filter((value) => value === true).length

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 flex items-center justify-center">
        <Toaster />
        {/* Conditionally render confetti */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {/* Simple Confetti - replace with a library like 'react-confetti' for better effects if needed */}
            {[...Array(60)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-fall"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-${Math.random() * 20 + 10}%`, // Start slightly higher
                  width: `${Math.random() * 8 + 4}px`, // Size variation
                  height: `${Math.random() * 8 + 4}px`,
                  backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"][Math.floor(Math.random() * 5)],
                  animationDuration: `${3 + Math.random() * 3}s`, // Duration variation
                  animationDelay: `${Math.random() * 2}s`, // Delay variation
                  opacity: Math.random() * 0.5 + 0.5, // Opacity variation
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              ></div>
            ))}
             <style jsx>{`
              @keyframes fall {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(120vh) rotate(720deg); opacity: 0; }
              }
              .animate-fall {
                animation: fall linear forwards;
              }
            `}</style>
          </div>
        )}
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="p-8 md:p-12 shadow-xl rounded-xl border-t-4 border-blue-500">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-8 ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
                {passed ? (
                  <Award className="h-12 w-12 text-green-600" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-600" />
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Quiz Complete!</h1>
              <div className="mb-8">
                <p className="text-lg text-gray-600 mb-2">Your Score:</p>
                <div className="text-6xl font-bold mb-4 text-blue-600">{score}%</div>
                <p className="text-base text-gray-500">
                  You answered {correctCount} out of {questions.length} questions correctly.
                </p>
              </div>

              {/* Pass/Fail Section */}
              <div className={`mb-8 p-4 rounded-lg inline-block ${passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className={`text-2xl font-semibold ${passed ? "text-green-700" : "text-red-700"}`}>
                  {passed ? "PASSED" : "FAILED"}
                </div>
                {quiz.passPercentage && (
                  <p className="text-sm text-gray-600 mt-1">Passing score: {quiz.passPercentage}%</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                <Button onClick={handleRestartQuiz} size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <RotateCcw className="mr-2 h-5 w-5" /> Retry Quiz
                </Button>
                <Link href={`/section/${sectionId}`}>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <ArrowLeft className="mr-2 h-5 w-5" /> Back to Section
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }


  // --- Active Quiz Screen ---
  const answeredQuestionsCount = Object.keys(selectedAnswers).length
  const progressPercentage = questions.length > 0 ? Math.round((answeredQuestionsCount / questions.length) * 100) : 0;

  return (
    <div className="bg-gradient-to-b from-blue-50 via-white to-white min-h-screen"> {/* Subtle gradient */}
      <Toaster />
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
          {/* Optional: Adjust spacing mb-6 or mb-8 */}
          <div className="mb-6 md:mb-8">
            {/* Back Link */}
            <Link
              href={`/section/${sectionId}`}
              className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center font-medium group"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Exit Quiz
            </Link>

            {/* Header Row: Title and Save Button */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{quiz.title}</h1>
                  {quiz.description && <p className="text-sm text-gray-500 mt-1">{quiz.description}</p>}
              </div>
              {isStorageEnabled && (
                <Button variant="outline" size="sm" onClick={saveProgress} className="flex items-center gap-1.5">
                  <Save className="h-4 w-4" />
                  <span>Save Progress</span>
                </Button>
              )}
            </div>

            {/* Progress Info & Bar */}
             {/* Optional: Adjust spacing mt-4 or mt-6 */}
            <div className="bg-white p-3 rounded-lg shadow-sm mb-2">
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div>
                        Question <span className="font-bold text-blue-700">{currentQuestionIndex + 1}</span> of <span className="font-bold text-gray-800">{questions.length}</span>
                    </div>
                    <div className="font-medium">
                        {answeredQuestionsCount} / {questions.length} Answered ({progressPercentage}%)
                    </div>
                </div>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

        {/* Mobile question navigation toggle */}
        <div className="md:hidden mb-4">
          <Button
            id="sidebar-toggle-button"
            variant="outline"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2"
            aria-expanded={sidebarOpen}
            aria-controls="question-sidebar"
          >
            {sidebarOpen ? "Hide Navigation" : "Show Question Navigation"}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${sidebarOpen ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
          </Button>
        </div>

        {/* Main Layout: Question Content & Sidebar */}
         {/* Optional: Adjust gap-6 or gap-8 */}
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
          {/* --- Main quiz content --- */}
          <div className="flex-grow order-2 md:order-1 w-full">
            {/* Use key to force re-render on question change, helps with animations/state reset if needed */}
            <Card key={currentQuestion.id} className="p-6 md:p-8 shadow-lg border-0 rounded-xl bg-white">
               {/* Optional: Adjust mb-6 or mb-8 */}
              <div className="mb-6">
                {/* Question Text */}
                <h2 className="text-xl lg:text-2xl font-semibold mb-5 text-gray-900">{currentQuestion.question}</h2>

                {/* Question Image */}
                {currentQuestion.image && (
                  <div className="mb-6 relative w-full rounded-lg overflow-hidden border bg-gray-50 aspect-video"> {/* Aspect ratio */}
                    <Image
                      // Basic error handling for image src
                      src={currentQuestion.image.replace(/\[|\]/g, "") || "/placeholder.svg"}
                      alt={`Illustration for question ${currentQuestionIndex + 1}`}
                      fill
                      className="object-contain" // Use contain to show whole image
                      onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} // Fallback image
                      priority={true} // Prioritize loading image for current question
                    />
                  </div>
                )}

                {/* Answer Choices */}
                <div className="space-y-3 mt-6">
                  {currentQuestion.choices.map((choice, index) => {
                    const questionId = currentQuestion.id;
                    const isSelected = selectedAnswers[questionId] === choice;
                    const isCorrect = choice === currentQuestion.correctAnswer;
                    const hasBeenAnswered = selectedAnswers.hasOwnProperty(questionId);

                    let choiceBg = 'bg-white hover:bg-gray-100';
                    let choiceBorder = 'border-gray-300 hover:border-blue-400';
                    let choiceText = 'text-gray-800';
                    let radioBorder = 'border-gray-400';
                    let showFeedbackIcon = false;

                    if (isSelected) {
                      radioBorder = isCorrect ? 'border-green-600' : 'border-red-600';
                      choiceBorder = isCorrect ? 'border-green-500 ring-1 ring-green-300' : 'border-red-500 ring-1 ring-red-300';
                      choiceBg = isCorrect ? 'bg-green-50 hover:bg-green-100' : 'bg-red-50 hover:bg-red-100';
                      choiceText = isCorrect ? 'text-green-900 font-medium' : 'text-red-900 font-medium';
                      showFeedbackIcon = true;
                    } else if (hasBeenAnswered && isCorrect) {
                       // Optionally highlight correct answer if wrong one was selected
                       // choiceBorder = 'border-green-400';
                       // choiceBg = 'bg-green-50/60';
                    }

                    return (
                      <div
                        key={index}
                        onClick={() => handleAnswerSelect(questionId, choice)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-150 ease-in-out ${choiceBorder} ${choiceBg}`}
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0} // Make it focusable
                         onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleAnswerSelect(questionId, choice); }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center flex-grow mr-4">
                            {/* Custom Radio Button Visual */}
                            <div className={`flex-shrink-0 h-5 w-5 rounded-full border-2 mr-3 flex items-center justify-center ${radioBorder}`}>
                              {isSelected && <div className={`h-2.5 w-2.5 rounded-full ${isCorrect ? 'bg-green-600' : 'bg-red-600'}`}></div>}
                            </div>
                            <span className={`text-base md:text-lg ${choiceText}`}>{choice}</span>
                          </div>
                          {/* Feedback Icon - shown only for the selected answer */}
                          {showFeedbackIcon && (
                            <div className="ml-2 flex-shrink-0">
                              {isCorrect ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-600" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Hint Section */}
              {currentQuestion.hint && (
                <div className="mb-6 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => setShowHint(!showHint)}
                    size="sm"
                    className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800"
                    aria-expanded={showHint}
                  >
                    <HelpCircle className="h-4 w-4" />
                    {showHint ? "Hide Hint" : "Show Hint"}
                  </Button>

                  {showHint && (
                    <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800 animate-fade-in">
                      <span className="font-semibold">Hint:</span> {currentQuestion.hint}
                    </div>
                  )}
                   {/* Add simple fade-in animation */}
                   <style jsx>{`
                      @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
                      .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
                   `}</style>
                </div>
              )}

              {/* Navigation Buttons */}
               {/* Optional: Adjust mt-4 or mt-8 */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <Button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  variant="outline"
                  className="flex items-center gap-1 disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                  Previous
                </Button>

                <Button onClick={handleNextQuestion} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 px-6">
                  {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next"}
                   {currentQuestionIndex < questions.length - 1 && ( // Only show arrow if not last question
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                   )}
                </Button>
              </div>
            </Card>
          </div> {/* End Main Content Column */}

          {/* --- Question index sidebar --- */}
          <div
            id="question-sidebar"
            // Apply transition classes for smooth hide/show on mobile
            className={`w-full md:w-72 lg:w-80 order-1 md:order-2 flex-shrink-0 ${
              sidebarOpen ? "block animate-slide-down" : "hidden md:block"
            } transition-all duration-300 ease-in-out`}
          >
            <Card className="p-4 sticky top-4 shadow-lg border-0 rounded-xl bg-white">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                <h3 className="font-semibold text-base text-gray-800">Question Navigation</h3>
                <div className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                   {answeredQuestionsCount}/{questions.length}
                </div>
              </div>
              {/* Adjust grid columns for different screen sizes if needed */}
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-[55vh] md:max-h-[60vh] overflow-y-auto p-1 custom-scrollbar">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleGoToQuestion(index)}
                    // Use computed classes for status styling
                    className={`h-10 w-10 rounded-md text-sm font-medium flex items-center justify-center border transition-colors duration-150 ${getQuestionStatusClass(index)}`}
                    title={`Go to Question ${index + 1}`}
                    aria-label={`Question ${index + 1}`}
                    aria-current={index === currentQuestionIndex ? "step" : undefined}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

                {/* Legend */}
                <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600 space-y-1.5 bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2 text-sm">Legend:</h4>
                    <div className="flex items-center"> <div className="w-3.5 h-3.5 rounded-full bg-blue-600 border border-blue-700 mr-2 flex-shrink-0"></div> <span>Current Question</span> </div>
                    <div className="flex items-center"> <div className="w-3.5 h-3.5 rounded-md bg-green-100 border border-green-500 mr-2 flex-shrink-0"></div> <span>Answered Correctly</span> </div>
                    <div className="flex items-center"> <div className="w-3.5 h-3.5 rounded-md bg-red-100 border border-red-500 mr-2 flex-shrink-0"></div> <span>Answered Incorrectly</span> </div>
                    <div className="flex items-center"> <div className="w-3.5 h-3.5 rounded-md bg-white border border-gray-300 mr-2 flex-shrink-0"></div> <span>Not Answered</span> </div>
                </div>

              {/* Reset Button */}
              {isStorageEnabled && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-400 flex items-center justify-center gap-1.5"
                    onClick={handleRestartQuiz}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset Progress
                  </Button>
                </div>
              )}
            </Card>
             {/* Add styles for custom scrollbar and mobile animation */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #bbb; }

                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-down { animation: slideDown 0.3s ease-out forwards; }

                 @media (min-width: 768px) { .animate-slide-down { animation: none; } } // Disable animation on md+
            `}</style>
          </div> {/* End Sidebar Column */}
        </div> {/* End Main Flex Layout */}
      </div> {/* End Container */}
    </div> /* End Root Div */
  )
}

// Remember to install dependencies if you haven't:
// npm install lucide-react
// npm install class-variance-authority clsx tailwind-merge
// npx shadcn-ui@latest init (if you haven't setup shadcn/ui)
// npx shadcn-ui@latest add button card progress toast toaster

// Make sure your tailwind.config.js is set up correctly for shadcn/ui and includes necessary animations/keyframes if you add more complex ones.