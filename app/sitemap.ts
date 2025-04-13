import type { MetadataRoute } from "next"
import { sections } from "@/lib/data"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://nentanghoctap.vn"

  // Base routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ]

  // Section routes
  const sectionRoutes = sections.map((section) => ({
    url: `${baseUrl}/section/${section.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  // Quiz and exam routes
  const contentRoutes = sections.flatMap((section) =>
    section.quizLists.map((quiz) => ({
      url: `${baseUrl}/section/${section.id}/${quiz.isExam ? "exam" : "quiz"}/${quiz.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  )

  return [...routes, ...sectionRoutes, ...contentRoutes]
}