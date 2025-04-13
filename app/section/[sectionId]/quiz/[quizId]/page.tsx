"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { globalQuizLists, globalQuestions } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, Save, ArrowLeft, HelpCircle, RotateCcw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function QuizPage({ params }: { params: { sectionId: string; quizId: string } }) {
  const router = useRouter()
  const quizId = Number.parseInt(params.quizId)
  const sectionId = Number.parseInt(params.sectionId)

  const quiz = globalQuizLists.find((q) => q.id === quizId)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [correctAnswers, setCorrectAnswers] = useState<Record<number, boolean>>({})
  const [showHint, setShowHint] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Get questions for this quiz
  const questions = quiz
    ? (quiz.questionIds.map((id) => globalQuestions.find((q) => q.id === id)).filter(Boolean) as typeof globalQuestions)
    : []

  // Check if storage is enabled for this quiz
  const isStorageEnabled = quiz?.enableStorage === true

  // Generate a unique storage key for this quiz
  const storageKey = `quiz_progress_${sectionId}_${quizId}`

  // Load saved progress from localStorage only if storage is enabled
  useEffect(() => {
    if (typeof window !== "undefined" && quiz && isStorageEnabled) {
      try {
        const savedProgress = localStorage.getItem(storageKey)

        if (savedProgress) {
          const { answers, correct, completed, finalScore, lastQuestionIndex } = JSON.parse(savedProgress)

          setSelectedAnswers(answers || {})
          setCorrectAnswers(correct || {})

          if (completed) {
            setQuizCompleted(true)
            setScore(finalScore || 0)
          } else if (lastQuestionIndex !== undefined) {
            setCurrentQuestionIndex(lastQuestionIndex)
          }
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Lỗi khi tải tiến trình đã lưu:", error)
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }, [storageKey, quiz, isStorageEnabled])

  // Save progress to localStorage
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
          title: "Đã lưu tiến trình",
          description: "Tiến trình làm bài của bạn đã được lưu",
          duration: 2000,
        })
      } catch (error) {
        console.error("Lỗi khi lưu tiến trình:", error)
        toast({
          title: "Lỗi khi lưu tiến trình",
          description: "Đã xảy ra lỗi khi lưu tiến trình của bạn",
          variant: "destructive",
          duration: 3000,
        })
      }
    }
  }

  // Clear saved progress
  const clearProgress = () => {
    if (typeof window !== "undefined" && isStorageEnabled) {
      try {
        localStorage.removeItem(storageKey)
        toast({
          title: "Đã xóa tiến trình",
          description: "Tiến trình đã lưu của bạn đã được xóa",
          duration: 2000,
        })
      } catch (error) {
        console.error("Lỗi khi xóa tiến trình:", error)
      }
    }
  }

  // Auto-save progress when answers change
  useEffect(() => {
    if (!isLoading && isStorageEnabled && Object.keys(selectedAnswers).length > 0) {
      const progressData = {
        answers: selectedAnswers,
        correct: correctAnswers,
        completed: quizCompleted,
        finalScore: score,
        lastQuestionIndex: currentQuestionIndex,
        timestamp: new Date().toISOString(),
      }

      localStorage.setItem(storageKey, JSON.stringify(progressData))
    }
  }, [
    selectedAnswers,
    correctAnswers,
    quizCompleted,
    score,
    currentQuestionIndex,
    isLoading,
    storageKey,
    isStorageEnabled,
  ])

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("question-sidebar")
      if (sidebar && !sidebar.contains(event.target as Node) && window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy bài kiểm tra</h1>
        <Link href={`/section/${sectionId}`}>
          <Button>Quay lại phần học</Button>
        </Link>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswerSelect = (answer: string) => {
    const isCorrect = answer === currentQuestion.correctAnswer

    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: answer,
    })

    setCorrectAnswers({
      ...correctAnswers,
      [currentQuestion.id]: isCorrect,
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowHint(false)
    } else {
      // Calculate score
      let correctCount = 0
      questions.forEach((question) => {
        if (correctAnswers[question.id]) {
          correctCount++
        }
      })

      const finalScore = Math.round((correctCount / questions.length) * 100)
      setScore(finalScore)
      setQuizCompleted(true)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setShowHint(false)
    }
  }

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setCorrectAnswers({})
    setShowHint(false)
    setQuizCompleted(false)
    if (isStorageEnabled) {
      clearProgress()
    }
  }

  // Function to determine the status class for question index buttons
  const getQuestionStatusClass = (index: number) => {
    const question = questions[index]
    if (index === currentQuestionIndex) {
      return "bg-blue-600 text-white border-blue-600"
    } else if (question && correctAnswers[question.id] === true) {
      return "bg-green-100 text-green-800 border-green-500"
    } else if (question && correctAnswers[question.id] === false) {
      return "bg-red-100 text-red-800 border-red-500"
    } else if (question && selectedAnswers[question.id]) {
      return "bg-blue-100 text-blue-800 border-blue-300"
    } else {
      return "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bài kiểm tra...</p>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy câu hỏi cho bài kiểm tra này</h1>
        <Link href={`/section/${sectionId}`}>
          <Button>Quay lại phần học</Button>
        </Link>
      </div>
    )
  }

  if (quizCompleted) {
    const passed = quiz.passPercentage ? score >= quiz.passPercentage : true

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
        <Toaster />
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="p-8 shadow-lg rounded-xl border-0">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-50 mb-6">
                {passed ? (
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-500" />
                )}
              </div>
              <h1 className="text-3xl font-bold mb-6">Đã hoàn thành bài kiểm tra!</h1>
              <div className="mb-8">
                <div className="text-6xl font-bold mb-2 text-blue-600">{score}%</div>
                <p className="text-lg text-gray-600">
                  Bạn đã trả lời đúng {Object.values(correctAnswers).filter((value) => value === true).length} trong số{" "}
                  {questions.length} câu hỏi.
                </p>
              </div>

              {quiz.passPercentage && (
                <div className="mb-8 p-4 rounded-lg bg-gray-50 inline-block">
                  <div className={`text-2xl font-bold ${passed ? "text-green-600" : "text-red-600"}`}>
                    {passed ? "ĐẠT!" : "KHÔNG ĐẠT"}
                  </div>
                  <p className="text-gray-600">Điểm đạt: {quiz.passPercentage}%</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button onClick={handleRestartQuiz} size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <RotateCcw className="mr-2 h-4 w-4" /> Làm lại bài kiểm tra
                </Button>
                <Link href={`/section/${sectionId}`}>
                  <Button variant="outline" size="lg">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại phần học
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Calculate progress percentage
  const answeredQuestions = Object.keys(selectedAnswers).length
  const progressPercentage = Math.round((answeredQuestions / questions.length) * 100)

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <Toaster />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <Link
            href={`/section/${sectionId}`}
            className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Thoát bài kiểm tra
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
            {isStorageEnabled && (
              <Button variant="outline" size="sm" onClick={saveProgress} className="flex items-center gap-1">
                <Save className="h-4 w-4" />
                <span>Lưu tiến trình</span>
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 bg-white p-3 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">
              Câu hỏi <span className="font-bold text-blue-600">{currentQuestionIndex + 1}</span> trong{" "}
              <span className="font-bold">{questions.length}</span>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-bold text-blue-600">{answeredQuestions}</span> trong{" "}
              <span className="font-bold">{questions.length}</span> đã trả lời ({progressPercentage}%)
            </div>
          </div>
          <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-2 mt-2" />
        </div>

        {/* Mobile question navigation toggle */}
        <div className="md:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2"
          >
            {sidebarOpen ? "Ẩn điều hướng" : "Hiện điều hướng câu hỏi"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${sidebarOpen ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Main quiz content */}
          <div className="flex-grow order-2 md:order-1">
            <Card className="p-6 shadow-lg border-0 rounded-xl">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">{currentQuestion.question}</h2>

                {currentQuestion.image && (
                  <div className="mb-6 relative h-64 w-full rounded-lg overflow-hidden border">
                    <Image
                      src={currentQuestion.image.replace(/\[|\]|$|$/g, "") || "/placeholder.svg?height=300&width=500"}
                      alt="Hình ảnh câu hỏi"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}

                <div className="space-y-3 mt-6">
                  {currentQuestion.choices.map((choice, index) => {
                    const isSelected = selectedAnswers[currentQuestion.id] === choice
                    const isCorrect = choice === currentQuestion.correctAnswer

                    let borderColorClass = "border-gray-200 hover:border-gray-300"
                    let bgColorClass = "hover:bg-gray-50"

                    if (isSelected) {
                      if (isCorrect) {
                        borderColorClass = "border-green-500"
                        bgColorClass = "bg-green-50"
                      } else {
                        borderColorClass = "border-red-500"
                        bgColorClass = "bg-red-50"
                      }
                    }

                    return (
                      <div
                        key={index}
                        onClick={() => handleAnswerSelect(choice)}
                        className={`p-4 rounded-lg border-2 cursor-pointer ${borderColorClass} ${bgColorClass} transition-colors`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div
                              className={`flex-shrink-0 h-5 w-5 rounded-full border-2 mr-3 mt-0.5 ${
                                isSelected
                                  ? isCorrect
                                    ? "border-green-500 bg-green-500"
                                    : "border-red-500 bg-red-500"
                                  : "border-gray-400"
                              }`}
                            >
                              {isSelected &&
                                (isCorrect ? (
                                  <CheckCircle2 className="h-4 w-4 text-white" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-white" />
                                ))}
                            </div>
                            <span className="text-lg">{choice}</span>
                          </div>

                          {isSelected && (
                            <div className="ml-2">
                              {isCorrect ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {currentQuestion.hint && (
                <div className="mb-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowHint(!showHint)}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <HelpCircle className="h-4 w-4" />
                    {showHint ? "Ẩn gợi ý" : "Hiện gợi ý"}
                  </Button>

                  {showHint && (
                    <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
                      <span className="font-medium">Gợi ý:</span> {currentQuestion.hint}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between mt-4">
                <Button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  Câu trước
                </Button>

                <Button onClick={handleNextQuestion} className="flex items-center gap-1">
                  {currentQuestionIndex === questions.length - 1 ? "Hoàn thành" : "Câu tiếp"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={currentQuestionIndex === questions.length - 1 ? "hidden" : ""}
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Button>
              </div>
            </Card>
          </div>

          {/* Question index sidebar */}
          <div
            id="question-sidebar"
            className={`w-full md:w-80 order-1 md:order-2 ${
              sidebarOpen ? "block" : "hidden md:block"
            } transition-all duration-300`}
          >
            <Card className="p-4 sticky top-4 shadow-lg border-0 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-800">Điều hướng câu hỏi</h3>
                <div className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {answeredQuestions}/{questions.length} đã trả lời
                </div>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-[60vh] overflow-y-auto p-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`h-10 w-10 rounded-md text-sm font-medium flex items-center justify-center border ${getQuestionStatusClass(index)}`}
                    title={`Câu hỏi ${index + 1}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center mb-1">
                  <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
                  <span>Câu hỏi hiện tại</span>
                </div>
                <div className="flex items-center mb-1">
                  <div className="w-3 h-3 rounded-full bg-green-100 border border-green-500 mr-2"></div>
                  <span>Trả lời đúng</span>
                </div>
                <div className="flex items-center mb-1">
                  <div className="w-3 h-3 rounded-full bg-red-100 border border-red-500 mr-2"></div>
                  <span>Trả lời sai</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-white border border-gray-300 mr-2"></div>
                  <span>Chưa trả lời</span>
                </div>
              </div>

              {isStorageEnabled && (
                <div className="mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center justify-center gap-1"
                    onClick={handleRestartQuiz}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Đặt lại tiến trình
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
