const BASE = 'https://oceanblack.com.ar'

export default function sitemap() {
  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      images: [`${BASE}/og-image.jpg`],
    },
  ]
}
