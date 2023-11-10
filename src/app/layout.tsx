import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/provider/Theme_Provider'
import { cn } from '@/lib/utils'
import React_Query from '@/components/provider/React-Query_Provider'
import { Metadata } from 'next'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={cn(inter.className,
        "transition-all animate-in delay-75 duration-150")}>
        <ThemeProvider
          defaultTheme="system"
          enableSystem
          attribute='class'
          storageKey="theme">
          <React_Query>
              <Toaster />
              {children}
          </React_Query>
        </ThemeProvider>
      </body>
    </html>
  )
}
