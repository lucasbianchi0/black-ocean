import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['200', '300', '400'],
  variable: '--font-inter',
  display: 'swap',
})

const BASE = 'https://oceanblack.com.ar'

export const metadata = {
  metadataBase: new URL(BASE),

  title: {
    default: 'Ocean Black & Co. — Ecosistema Empresarial Estratégico',
    template: '%s | Ocean Black & Co.',
  },
  description:
    'Ocean Black & Co. desarrolla soluciones estratégicas para empresas, empresarios y organizaciones en Argentina y Latinoamérica. Estructura, resolución y conexiones orientadas al crecimiento.',
  keywords: [
    'consultoría empresarial',
    'ecosistema empresarial',
    'estrategia corporativa',
    'Buenos Aires',
    'Argentina',
    'soluciones estratégicas',
    'desarrollo empresarial',
    'expansión corporativa',
    'finanzas corporativas',
    'legal empresarial',
    'tecnología empresarial',
    'Ocean Black',
    'Latinoamérica',
  ],
  authors: [{ name: 'Ocean Black & Co.', url: BASE }],
  creator: 'Ocean Black & Co.',
  publisher: 'Ocean Black & Co.',
  category: 'business',

  alternates: {
    canonical: BASE,
    languages: {
      'es-AR': BASE,
      'pt-BR': BASE,
      'en-US': BASE,
    },
  },

  openGraph: {
    type: 'website',
    locale: 'es_AR',
    alternateLocale: ['pt_BR', 'en_US'],
    url: BASE,
    siteName: 'Ocean Black & Co.',
    title: 'Ocean Black & Co. — Ecosistema Empresarial Estratégico',
    description:
      'Soluciones estratégicas para compañías que requieren estructura, resolución, capacidad operativa y expansión en el mercado latinoamericano.',
    images: [
      {
        url: `${BASE}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Ocean Black & Co. — Ecosistema Empresarial Estratégico',
        type: 'image/jpeg',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Ocean Black & Co. — Ecosistema Empresarial Estratégico',
    description:
      'Soluciones estratégicas para compañías que requieren estructura, resolución, capacidad operativa y expansión.',
    images: [`${BASE}/og-image.jpg`],
    creator: '@oceanblack_co',
    site: '@oceanblack_co',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },

  manifest: '/manifest.json',

  other: {
    'geo.region': 'AR-C',
    'geo.placename': 'Buenos Aires',
    'geo.position': '-34.6037;-58.3816',
    'ICBM': '-34.6037, -58.3816',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BASE}/#organization`,
      name: 'Ocean Black & Co.',
      url: BASE,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE}/logo.jpg`,
        width: 1080,
        height: 1080,
      },
      image: `${BASE}/og-image.jpg`,
      description:
        'Ecosistema empresarial estratégico que integra soluciones de consultoría, finanzas, legal, tecnología y expansión para empresas en Argentina y Latinoamérica.',
      location: {
        '@type': 'Place',
        name: 'Buenos Aires, Argentina',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Buenos Aires',
          addressCountry: 'AR',
        },
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          email: 'contacto@oceanblack.com.ar',
          contactType: 'customer service',
          availableLanguage: ['Spanish', 'Portuguese', 'English'],
          areaServed: ['AR', 'BR', 'UY', 'CL', 'CO', 'MX'],
        },
      ],
      sameAs: ['https://www.instagram.com/oceanblack.co/'],
      knowsAbout: [
        'Estrategia Empresarial',
        'Consultoría Corporativa',
        'Finanzas Corporativas',
        'Asesoría Legal',
        'Tecnología Empresarial',
        'Real Estate Corporativo',
        'Desarrollo de Negocios',
      ],
      areaServed: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: -34.6037,
          longitude: -58.3816,
        },
        name: 'Latinoamérica',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE}/#website`,
      url: BASE,
      name: 'Ocean Black & Co.',
      publisher: { '@id': `${BASE}/#organization` },
      inLanguage: ['es-AR', 'pt-BR', 'en-US'],
    },
    {
      '@type': 'WebPage',
      '@id': `${BASE}/#webpage`,
      url: BASE,
      name: 'Ocean Black & Co. — Ecosistema Empresarial Estratégico',
      isPartOf: { '@id': `${BASE}/#website` },
      about: { '@id': `${BASE}/#organization` },
      description:
        'Soluciones estratégicas para compañías que requieren estructura, resolución, capacidad operativa y expansión en el mercado latinoamericano.',
      inLanguage: 'es-AR',
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Inicio',
            item: BASE,
          },
        ],
      },
    },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
