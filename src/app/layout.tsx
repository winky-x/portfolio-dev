import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fluxfolio - Full-Stack Developer & UI/UX Designer',
  description: 'Building modern web applications with cutting-edge technologies. Specializing in React, Next.js, and cloud solutions.',
  keywords: ['Full-Stack Developer', 'UI/UX Designer', 'React', 'Next.js', 'TypeScript', 'Web Development', 'Portfolio'],
  authors: [{ name: 'Fluxfolio Developer' }],
  creator: 'Fluxfolio Developer',
  publisher: 'Fluxfolio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://your-domain.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    title: 'Fluxfolio - Full-Stack Developer & UI/UX Designer',
    description: 'Building modern web applications with cutting-edge technologies. Specializing in React, Next.js, and cloud solutions.',
    siteName: 'Fluxfolio',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fluxfolio - Full-Stack Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fluxfolio - Full-Stack Developer & UI/UX Designer',
    description: 'Building modern web applications with cutting-edge technologies. Specializing in React, Next.js, and cloud solutions.',
    images: ['/images/og-image.jpg'],
    creator: '@yourusername',
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
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Fluxfolio Developer",
              "jobTitle": "Full-Stack Developer & UI/UX Designer",
              "description": "Building modern web applications with cutting-edge technologies",
              "url": "https://your-domain.com",
              "sameAs": [
                "https://github.com/username",
                "https://linkedin.com/in/username",
                "https://twitter.com/username"
              ],
              "knowsAbout": [
                "React", "Next.js", "TypeScript", "Node.js", "Web Development", "UI/UX Design"
              ],
              "worksFor": {
                "@type": "Organization",
                "name": "Freelance"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
