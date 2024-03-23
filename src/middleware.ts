import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: '/auth/login',
    error: '/error',
  }
})

export const config = {
  matcher: [
    "/",
    "/form/:path*",
    "/docs/:path*",
    "/game/:path*",
    "/(home)/:path*",
  ]
}