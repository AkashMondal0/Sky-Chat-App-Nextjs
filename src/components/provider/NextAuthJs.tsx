'use client'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

const NextAuth_Provider = ({
    children
}:{
    children: React.ReactNode
}) => {
  return (
    <SessionProvider>
        {children}
    </SessionProvider>
  )
}

export default NextAuth_Provider
