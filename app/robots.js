export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://oceanblack.com.ar/sitemap.xml',
    host: 'https://oceanblack.com.ar',
  }
}
