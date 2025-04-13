"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { globalQuizLists, globalQuestions } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { ArrowLeft, Clock, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"

export default function ExamPage({ params }: { params: { sectionId: string; examId: string } }) {
  const router = useRouter()
  const examId = Number.parseInt(params.examId)
  const sectionId = Number.parseInt(params.sectionId)

  const exam = globalQuizLists.find((q) => q.id === examId && q.isExam)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [examStarted, setExamStarted] = useState(false)
  const [examCompleted, setExamCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (examStarted && !examCompleted && exam?.timeLimit) {
      setTimeRemaining(exam.timeLimit * 60) // Convert minutes to seconds

      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitExam()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [examStarted, examCompleted])

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

  if (!exam) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Không tìm thấy bài thi</h1>
            <p className="text-gray-600 mb-6">Bài thi bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <Link href={`/section/${sectionId}`}>
              <Button className="w-full">Quay lại phần học</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Get questions for this exam
  const questions = exam.questionIds
    .map((id) => globalQuestions.find((q) => q.id === id))
    .filter(Boolean) as typeof globalQuestions

  const currentQuestion = questions[currentQuestionIndex]

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleStartExam = () => {
    setExamStarted(true)
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: answer,
    })
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

  const handleSubmitExam = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    // Calculate score
    let correctAnswers = 0
    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++
      }
    })

    const finalScore = Math.round((correctAnswers / questions.length) * 100)
    setScore(finalScore)
    setExamCompleted(true)
  }

  // Function to determine the status class for question index buttons
  const getQuestionStatusClass = (index: number) => {
    const question = questions[index]
    if (index === currentQuestionIndex) {
      return "bg-blue-600 text-white border-blue-600"
    } else if (question && selectedAnswers[question.id]) {
      return "bg-blue-100 text-blue-800 border-blue-300"
    } else {
      return "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
    }
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            href={`/section/${sectionId}`}
            className="text-blue-600 hover:text-blue-800 mb-6 inline-flex items-center font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại phần học
          </Link>

          <Card className="p-8 shadow-lg rounded-xl border-0">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-yellow-600"
                >
                  <path d="M12 8v4l3 3" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-2 text-gray-800">{exam.title}</h1>
              <p className="text-gray-600">{exam.description}</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <span className="font-medium flex items-center">
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
                    className="mr-2 text-blue-600"
                  >
                    <path d="M8 3H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1" />
                    <path d="M12 17v.01" />
                    <path d="M12 14v-4" />
                    <path d="M16 3h-8v2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V3z" />
                  </svg>
                  Số câu hỏi:
                </span>
                <span className="font-bold">{questions.length}</span>
              </div>

              {exam.timeLimit && (
                <div className="flex justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="font-medium flex items-center">
                    <Clock className="mr-2 text-blue-600" />
                    Thời gian làm bài:
                  </span>
                  <span className="font-bold">{exam.timeLimit} phút</span>
                </div>
              )}

              {exam.passPercentage && (
                <div className="flex justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="font-medium flex items-center">
                    <CheckCircle2 className="mr-2 text-blue-600" />
                    Điểm đạt:
                  </span>
                  <span className="font-bold">{exam.passPercentage}%</span>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg">
              <div className="flex">
                <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-yellow-800 mb-1">Lưu ý quan trọng</h3>
                  <p className="text-sm text-yellow-700">
                    Khi bắt đầu bài thi, thời gian sẽ được tính. Bạn phải hoàn thành tất cả các câu hỏi trong thời gian
                    quy định. Không thể tạm dừng bài thi sau khi đã bắt đầu.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button onClick={handleStartExam} size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
                Bắt đầu bài thi
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (examCompleted) {
    const passed = exam.passPercentage ? score >= exam.passPercentage : true

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
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
              <h1 className="text-3xl font-bold mb-6">Đã hoàn thành bài thi!</h1>
              <div className="mb-8">
                <div className="text-6xl font-bold mb-2 text-blue-600">{score}%</div>
                <p className="text-lg text-gray-600">
                  Bạn đã trả lời đúng{" "}
                  {
                    Object.keys(selectedAnswers).filter(
                      (id) =>
                        selectedAnswers[Number.parseInt(id)] ===
                        questions.find((q) => q.id === Number.parseInt(id))?.correctAnswer,
                    ).length
                  }{" "}
                  trong số {questions.length} câu hỏi.
                </p>
              </div>

              {exam.passPercentage && (
                <div className="mb-8 p-4 rounded-lg bg-gray-50 inline-block">
                  <div className={`text-2xl font-bold ${passed ? "text-green-600" : "text-red-600"}`}>
                    {passed ? "ĐẠT!" : "KHÔNG ĐẠT"}
                  </div>
                  <p className="text-gray-600">Điểm đạt: {exam.passPercentage}%</p>
                </div>
              )}

              <div className="flex justify-center mt-8">
                <Link href={`/section/${sectionId}`}>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
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

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <button
            onClick={() => setShowExitDialog(true)}
            className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Thoát bài thi
          </button>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-800">{exam.title}</h1>
            {exam.timeLimit && (
              <div
                className={`text-lg font-medium flex items-center gap-2 px-4 py-2 rounded-lg ${
                  timeRemaining < 60
                    ? "text-red-600 bg-red-50 animate-pulse"
                    : timeRemaining < 300
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-700 bg-gray-50"
                }`}
              >
                <Clock className="h-5 w-5" />
                {formatTime(timeRemaining)}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 bg-white p-3 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">
              Câu hỏi <span className="font-bold text-blue-600">{currentQuestionIndex + 1}</span> trong{" "}
              <span className="font-bold">{questions.length}</span>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-bold text-blue-600">{Object.keys(selectedAnswers).length}</span> trong{" "}
              <span className="font-bold">{questions.length}</span> đã trả lời
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
          {/* Main exam content */}
          <div className="flex-grow order-2 md:order-1">
            <Card className="p-6 shadow-lg border-0 rounded-xl">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  {currentQuestion.question}
                  {currentQuestion.isCrucial && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                      Quan trọng
                    </span>
                  )}
                </h2>

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
                  {currentQuestion.choices.map((choice, index) => (
                    <div
                      key={index}
                      onClick={() => handleAnswerSelect(choice)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedAnswers[currentQuestion.id] === choice
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start">
                        <div
                          className={`flex-shrink-0 h-5 w-5 rounded-full border-2 mr-3 mt-0.5 ${
                            selectedAnswers[currentQuestion.id] === choice
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-400"
                          }`}
                        >
                          {selectedAnswers[currentQuestion.id] === choice && (
                            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <span className={`text-lg ${
                          selectedAnswers[currentQuestion.id] === choice
                            ? "text-blue-700 font-semibold" // Example: Make selected text darker blue and bold
                            : "text-gray-900"               // Example: Default text color for unselected items
                        }`}>
                          {choice}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

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

                <Button
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1 || !selectedAnswers[currentQuestion.id]}
                  className="flex items-center gap-1"
                >
                  Câu tiếp
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
                  {Object.keys(selectedAnswers).length}/{questions.length} đã trả lời
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
                  <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300 mr-2"></div>
                  <span>Đã trả lời</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-white border border-gray-300 mr-2"></div>
                  <span>Chưa trả lời</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button
            onClick={() => setShowSubmitDialog(true)}
            variant="default"
            size="lg"
            className="bg-green-600 hover:bg-green-700 px-8 py-6 text-lg font-medium"
          >
            Nộp bài thi
          </Button>
        </div>

        <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Thoát bài thi?</DialogTitle>
              <DialogDescription className="text-base pt-2">
                Bạn có chắc chắn muốn thoát? Tiến trình của bạn sẽ bị mất và bạn sẽ cần bắt đầu lại.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-4">
              <AlertTriangle className="h-16 w-16 text-yellow-500" />
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
              <Button variant="outline" onClick={() => setShowExitDialog(false)} className="sm:flex-1">
                Hủy
              </Button>
              <Link href={`/section/${sectionId}`} className="sm:flex-1">
                <Button variant="destructive" className="w-full">
                  Thoát bài thi
                </Button>
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Nộp bài thi?</DialogTitle>
              <DialogDescription className="text-base pt-2">
                Bạn đã trả lời {Object.keys(selectedAnswers).length} trong số {questions.length} câu hỏi.
                {Object.keys(selectedAnswers).length < questions.length && (
                  <p className="text-red-600 mt-2 font-medium">
                    Cảnh báo: Bạn còn {questions.length - Object.keys(selectedAnswers).length} câu hỏi chưa trả lời.
                  </p>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-4">
              {Object.keys(selectedAnswers).length === questions.length ? (
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              ) : (
                <AlertTriangle className="h-16 w-16 text-yellow-500" />
              )}
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
              <Button variant="outline" onClick={() => setShowSubmitDialog(false)} className="sm:flex-1">
                Tiếp tục làm bài
              </Button>
              <Button onClick={handleSubmitExam} className="sm:flex-1 bg-blue-600 hover:bg-blue-700">
                Nộp bài thi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
