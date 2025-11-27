/**
 * Root Layout Component
 * Provides the main structure for the entire application
 * Includes metadata, theme configuration, and global providers
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'CRM Pro - Customer Relationship Management',
    template: '%s | CRM Pro',
  },
  description: 'Professional CRM solution with calling integration, contact management, and deal tracking',
  keywords: ['CRM', 'Sales', 'Contact Management', 'Deal Tracking', 'Calling'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'http://localhost:3000',
    siteName: 'CRM Pro',
    title: 'CRM Pro - Customer Relationship Management',
    description: 'Professional CRM solution with calling integration',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CRM Pro',
    description: 'Professional CRM solution with calling integration',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
          {children}
        </div>
      </body>
    </html>
  )
}
