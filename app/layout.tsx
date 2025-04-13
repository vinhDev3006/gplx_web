import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nền tảng học tập | Kiểm tra kiến thức và chuẩn bị cho kỳ thi",
  description:
    "Nền tảng học tập toàn diện với các bài kiểm tra, bài thi và tài liệu học tập cho nhiều lĩnh vực khác nhau. Chuẩn bị cho kỳ thi GPLX A1, A2 và nhiều hơn nữa.",
  keywords: "học tập, kiểm tra, bài thi, GPLX, A1, A2, giấy phép lái xe, trắc nghiệm, ôn thi",
  authors: [{ name: "Nền tảng học tập" }],
  creator: "Nền tảng học tập",
  publisher: "Nền tảng học tập",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://nentanghoctap.vn",
    title: "Nền tảng học tập | Kiểm tra kiến thức và chuẩn bị cho kỳ thi",
    description:
      "Nền tảng học tập toàn diện với các bài kiểm tra, bài thi và tài liệu học tập cho nhiều lĩnh vực khác nhau.",
    siteName: "Nền tảng học tập",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nền tảng học tập",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nền tảng học tập | Kiểm tra kiến thức và chuẩn bị cho kỳ thi",
    description:
      "Nền tảng học tập toàn diện với các bài kiểm tra, bài thi và tài liệu học tập cho nhiều lĩnh vực khác nhau.",
    images: ["/og-image.jpg"],
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  alternates: {
    canonical: "https://nentanghoctap.vn",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.className} min-h-screen bg-background`}>
        <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-600 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 mr-2"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              Nền tảng học tập
            </Link>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link
                    href="/"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                  >
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                  >
                    Giới thiệu
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="bg-gradient-to-b from-blue-50 via-white to-blue-50 min-h-screen">{children}</main>

        <footer className="bg-white border-t py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-800">Nền tảng học tập</h3>
                <p className="text-gray-600 mb-4">
                  Nền tảng học tập toàn diện với các bài kiểm tra, bài thi và tài liệu học tập cho nhiều lĩnh vực khác
                  nhau.
                </p>
                <div className="flex space-x-4">
                  <a href="#" aria-label="Facebook" className="text-blue-600 hover:text-blue-800">
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
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  <a href="#" aria-label="Twitter" className="text-blue-600 hover:text-blue-800">
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
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </a>
                  <a href="#" aria-label="Instagram" className="text-blue-600 hover:text-blue-800">
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
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-800">Liên kết nhanh</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                      Trang chủ
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                      Giới thiệu
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                      Điều khoản sử dụng
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                      Chính sách bảo mật
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-800">Liên hệ</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-blue-600 mt-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span className="text-gray-600">123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-blue-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span className="text-gray-600">+84 123 456 789</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-blue-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <a
                      href="mailto:support@nentanghoctap.vn"
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      support@nentanghoctap.vn
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t mt-8 pt-8 text-center text-gray-600 text-sm">
              <p>© {new Date().getFullYear()} Nền tảng học tập. Đã đăng ký bản quyền.</p>
            </div>
          </div>
        </footer>

        {/* Structured data for SEO */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Nền tảng học tập",
              url: "https://nentanghoctap.vn",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://nentanghoctap.vn/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </body>
    </html>
  )
}
