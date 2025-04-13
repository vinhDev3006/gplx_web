// TypeScript Interfaces
export interface Question {
    id: number
    question: string
    choices: string[]
    correctAnswer: string
    hint: string
    image?: string
    isCrucial?: boolean
    category: string[]
  }
  
  export interface QuizList {
    id: number
    title: string
    description: string
    image: string
    questionIds: number[] // References to questions in the global questions list
    category: string[] // Optional category for the question list
    timeLimit?: number // Optional time limit in minutes (if treated as a timed quiz)
    passPercentage?: number // Optional passing score percentage (if treated as a scored quiz)
    isExam?: boolean // Optional flag to indicate if this question list is an exam
    enableStorage?: boolean // Optional flag to enable progress storage for this quiz
  }
  
  export interface OtherContent {
    id: number
    title: string
    description: string
    image: string
    type: string
  }
  
  export interface Section {
    id: number
    title: string
    description: string
    image: string
    quizLists: QuizList[] // Now each QuizList is a list of questions
    otherContent: OtherContent[]
    // Exams can now be represented as QuizLists with isExam: true
  }
  
  export const globalQuestions: Question[] = [
    {
      id: 1,
      question: "Thủ đô của Nhật Bản là gì?",
      choices: ["Seoul", "Bắc Kinh", "Tokyo", "Bangkok"],
      correctAnswer: "Tokyo",
      hint: "Nổi tiếng với sushi và giao lộ Shibuya.",
      category: ["Địa lý", "Châu Á"],
    },
    {
      id: 2,
      question: "Thực vật hấp thụ loại khí nào từ khí quyển?",
      choices: ["Oxy", "Carbon Dioxide", "Nitơ", "Hydro"],
      correctAnswer: "Carbon Dioxide",
      hint: "Đây là loại khí mà chúng ta thở ra.",
      isCrucial: true,
      category: ["Khoa học", "Sinh học"],
    },
    {
      id: 3,
      question: "12 x 12 bằng bao nhiêu?",
      choices: ["144", "124", "132", "154"],
      correctAnswer: "144",
      hint: "Đây là bình phương của một tá.",
      isCrucial: true,
      category: ["Toán học"],
    },
    {
      id: 4,
      question: "Ai là tác giả của 'Romeo và Juliet'?",
      choices: ["Charles Dickens", "Leo Tolstoy", "William Shakespeare", "Jane Austen"],
      correctAnswer: "William Shakespeare",
      hint: "Ông là nhà viết kịch người Anh nổi tiếng với các vở bi kịch.",
      category: ["Văn học"],
    },
    {
      id: 5,
      question: "Hành tinh lớn nhất trong hệ mặt trời của chúng ta là gì?",
      choices: ["Trái Đất", "Sao Thổ", "Sao Mộc", "Sao Hỏa"],
      correctAnswer: "Sao Mộc",
      hint: "Nó nổi tiếng với Vết Đỏ Lớn.",
      image: "https://example.com/jupiter.jpg",
      category: ["Khoa học", "Thiên văn học"],
    },
  ]
  
  export const globalQuizLists: QuizList[] = [
    {
      id: 1,
      title: "Bài kiểm tra Khoa học Tổng quát",
      description: "Bài kiểm tra bao gồm các câu hỏi khoa học cơ bản.",
      image: "https://example.com/general-science.jpg",
      questionIds: [2, 5], // Directly referencing question IDs
      category: ["Khoa học"],
      isExam: true,
      timeLimit: 10,
      passPercentage: 70,
    },
    {
      id: 2,
      title: "Luyện tập Địa lý Thế giới",
      description: "Luyện tập kiến thức về các thủ đô trên thế giới.",
      image: "https://example.com/world-geography.jpg",
      questionIds: [1, 2, 3], // Directly referencing question IDs
      category: ["Địa lý"],
      enableStorage: true, // Bật tính năng lưu trữ cho bài kiểm tra này
    },
    {
      id: 3,
      title: "Kiểm tra Văn học",
      description: "Kiểm tra hiểu biết của bạn về văn học cổ điển.",
      image: "https://example.com/literature.jpg",
      questionIds: [4], // Directly referencing question IDs
      category: ["Văn học"],
    },
    {
      id: 4,
      title: "Luyện tập Toán học Nhanh",
      description: "Bài kiểm tra ngắn về phép nhân cơ bản.",
      image: "https://example.com/math-drill.jpg",
      questionIds: [3], // Directly referencing question IDs
      category: ["Toán học"],
      enableStorage: true, // Bật tính năng lưu trữ cho bài kiểm tra này
    },
  ]
  
  export const otherContentItems: OtherContent[] = [
    {
      id: 1,
      title: "10 Mẹo Học tập Hàng đầu để Thành công trong Kỳ thi",
      description: "Nâng cao hiệu suất thi của bạn với những mẹo được chuyên gia hỗ trợ.",
      image: "https://example.com/study-tips.jpg",
      type: "Bài viết",
    },
    {
      id: 2,
      title: "Hệ Mặt trời Hoạt động Như thế nào",
      description: "Phân tích trực quan về các hành tinh và quỹ đạo của chúng.",
      image: "https://example.com/solar-system.jpg",
      type: "Video",
    },
  ]
  
  export const sections: Section[] = [
    {
      id: 1,
      title: "GPLX A1",
      description: "Khám phá các chủ đề khác nhau.",
      image: "https://example.com/general-knowledge.jpg",
      quizLists: [globalQuizLists[1], globalQuizLists[0], globalQuizLists[3]], // Each quizList is now a list of questions
      otherContent: [otherContentItems[0]],
      // exams are now represented within quizLists using the isExam flag
    },
    {
      id: 2,
      title: "GPLX A2",
      description: "Khám phá các chủ đề khác nhau 2.",
      image: "https://example.com/exam-prep.jpg",
      quizLists: [globalQuizLists[0], globalQuizLists[2]], // Each quizList is now a list of questions
      otherContent: [otherContentItems[1]],
      // exams are now represented within quizLists using the isExam flag
    },
  ]
  