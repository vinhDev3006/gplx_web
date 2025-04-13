import Link from "next/link"
import Image from "next/image"
import { sections } from "@/lib/data"

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">Nền tảng học tập</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nâng cao kiến thức của bạn với các bài kiểm tra và bài thi tương tác
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section) => (
            <Link key={section.id} href={`/section/${section.id}`} className="block group">
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
                <div className="relative h-52 w-full">
                  <Image
                    src={section.image.replace(/\[|\]|$|$/g, "") || "/placeholder.svg?height=400&width=600"}
                    alt={section.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <div className="text-sm font-medium bg-blue-600 rounded-full px-3 py-1 inline-block mb-2">
                      {section.quizLists.length} bài học
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                    {section.title}
                  </h2>
                  <p className="text-gray-600">{section.description}</p>
                  <div className="mt-4 flex justify-end">
                    <span className="text-blue-600 font-medium group-hover:underline flex items-center">
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
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
