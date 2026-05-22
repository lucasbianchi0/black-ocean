import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
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

export const metadata = {
  title: 'Ocean Black & Co. — Ecosistema Empresarial Estratégico',
  description: 'OCEAN BLACK & CO. desarrolla soluciones estratégicas para empresas, empresarios y organizaciones. Estructura, resolución y conexiones orientadas al crecimiento.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${inter.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
