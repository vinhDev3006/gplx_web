"use client"

// Import useMemo along with other hooks
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { globalQuizLists, globalQuestions } from "@/lib/data" // Adjust import path
import { Button } from "@/components/ui/button" // Adjust import path
import { Card } from "@/components/ui/card" // Adjust import path
import { Progress } from "@/components/ui/progress" // Adjust import path
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog" // Adjust import path
import { ArrowLeft, Clock, AlertTriangle, CheckCircle2, XCircle, ListChecks, HelpCircle, Award } from "lucide-react"

// Mock data (keep or remove as needed)
// interface Question { id: number; question: string; choices: string[]; correctAnswer: string; image?: string; isCrucial?: boolean; }
// interface Exam { id: number; title: string; questionIds: number[]; timeLimit?: number; passPercentage?: number; description?: string; isExam?: boolean; }
// const globalQuizLists: Exam[] = [{ id: 2, title: "Sample Exam", questionIds: [201, 202, 203, 204], timeLimit: 10, passPercentage: 75, description: "A timed exam simulating real conditions.", isExam: true }];
// const globalQuestions: Question[] = [ { id: 201, question: "What is 2 * 3?", choices: ["4", "5", "6", "7"], correctAnswer: "6", image: "/path/to/image2.jpg" }, { id: 202, question: "What is the square root of 16?", choices: ["2", "3", "4", "8"], correctAnswer: "4", isCrucial: true }, { id: 203, question: "Which gas do plants absorb from the atmosphere?", choices: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correctAnswer: "Carbon Dioxide" }, { id: 204, question: "What is H2O?", choices: ["Salt", "Sugar", "Water", "Acid"], correctAnswer: "Water"}];
// End Mock Data

