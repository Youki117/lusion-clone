import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LoadingProvider } from '@/components/providers/LoadingProvider'
import { TransitionProvider } from '@/components/providers/TransitionProvider'
import { UserProvider } from '@/components/providers/UserProvider'
import { AIProvider } from '@/components/providers/AIProvider'
import { KnowledgeGraphProvider } from '@/components/providers/KnowledgeGraphProvider'
import { ErrorBoundary } from '@/components/providers/ErrorBoundary'

import { LoadingWrapper } from '@/components/ui/LoadingWrapper'
import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { StarfieldBackground } from '@/components/ui/StarfieldBackground'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: 'Lusion - Realise Your Creative Ideas',
  description: 'Lusion is a digital production studio that brings your ideas to life through visually captivating designs and interactive experiences.',
  icons: {
    icon: '/favicon.svg',
  },
  keywords: ['digital studio', 'creative agency', 'web design', 'interactive experiences', '3D design'],
  authors: [{ name: 'Lusion Creative Studio' }],
  creator: 'Lusion',
  publisher: 'Lusion',
  openGraph: {
    title: 'Lusion - Realise Your Creative Ideas',
    description: 'Digital production studio creating visually captivating designs and interactive experiences.',
    url: 'https://lusion.co',
    siteName: 'Lusion',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lusion Creative Studio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lusion - Realise Your Creative Ideas',
    description: 'Digital production studio creating visually captivating designs and interactive experiences.',
    creator: '@lusionltd',
    images: ['/og-image.jpg'],
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
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <ErrorBoundary>
          <LoadingProvider>
            <TransitionProvider>
              <UserProvider>
                <AIProvider>
                  <KnowledgeGraphProvider>
                    <LoadingWrapper>
                      <StarfieldBackground />
                      <ScrollProgress />
                      <Header />
                      <main className="min-h-screen relative">
                        {children}
                      </main>
                      <Footer />
                    </LoadingWrapper>
                  </KnowledgeGraphProvider>
                </AIProvider>
              </UserProvider>
            </TransitionProvider>
          </LoadingProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
