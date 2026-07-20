import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TaallamGo - Apprenez sans frontières, payez en dinars',
  description: 'Accédez légalement aux meilleures formations mondiales et payez en dinars algériens',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" dir="ltr">
      <body className="bg-white text-gray-900">
        {children}
      </body>
    </html>
  )
}
