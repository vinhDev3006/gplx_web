import Link from "next/link"
import Image from "next/image"
import { sections } from "@/lib/data"
import { notFound } from "next/navigation"

export default function SectionPage({ params }: { params: { sectionId: string } }) {
  const sectionId = Number.parseInt(params.sectionId)
  const section = sections.find((s) => s.id === sectionId)

  if (!section) {
    notFound()
  }

  // Separate regular quizzes and exams
  const regularQuizzes = section.quizLists.filter((quiz) => !quiz.isExam)
  const exams = section.quizLists.filter((quiz) => quiz.isExam)

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Quay lại trang chủ
          </Link>

          <div className="relative h-72 w-full rounded-xl overflow-hidden mb-6 shadow-lg">
            <Image
              src={section.image.replace(/\[|\]|$|$/g, "") || "/placeholder.svg?height=400&width=800"}
              alt={section.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
              <div className="p-8 text-white">
                <h1 className="text-4xl font-bold mb-2">{section.title}</h1>
                <p className="text-lg opacity-90">{section.description}</p>
              </div>
            </div>
          </div>
        </div>

        {regularQuizzes.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Bài kiểm tra</h2>
              <div className="ml-4 h-1 bg-blue-600 flex-grow rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularQuizzes.map((quiz) => (
                <Link key={quiz.id} href={`/section/${sectionId}/quiz/${quiz.id}`} className="block group">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100 h-full flex flex-col">
                    <div className="relative h-44 w-full">
                      <Image
                        src={quiz.image.replace(/\[|\]|$|$/g, "") || "/placeholder.svg?height=300&width=500"}
                        alt={quiz.title}
                        fill
                        className="object-cover"
                      />
                      {quiz.enableStorage && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full border border-green-400">
                            Lưu tiến trình
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                        {quiz.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 flex-grow">{quiz.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          {quiz.questionIds.length} Câu hỏi
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {exams.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Bài thi</h2>
              <div className="ml-4 h-1 bg-yellow-500 flex-grow rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam) => (
                <Link key={exam.id} href={`/section/${sectionId}/exam/${exam.id}`} className="block group">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-yellow-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
                    <div className="relative h-44 w-full">
                      <Image
                        src={exam.image.replace(/\[|\]|$|$/g, "") || "/placeholder.svg?height=300&width=500"}
                        alt={exam.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm font-bold shadow-sm">
                          BÀI THI
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                        {exam.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 flex-grow">{exam.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          {exam.questionIds.length} Câu hỏi
                        </span>
                        {exam.timeLimit && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
                            {exam.timeLimit} phút
                          </span>
                        )}
                        {exam.passPercentage && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                            Đạt: {exam.passPercentage}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {section.otherContent.length > 0 && (
          <section>
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Tài liệu khác</h2>
              <div className="ml-4 h-1 bg-gray-400 flex-grow rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.otherContent.map((content) => (
                <div
                  key={content.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="relative h-44 w-full">
                    <Image
                      src={content.image.replace(/\[|\]|$|$/g, "") || "/placeholder.svg?height=300&width=500"}
                      alt={content.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-gray-800 text-white px-3 py-1 rounded-md text-xs font-medium">
                        {content.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{content.title}</h3>
                    <p className="text-gray-600 text-sm">{content.description}</p>
                    <button className="mt-4 text-blue-600 font-medium hover:underline flex items-center">
                      Xem chi tiết
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
