import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-6 inline-flex items-center font-medium">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Quay lại trang chủ
        </Link>

        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Về nền tảng học tập của chúng tôi</h1>

            <p className="text-gray-700">
              Chào mừng bạn đến với nền tảng học tập của chúng tôi, một công cụ học tập toàn diện được thiết kế để giúp
              bạn kiểm tra và cải thiện kiến thức của mình trong nhiều lĩnh vực khác nhau.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Sứ mệnh của chúng tôi</h2>

            <p className="text-gray-700">
              Sứ mệnh của chúng tôi là cung cấp một trải nghiệm học tập hấp dẫn và hiệu quả thông qua các bài kiểm tra
              và bài thi tương tác. Chúng tôi tin rằng việc kiểm tra tích cực là một trong những cách mạnh mẽ nhất để
              củng cố kiến thức và xác định các lĩnh vực cần cải thiện.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Tính năng</h2>

            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Nội dung đa dạng:</strong> Truy cập các bài kiểm tra trên nhiều chủ đề và cấp độ khó khác nhau.
              </li>
              <li>
                <strong>Mô phỏng bài thi:</strong> Luyện tập với các bài thi có giới hạn thời gian mô phỏng điều kiện
                thi thực tế.
              </li>
              <li>
                <strong>Theo dõi tiến trình:</strong> Theo dõi hiệu suất của bạn và xem sự tiến bộ của bạn theo thời
                gian.
              </li>
              <li>
                <strong>Tài liệu bổ sung:</strong> Truy cập các bài viết, video và các tài liệu học tập khác để nâng cao
                hiểu biết của bạn.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Cách sử dụng</h2>

            <ol className="list-decimal pl-6 space-y-2 text-gray-700">
              <li>Duyệt qua các phần học để tìm chủ đề bạn quan tâm.</li>
              <li>Làm các bài kiểm tra thực hành để kiểm tra kiến thức của bạn trong môi trường ít áp lực.</li>
              <li>Khi bạn đã sẵn sàng, thử thách bản thân với các bài thi có giới hạn thời gian.</li>
              <li>Xem lại kết quả của bạn để xác định điểm mạnh và các lĩnh vực cần cải thiện.</li>
              <li>Khám phá các tài liệu bổ sung của chúng tôi để nâng cao việc học tập của bạn.</li>
            </ol>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Liên hệ với chúng tôi</h2>

            <p className="text-gray-700">
              Bạn có câu hỏi, đề xuất hoặc phản hồi? Chúng tôi rất muốn nghe từ bạn! Liên hệ với chúng tôi tại{" "}
              <a href="mailto:support@quizplatform.com" className="text-blue-600 hover:underline">
                support@quizplatform.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
