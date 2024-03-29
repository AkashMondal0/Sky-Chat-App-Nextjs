"use client";
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/provider/Theme_Provider'
import { cn } from '@/lib/utils'
import { Provider } from 'react-redux'
import { store } from '../redux/store'
import { ProfileProvider } from '@/components/provider/Profile_provider';
import { Toaster } from "@/components/ui/sonner"
import NextAuth_Provider from '@/components/provider/NextAuthJs';
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
          <NextAuth_Provider>
            <Provider store={store}>
              <Toaster position="top-center" closeButton />
              <ProfileProvider>
                {children}
              </ProfileProvider>
            </Provider>
          </NextAuth_Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}
