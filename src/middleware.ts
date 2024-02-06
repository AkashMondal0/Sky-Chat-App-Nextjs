import { getCookie } from 'cookies-next'
import { NextResponse, NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(req: NextRequest, res: NextResponse) {
    const token = getCookie('profile', { req, res })
    const url = req.nextUrl.clone()
    url.pathname = '/auth/login'

    if (!token) {
        return NextResponse.next()
    }
    else {
        return NextResponse.redirect(url)
    }
}

export const config = {
    matcher: ["/"],
}