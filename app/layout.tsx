import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nền tảng học tập",
  description: "Nền tảng học tập và kiểm tra toàn diện",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.className} min-h-screen bg-background`}>
        <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Nền tảng học tập
            </Link>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium">
                    Giới thiệu
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="bg-gray-50 min-h-screen">{children}</main>

        <footer className="bg-white border-t py-8">
          <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
            <p>© {new Date().getFullYear()} Nền tảng học tập. Đã đăng ký bản quyền.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
