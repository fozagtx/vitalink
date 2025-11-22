import type { Metadata } from 'next'
// import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import MedicalChatBot from '@/components/MedicalChatBot'

// const _geist = Geist({ subsets: ["latin"] });
// const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Mentoxy - Your Path to Mental Wellness',
  description: 'Science-backed mental wellness platform. Track your emotional well-being, sleep patterns, and mental health with personalized insights.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Aggressively hide v0.dev elements */
            iframe[src*="v0"], iframe[src*="vercel"], [class*="vercel-"], [class*="v0-"], div[style*="position: fixed"][style*="bottom: 0"][style*="left: 0"] { display: none !important; opacity: 0 !important; visibility: hidden !important; }
          `
        }} />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <MedicalChatBot />
      </body>
    </html>
  )
}
