"use client";
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/provider/Theme_Provider'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'
import { Provider } from 'react-redux'
import { store } from '../redux/store'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}
      className={cn(inter.className,
        "transition-all animate-in delay-75 duration-150")}>
        <ThemeProvider
          defaultTheme="system"
          enableSystem
          attribute='class'
          storageKey="theme">
            <Provider store={store}>
              <Toaster />
              {children}
            </Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}
