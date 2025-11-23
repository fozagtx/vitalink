import type { Metadata } from 'next'
// import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import MedicalChatBot from '@/components/MedicalChatBot'

// const _geist = Geist({ subsets: ["latin"] });
// const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'VitalView AI - Your Medical Health Analysis Platform',
  description: 'AI-powered medical report analysis, health metrics tracking, and personalized health insights. Upload medical documents, track BMI, and find nearby care facilities.',
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
