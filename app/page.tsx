import Link from "next/link"
import Image from "next/image"
import { sections } from "@/lib/data"

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      {/* REMOVED overflow-hidden from here V */}
      <section className="relative bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
        {/* Background elements */}
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-5"></div>

        {/* Increased py-20 md:py-28 TO py-24 md:py-32 V */}
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              Nâng cao kiến thức của bạn với các bài kiểm tra tương tác
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Chuẩn bị cho kỳ thi của bạn với nền tảng học tập toàn diện
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Button 1: Khám phá ngay */}
              <Link
                href="#sections" // Make sure this ID exists on your Features Section or relevant target
                className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
              >
                <span>Khám phá ngay</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v10.586l3.293-3.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </Link>
              {/* Button 2: Tìm hiểu thêm */}
              <Link
                href="/about"
                className="bg-transparent hover:bg-white/20 border-2 border-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 flex items-center justify-center"
              >
                <span>Tìm hiểu thêm</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating stats - position remains the same relative to the section edge */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl z-20">
          <div className="bg-white rounded-lg shadow-xl p-6 grid grid-cols-3 gap-6">
            {/* Stats content... */}
                <div className="text-center">
                    <p className="text-blue-700 text-3xl font-bold">1000+</p>
                    <p className="text-gray-600">Bài kiểm tra</p>
                </div>
                <div className="text-center border-x border-gray-200">
                    <p className="text-blue-700 text-3xl font-bold">15K+</p>
                    <p className="text-gray-600">Học viên</p>
                </div>
                <div className="text-center">
                    <p className="text-blue-700 text-3xl font-bold">98%</p>
                    <p className="text-gray-600">Tỷ lệ đỗ</p>
                </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="sections" className="pt-32 pb-24 bg-white"> {/* Added id="sections" */}
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Tại sao chọn nền tảng của chúng tôi?</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Một nền tảng học tập được thiết kế để đáp ứng mọi nhu cầu và giúp bạn đạt được kết quả tốt nhất
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-blue-50 rounded-xl p-8 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-blue-100">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Nội dung chất lượng cao</h3>
              <p className="text-gray-600">
                Các bài kiểm tra và bài thi được thiết kế bởi các chuyên gia trong lĩnh vực, đảm bảo tính chính xác và
                cập nhật với đề thi thực tế.
              </p>
            </div>
            {/* Feature Card 2 */}
            <div className="bg-blue-50 rounded-xl p-8 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-blue-100">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Tiết kiệm thời gian</h3>
              <p className="text-gray-600">
                Học tập hiệu quả với các bài kiểm tra ngắn, tập trung vào những điểm quan trọng nhất giúp tiết kiệm thời gian ôn tập.
              </p>
            </div>
            {/* Feature Card 3 */}
            <div className="bg-blue-50 rounded-xl p-8 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-blue-100">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Theo dõi tiến độ</h3>
              <p className="text-gray-600">
                Theo dõi sự tiến bộ của bạn và xác định các lĩnh vực cần cải thiện với các báo cáo chi tiết và biểu đồ trực quan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Sections */}
      <section id="sections" className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-medium bg-blue-100 rounded-full px-4 py-1 inline-block mb-3">Danh mục học tập</span>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Khám phá các phần học</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chọn một trong các phần học dưới đây để bắt đầu hành trình học tập của bạn và làm quen với kiến thức mới
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section) => (
              <Link key={section.id} href={`/section/${section.id}`} className="block group">
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-100 h-full flex flex-col">
                  <div className="relative h-56 w-full">
                    <Image
                      src={section.image.replace(/\[|\]|$|$/g, "") || "/placeholder.svg?height=400&width=600"}
                      alt={section.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-5 text-white w-full">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium bg-blue-600 rounded-full px-3 py-1 inline-block mb-2 shadow-md">
                          {section.quizLists.length} bài học
                        </div>
                        <div className="text-sm font-medium bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 inline-block mb-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 inline mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          5.2K
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                      {section.title}
                    </h2>
                    <p className="text-gray-600 mb-4 flex-grow">{section.description}</p>
                    <div className="mt-auto flex justify-between items-center">
                      <div className="flex -space-x-2">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-xs font-medium text-white"
                          >
                            {i + 1}
                          </div>
                        ))}
                      </div>
                      <span className="text-blue-600 font-medium flex items-center transform group-hover:translate-x-1 transition-transform">
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
          
          <div className="text-center mt-12">
            <Link
              href="/all-sections"
              className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
            >
              Xem tất cả các phần 
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
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-medium bg-blue-100 rounded-full px-4 py-1 inline-block mb-3">Đánh giá</span>
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Người dùng nói gì về chúng tôi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá câu chuyện thành công từ học viên đã sử dụng nền tảng của chúng tôi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Nguyễn Văn A",
                role: "Học viên",
                content:
                  "Nền tảng học tập này đã giúp tôi đạt điểm cao trong kỳ thi GPLX A1. Các bài kiểm tra rất sát với đề thi thực tế.",
                avatar: "/placeholder.svg?height=100&width=100",
              },
              {
                name: "Trần Thị B",
                role: "Giáo viên",
                content:
                  "Tôi thường xuyên giới thiệu nền tảng này cho học viên của mình. Nội dung chất lượng và cách trình bày dễ hiểu.",
                avatar: "/placeholder.svg?height=100&width=100",
                featured: true,
              },
              {
                name: "Lê Văn C",
                role: "Học viên",
                content:
                  "Tính năng lưu tiến độ rất hữu ích, giúp tôi có thể học mọi lúc mọi nơi mà không lo mất dữ liệu.",
                avatar: "/placeholder.svg?height=100&width=100",
              },
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className={`bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  testimonial.featured ? 'border-2 border-blue-400 md:transform md:-translate-y-4' : 'border border-gray-100'
                }`}
              >
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-blue-100">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={56}
                      height={56}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
                <div className="mt-4 flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/testimonials" className="text-blue-600 font-medium hover:text-blue-800 transition-colors inline-flex items-center">
              Xem tất cả đánh giá
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
            </Link>
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h2 className="text-3xl font-bold text-white mb-4">Học mọi lúc, mọi nơi</h2>
              <p className="text-blue-100 mb-6">
                Tải ứng dụng của chúng tôi để học tập mọi lúc mọi nơi. Có sẵn trên iOS và Android.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="#" className="bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center">
                  <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5227 7.39069V8.92676C17.5227 9.31761 17.3347 9.48276 16.9471 9.48276H15.7232V17.2468C15.7232 17.5854 15.5352 17.7505 15.1476 17.7505H13.327V9.51531H12.103V17.7505H10.2824C9.89481 17.7505 9.70681 17.5854 9.70681 17.2468V9.51531H8.48293V9.48276H7.25905C6.87149 9.48276 6.68349 9.31761 6.68349 8.92676V7.39069C6.68349 6.99984 6.87149 6.83467 7.25905 6.83467H8.91761L10.0066 4.00062C10.1603 3.60976 10.4773 3.44461 10.8649 3.44461H12.5671C12.9547 3.44461 13.2717 3.60976 13.4254 4.00062L14.5144 6.83467H16.9471C17.3347 6.83467 17.5227 6.99984 17.5227 7.39069Z" fill="white"/>
                  </svg>
                  <div>
                    <div className="text-xs">Tải về trên</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </Link>
                <Link href="#" className="bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center">
                  <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.57376 3.59624C3.25376 3.92791 3.07959 4.45457 3.07959 5.13124V18.8729C3.07959 19.5496 3.25376 20.0762 3.57376 20.4079L3.67376 20.4996L12.5738 11.6079V11.3962L3.67376 2.50457L3.57376 3.59624Z" fill="#87CEAC"/>
                    <path d="M16.4071 15.4587L12.5738 11.6254V11.3921L16.4071 7.55873L16.5238 7.63373L21.1071 10.1837C22.5238 11.0004 22.5238 12.0337 21.1071 12.8504L16.5238 15.4004L16.4071 15.4587Z" fill="#F8BC42"/>
                    <path d="M16.5236 15.4004L12.5736 11.4004L3.57361 20.4004C4.07361 20.9171 4.90694 20.9754 5.82361 20.4754L16.5236 15.4004Z" fill="#EA4335"/>
                    <path d="M16.5236 7.58365L5.82361 2.50866C4.90694 2.00866 4.07361 2.06699 3.57361 2.58366L12.5736 11.5837L16.5236 7.58365Z" fill="#547DBE"/>
                  </svg>
                  <div>
                    <div className="text-xs">Tải về trên</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-64 h-96">
                <div className="absolute z-10 w-56 h-80 border-8 border-black rounded-3xl overflow-hidden bg-black transform rotate-3">
                  <Image 
                    src="/placeholder.svg?height=600&width=320" 
                    alt="Mobile app screenshot"
                    className="object-cover"
                    fill
                  />
                </div>
                <div className="absolute w-56 h-80 border-8 border-black rounded-3xl overflow-hidden bg-black transform -rotate-3 translate-x-8 translate-y-8">
                  <Image 
                    src="/placeholder.svg?height=600&width=320" 
                    alt="Mobile app screenshot"
                    className="object-cover"
                    fill
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Sẵn sàng để bắt đầu học tập?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Hãy bắt đầu hành trình học tập của bạn ngay hôm nay và chuẩn bị tốt nhất cho kỳ thi sắp tới.
          </p>
          <Link
            href="#sections"
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full font-medium text-lg transition-colors duration-300 shadow-lg hover:shadow-xl inline-block"
          >
            Bắt đầu ngay
          </Link>
        </div>
      </section>
    </>
  )
}
