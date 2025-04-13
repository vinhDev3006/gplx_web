import Link from "next/link"
import Image from "next/image"
import { sections } from "@/lib/data"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

type Props = {
  params: { sectionId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sectionId = Number.parseInt(params.sectionId)
  const section = sections.find((s) => s.id === sectionId)

  if (!section) {
    return {
      title: "Không tìm thấy phần học | Nền tảng học tập",
      description: "Phần học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.",
    }
  }

  return {
    title: `${section.title} | Nền tảng học tập`,
    description: `Khám phá ${section.title} với các bài kiểm tra và bài thi tương tác. ${section.description}`,
    keywords: `${section.title}, học tập, kiểm tra, bài thi, GPLX, trắc nghiệm, ôn thi`,
    openGraph: {
      title: `${section.title} | Nền tảng học tập`,
      description: section.description,
      images: [
        {
          url: section.image.replace(/\[|\]|$|$/g, "") || "/placeholder.svg?height=400&width=800",
          width: 800,
          height: 400,
          alt: section.title,
        },
      ],
    },
  }
}

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
        {/* Hero Section */}
        <div className="mb-12">
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="text-blue-600 hover:text-blue-800 inline-flex items-center font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Trang chủ
                </Link>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-1 text-gray-500 md:ml-2 font-medium">{section.title}</span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="relative h-80 w-full rounded-xl overflow-hidden mb-6 shadow-lg">
            <Image
              src={section.image.replace(/\[|\]|$|$/g, "") || "/placeholder.svg?height=400&width=800"}
              alt={section.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
              <div className="p-8 text-white">
                <h1 className="text-4xl font-bold mb-2">{section.title}</h1>
                <p className="text-lg opacity-90 max-w-2xl">{section.description}</p>
                <div className="flex items-center mt-4">
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium mr-3">
                    {section.quizLists.length} bài học
                  </div>
                  <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {exams.length} bài thi
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {regularQuizzes.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center mb-8">
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
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      {quiz.enableStorage && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full border border-green-400 shadow-sm">
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
                      <div className="flex flex-wrap gap-2 mt-auto">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {quiz.questionIds.length} Câu hỏi
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                          </svg>
                          Luyện tập
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
          <section className="mb-16">
            <div className="flex items-center mb-8">
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
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
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
                      <div className="flex flex-wrap gap-2 mt-auto">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {exam.questionIds.length} Câu hỏi
                        </span>
                        {exam.timeLimit && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {exam.timeLimit} phút
                          </span>
                        )}
                        {exam.passPercentage && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
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
            <div className="flex items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Tài liệu khác</h2>
              <div className="ml-4 h-1 bg-gray-400 flex-grow rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.otherContent.map((content) => (
                <div
                  key={content.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="relative h-44 w-full">
                    <Image
                      src={content.image.replace(/\[|\]|$|$/g, "") || "/placeholder.svg?height=300&width=500"}
                      alt={content.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-gray-800 text-white px-3 py-1 rounded-md text-xs font-medium shadow-sm">
                        {content.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{content.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{content.description}</p>
                    <button className="mt-2 text-blue-600 font-medium hover:underline flex items-center">
                      Xem chi tiết
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform"
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