export default function ExamPage({ params }: { params: { sectionId: string; examId: string } }) {
  const router = useRouter()

  // Accessing params directly. Although Next.js warns about using React.use(),
  // in a "use client" component, params should be directly available as props.
  // If issues arise, consider using `useParams()` from 'next/navigation'.
  const examId = Number.parseInt(params.examId)
  const sectionId = Number.parseInt(params.sectionId)

  // Find the specific exam
  const exam = globalQuizLists.find((q) => q.id === examId && q.isExam)

  // --- State Variables ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [examStarted, setExamStarted] = useState(false)
  const [examCompleted, setExamCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(exam?.timeLimit ? exam.timeLimit * 60 : 0)
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // --- Data Fetching & Processing ---
  // Memoize questions using the now imported useMemo
  const questions = useMemo(() => {
      return exam
          ? (exam.questionIds
                .map((id) => globalQuestions.find((q) => q.id === id))
                .filter(Boolean) as typeof globalQuestions)
          : [];
  }, [exam]);


  // --- Effects ---

   useEffect(() => {
     if (exam) {
       setTimeRemaining(exam.timeLimit ? exam.timeLimit * 60 : 0);
       setIsLoading(false);
     } else {
       setIsLoading(false);
     }
   }, [exam]);

  const handleSubmitExamCallback = useCallback(() => {
      if (examCompleted) return;

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      let correctCount = 0
      questions.forEach((question) => {
          if (selectedAnswers[question.id] === question.correctAnswer) {
            correctCount++
          }
      })

      const finalScore = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
      setScore(finalScore)
      setExamCompleted(true)
      setShowSubmitDialog(false);
  }, [questions, selectedAnswers, examCompleted]);

  useEffect(() => {
    if (examStarted && !examCompleted && exam?.timeLimit && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!)
            handleSubmitExamCallback();
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (timeRemaining <= 0 && examStarted && !examCompleted) {
        handleSubmitExamCallback();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [examStarted, examCompleted, exam?.timeLimit, timeRemaining, handleSubmitExamCallback])


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        const sidebar = document.getElementById("question-sidebar")
        const toggleButton = document.getElementById("sidebar-toggle-button");
        if (sidebar && !sidebar.contains(event.target as Node) &&
            toggleButton && !toggleButton.contains(event.target as Node) &&
            window.innerWidth < 768 && sidebarOpen) {
          setSidebarOpen(false)
        }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [sidebarOpen])

  // --- Helper Functions ---
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const getQuestionStatusClass = (index: number): string => {
      const question = questions[index]
      if (!question) return "bg-gray-200 border-gray-300 cursor-not-allowed";

      const questionId = question.id;
      const isAnswered = selectedAnswers.hasOwnProperty(questionId);

      if (index === currentQuestionIndex) {
          return "bg-blue-600 text-white border-blue-700 ring-2 ring-offset-1 ring-blue-500"
      } else if (isAnswered) {
          return "bg-blue-100 text-blue-800 border-blue-400 hover:bg-blue-200"
      } else {
          return "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
      }
  }


  // --- Event Handlers ---
  const handleStartExam = () => {
    setExamStarted(true)
  }

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

   const handleGoToQuestion = (index: number) => {
      if (index >= 0 && index < questions.length) {
          setCurrentQuestionIndex(index);
          if (window.innerWidth < 768) {
              setSidebarOpen(false);
          }
      }
  }

  const triggerSubmitFlow = () => {
      setShowSubmitDialog(true);
  }

  const confirmSubmitExam = () => {
      handleSubmitExamCallback();
  }


  // --- Render Logic ---

  if (isLoading) {
     return (
       <div className="flex justify-center items-center min-h-screen bg-white">
         <div className="text-center">
           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
           <p className="text-lg text-gray-600">Loading Exam...</p>
         </div>
       </div>
     )
   }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <Card className="bg-white p-8 md:p-12 rounded-xl shadow-lg max-w-md mx-auto border-red-200 border">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Exam Not Found</h1>
            <p className="text-gray-600 mb-8">The exam (ID: {examId}) you are looking for does not exist, is not marked as an exam, or may have been removed.</p>
            <Link href={`/section/${sectionId}`}>
              <Button className="w-full">Back to Section</Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

   if (questions.length === 0 && !isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white py-12 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <Card className="bg-white p-8 md:p-12 rounded-xl shadow-lg max-w-md mx-auto border-yellow-200 border">
              <HelpCircle className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
              <h1 className="text-2xl font-bold mb-4 text-gray-800">No Questions Available</h1>
              <p className="text-gray-600 mb-8">This exam currently has no questions assigned to it.</p>
              <Link href={`/section/${sectionId}`}>
                <Button className="w-full" variant="outline">Back to Section</Button>
              </Link>
            </Card>
          </div>
        </div>
      )
    }

  // --- Exam Start Screen ---
  if (!examStarted) {
    return (
       <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 flex items-center justify-center">
         <div className="container mx-auto px-4 max-w-2xl">
            {/* Optional: Adjust mb-6 */}
           <div className="mb-6 text-left">
                 <Link
                     href={`/section/${sectionId}`}
                     className="text-blue-600 hover:text-blue-800 inline-flex items-center font-medium group"
                 >
                     <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                     Back to Section
                 </Link>
            </div>

           <Card className="p-8 md:p-12 shadow-xl rounded-xl border-t-4 border-blue-500">
             <div className="text-center mb-8 md:mb-10">
                {/* Icon representing exam/test */}
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-5">
                  <ListChecks className="w-8 h-8 text-blue-600" />
               </div>
               <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">{exam.title}</h1>
               {exam.description && <p className="text-gray-600 text-base md:text-lg">{exam.description}</p>}
             </div>

             {/* Exam Details */}
             <div className="space-y-3 mb-8 md:mb-10">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                     <span className="font-medium text-gray-700 flex items-center">
                        <HelpCircle className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0" />
                        Number of Questions:
                     </span>
                     <span className="font-bold text-gray-900">{questions.length}</span>
                  </div>

                 {exam.timeLimit && (
                     <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                         <span className="font-medium text-gray-700 flex items-center">
                             <Clock className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0" />
                             Time Limit:
                         </span>
                         <span className="font-bold text-gray-900">{exam.timeLimit} minutes</span>
                     </div>
                 )}

                 {exam.passPercentage !== undefined && ( // Check if passPercentage is defined (even if 0)
                     <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                         <span className="font-medium text-gray-700 flex items-center">
                              <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0" />
                              Passing Score:
                         </span>
                         <span className="font-bold text-gray-900">{exam.passPercentage}%</span>
                     </div>
                 )}
             </div>

             {/* Important Warning */}
             <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 md:mb-10 rounded-r-lg">
               <div className="flex">
                 <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                 <div>
                   <h3 className="font-semibold text-yellow-800 mb-1">Important Notice</h3>
                   <p className="text-sm text-yellow-700">
                     Once you start the exam, the timer will begin. You must complete all questions within the allocated time.
                     The exam cannot be paused once started. Exiting will forfeit your attempt.
                   </p>
                 </div>
               </div>
             </div>

             {/* Start Button */}
             <div className="flex justify-center">
               <Button onClick={handleStartExam} size="lg" className="bg-blue-600 hover:bg-blue-700 px-10 py-3 text-lg">
                 Start Exam
               </Button>
             </div>
           </Card>
         </div>
       </div>
    )
  }

  // --- Exam Completed Screen ---
   if (examCompleted) {
     const passPercentage = exam.passPercentage ?? 0; // Default pass mark if not set (0 means always pass unless score is negative)
     const passed = score >= passPercentage;
     // Recalculate correct count for display (already calculated in submit logic)
     const correctCount = questions.reduce((count, q) => selectedAnswers[q.id] === q.correctAnswer ? count + 1 : count, 0);


     return (
        // Using same layout as quiz completion for consistency
       <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 flex items-center justify-center">
         <div className="container mx-auto px-4 max-w-2xl">
           <Card className="p-8 md:p-12 shadow-xl rounded-xl border-t-4 border-blue-500">
             <div className="text-center">
               <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-8 ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
                 {passed ? (
                   <Award className="h-12 w-12 text-green-600" /> // Using Award for passing
                 ) : (
                   <XCircle className="h-12 w-12 text-red-600" />
                 )}
               </div>
               <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Exam Completed</h1>
               <div className="mb-8">
                  <p className="text-lg text-gray-600 mb-2">Your Final Score:</p>
                 <div className="text-6xl font-bold mb-4 text-blue-600">{score}%</div>
                 <p className="text-base text-gray-500">
                    You answered {correctCount} out of {questions.length} questions correctly.
                 </p>
               </div>

               {/* Pass/Fail Section */}
                {exam.passPercentage !== undefined && ( // Only show if a pass percentage is set
                   <div className={`mb-8 p-4 rounded-lg inline-block ${passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                     <div className={`text-2xl font-semibold ${passed ? "text-green-700" : "text-red-700"}`}>
                       {passed ? "PASSED" : "FAILED"}
                     </div>
                     <p className="text-sm text-gray-600 mt-1">Passing score: {exam.passPercentage}%</p>
                   </div>
                )}

               {/* Action Buttons */}
               <div className="flex justify-center mt-10">
                 <Link href={`/section/${sectionId}`}>
                   <Button size="lg" variant="outline" className="px-8 py-3 text-lg">
                     <ArrowLeft className="mr-2 h-5 w-5" /> Back to Section
                   </Button>
                 </Link>
                  {/* Optionally add a "Review Answers" button if functionality exists */}
               </div>
             </div>
           </Card>
         </div>
       </div>
     )
   }


  // --- Active Exam Screen ---
  const currentQuestion = questions[currentQuestionIndex];
  const answeredQuestionsCount = Object.keys(selectedAnswers).length
  const progressPercentage = questions.length > 0 ? Math.round((answeredQuestionsCount / questions.length) * 100) : 0;


   if (!currentQuestion && !isLoading) {
     console.error("Attempted to render exam with no current question. Index:", currentQuestionIndex, "Questions:", questions);
     return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-white p-4">
            <AlertTriangle className="w-12 h-12 text-red-500 mb-4"/>
            <p className="text-lg text-red-600 text-center mb-6">Error: Could not load the current question. Please try refreshing or go back.</p>
             <Link href={`/section/${sectionId}`}>
               <Button variant="outline">Back to Section</Button>
             </Link>
        </div>
     );
   }


  return (
     <div className="bg-gradient-to-b from-blue-50 via-gray-50 to-white min-h-screen">
       <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
         {/* Header Section */}
         <div className="mb-6 md:mb-8">
             {/* Header Row: Exit Button, Title, Timer */}
             <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                 <button
                     onClick={() => setShowExitDialog(true)}
                     className="text-red-600 hover:text-red-800 inline-flex items-center font-medium group order-1"
                     aria-label="Exit Exam"
                 >
                     <XCircle className="h-5 w-5 mr-1.5 group-hover:scale-110 transition-transform" />
                     Exit Exam
                 </button>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-800 order-3 md:order-2 text-center md:text-left flex-grow px-2">{exam.title}</h1>
                 {exam.timeLimit && (
                   <div
                     className={`text-lg font-semibold flex items-center gap-2 px-3 py-1.5 rounded-lg order-2 md:order-3 tabular-nums ${
                       timeRemaining < 60 ? "text-red-700 bg-red-100 border border-red-200 animate-pulse"
                       : timeRemaining < 300 ? "text-orange-700 bg-orange-100 border border-orange-200"
                       : "text-gray-700 bg-gray-100 border border-gray-200"
                     }`}
                     role="timer" aria-live="polite"
                   >
                     <Clock className="h-5 w-5" /> {formatTime(timeRemaining)}
                   </div>
                 )}
             </div>
              {/* Progress Info & Bar */}
             <div className="mt-4 bg-white p-3 rounded-lg shadow-sm mb-2">
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

         {/* Mobile Sidebar Toggle */}
         <div className="md:hidden mb-4">
           <Button id="sidebar-toggle-button" variant="outline" onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full flex items-center justify-center gap-2" aria-expanded={sidebarOpen} aria-controls="question-sidebar" >
             {sidebarOpen ? "Hide Navigation" : "Show Question Navigation"}
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${sidebarOpen ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
           </Button>
         </div>

         {/* Main Layout: Question Content & Sidebar */}
         <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
           {/* Main Exam Content Column */}
           <div className="flex-grow order-2 md:order-1 w-full">
              {currentQuestion && ( // Ensure currentQuestion exists before rendering card
                <Card key={currentQuestion.id} className="p-6 md:p-8 shadow-lg border-0 rounded-xl bg-white">
                 {/* Question Area */}
                <div className="mb-6">
                    {/* Question Text & Crucial Tag */}
                    <div className="flex items-start justify-between mb-5">
                        <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 flex-grow">{currentQuestion.question}</h2>
                        {currentQuestion.isCrucial && (
                            <span className="ml-3 mt-1 flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200" title="Crucial Question">
                                <AlertTriangle className="h-3 w-3 mr-1"/> Important
                            </span>
                        )}
                    </div>
                    {/* Question Image */}
                    {currentQuestion.image && (
                    <div className="mb-6 relative w-full rounded-lg overflow-hidden border bg-gray-50 aspect-video">
                        <Image src={currentQuestion.image.replace(/\[|\]/g, "") || "/placeholder.svg"} alt={`Illustration for question ${currentQuestionIndex + 1}`} fill className="object-contain" onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} priority={true} />
                    </div>
                    )}
                    {/* Answer Choices */}
                    <div className="space-y-3 mt-6">
                    {currentQuestion.choices.map((choice, index) => {
                        const questionId = currentQuestion.id;
                        const isSelected = selectedAnswers[questionId] === choice;
                        let choiceBg = 'bg-white hover:bg-gray-100'; let choiceBorder = 'border-gray-300 hover:border-blue-400'; let choiceText = 'text-gray-800'; let radioBorder = 'border-gray-400';
                        if (isSelected) { radioBorder = 'border-blue-600'; choiceBorder = 'border-blue-500 ring-1 ring-blue-300'; choiceBg = 'bg-blue-50 hover:bg-blue-100'; choiceText = 'text-blue-900 font-medium'; }
                        return (
                        <div key={`${questionId}-${index}`} onClick={() => handleAnswerSelect(questionId, choice)} className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-150 ease-in-out ${choiceBorder} ${choiceBg}`} role="radio" aria-checked={isSelected} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleAnswerSelect(questionId, choice); }} >
                            <div className="flex items-center justify-between">
                            <div className="flex items-center flex-grow mr-4">
                                <div className={`flex-shrink-0 h-5 w-5 rounded-full border-2 mr-3 flex items-center justify-center ${radioBorder}`}>{isSelected && <div className="h-2.5 w-2.5 rounded-full bg-blue-600"></div>}</div>
                                <span className={`text-base md:text-lg ${choiceText}`}>{choice}</span>
                            </div>
                            </div>
                        </div>
                        )
                    })}
                    </div>
                </div>
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                    <Button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} variant="outline" className="flex items-center gap-1 disabled:opacity-50" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg> Previous
                    </Button>
                    {currentQuestionIndex < questions.length - 1 && (
                    <Button onClick={handleNextQuestion} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 px-6" > Next <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg> </Button>
                    )}
                    {currentQuestionIndex === questions.length - 1 && (
                    <Button onClick={triggerSubmitFlow} className="flex items-center gap-1 bg-green-600 hover:bg-green-700 px-6" > Finish & Submit <CheckCircle2 className="w-5 h-5 ml-1"/> </Button>
                    )}
                </div>
                </Card>
              )}
           </div>

           {/* Sidebar Column */}
           <div id="question-sidebar" className={`w-full md:w-72 lg:w-80 order-1 md:order-2 flex-shrink-0 ${ sidebarOpen ? "block animate-slide-down" : "hidden md:block" } transition-all duration-300 ease-in-out`} >
             <Card className="p-4 sticky top-4 shadow-lg border-0 rounded-xl bg-white">
               <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                 <h3 className="font-semibold text-base text-gray-800">Navigation</h3>
                 <div className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full"> {answeredQuestionsCount}/{questions.length} Answered </div>
               </div>
               <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-[55vh] md:max-h-[60vh] overflow-y-auto p-1 custom-scrollbar">
                 {questions.map((q, index) => (
                   <button key={index} onClick={() => handleGoToQuestion(index)} className={`relative h-10 w-10 rounded-md text-sm font-medium flex items-center justify-center border transition-colors duration-150 ${getQuestionStatusClass(index)}`} title={`Go to Question ${index + 1}${q.isCrucial ? ' (Important)' : ''}`} aria-label={`Question ${index + 1}${q.isCrucial ? ' Important' : ''}`} aria-current={index === currentQuestionIndex ? "step" : undefined} >
                     {q.isCrucial && ( <span className="absolute -top-1 -right-1 flex h-3 w-3"> <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span> <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-white border"></span> </span> )}
                     {index + 1}
                   </button>
                 ))}
               </div>
               {/* Legend */}
               <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600 space-y-1.5 bg-gray-50 p-3 rounded-lg">
                 <h4 className="font-medium text-gray-700 mb-2 text-sm">Legend:</h4>
                 <div className="flex items-center"> <div className="w-3.5 h-3.5 rounded-full bg-blue-600 border border-blue-700 mr-2 flex-shrink-0"></div> <span>Current</span> </div>
                 <div className="flex items-center"> <div className="w-3.5 h-3.5 rounded-md bg-blue-100 border border-blue-400 mr-2 flex-shrink-0"></div> <span>Answered</span> </div>
                 <div className="flex items-center"> <div className="w-3.5 h-3.5 rounded-md bg-white border border-gray-300 mr-2 flex-shrink-0"></div> <span>Not Answered</span> </div>
                 <div className="flex items-center mt-2"> <span className="flex h-3 w-3 mr-2 relative"><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-white border"></span></span> <span>Important</span> </div>
               </div>
             </Card>
             {/* Styles */}
             <style jsx>{`
                 .custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #bbb; }
                 @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } } .animate-slide-down { animation: slideDown 0.3s ease-out forwards; } @media (min-width: 768px) { .animate-slide-down { animation: none; } }
                 @keyframes pulse { 50% { opacity: .5; } } .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
             `}</style>
           </div>
         </div>

         {/* Final Submit Button (Bottom) */}
         <div className="flex justify-center mt-8 md:mt-12">
           <Button onClick={triggerSubmitFlow} variant="default" size="lg" className="bg-green-600 hover:bg-green-700 px-10 py-3 text-lg font-semibold shadow-md" > Submit Exam </Button>
         </div>

         {/* Dialogs */}
         <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
           <DialogContent className="sm:max-w-md">
             <DialogHeader> <DialogTitle className="text-xl font-semibold flex items-center"><AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" /> Exit Exam?</DialogTitle> <DialogDescription className="text-base pt-3"> Are you sure you want to exit? Your current progress will be lost, and this attempt will be forfeited. </DialogDescription> </DialogHeader>
             <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4"> <DialogClose asChild><Button variant="outline" className="sm:flex-1">Cancel</Button></DialogClose> <Button asChild variant="destructive" className="sm:flex-1"><Link href={`/section/${sectionId}`}>Confirm Exit</Link></Button> </DialogFooter>
           </DialogContent>
         </Dialog>
         <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
           <DialogContent className="sm:max-w-md">
             <DialogHeader> <DialogTitle className="text-xl font-semibold flex items-center">{answeredQuestionsCount < questions.length ? (<AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />) : (<CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />)} Submit Exam?</DialogTitle> <DialogDescription className="text-base pt-3 space-y-2"> <p>You have answered {answeredQuestionsCount} out of {questions.length} questions.</p> {answeredQuestionsCount < questions.length && (<p className="text-red-600 font-medium"> Warning: {questions.length - answeredQuestionsCount} questions remain unanswered. </p>)} <p>Are you sure you want to submit your answers?</p> </DialogDescription> </DialogHeader>
             <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4"> <DialogClose asChild><Button variant="outline" className="sm:flex-1">Continue Working</Button></DialogClose> <Button onClick={confirmSubmitExam} className="sm:flex-1 bg-blue-600 hover:bg-blue-700"> Confirm Submission </Button> </DialogFooter>
           </DialogContent>
         </Dialog>

       </div>
     </div>
  )
}