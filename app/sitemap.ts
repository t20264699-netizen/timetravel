import { MetadataRoute } from 'next'
import { cities } from '@/data/cities'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://timetravel-is48.vercel.app')

  const staticPages = [
    '',
    '/alarm',
    '/timer',
    '/stopwatch',
    '/world-clock',
    '/privacy',
    '/terms',
    '/contact',
  ]

  const cityPages = cities.map((city) => ({
    url: `${baseUrl}/time/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  const embedPages = ['alarm', 'timer', 'stopwatch', 'world-clock'].map((tool) => ({
    url: `${baseUrl}/embed/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...staticPages.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: path === '' ? ('daily' as const) : ('weekly' as const),
      priority: path === '' ? 1 : 0.9,
    })),
    ...cityPages,
    ...embedPages,
  ]
}
