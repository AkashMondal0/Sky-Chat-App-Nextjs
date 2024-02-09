import { getCookie } from 'cookies-next'
import { NextResponse, NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(req: NextRequest, res: NextResponse) {
    const token = getCookie('token', { req, res })
    const url = req.nextUrl.clone()
    url.pathname = '/auth/login'

    switch (req.nextUrl.pathname) {
        case '/':
            if (!token) {
                return NextResponse.redirect(url.toString())
            }
            break
        case '/auth/login':
            if (token) {
                return NextResponse.redirect('/')
            }
            break
        case '/auth/register':
            if (token) {
                return NextResponse.redirect('/')
            }
            break
    }
}

export const config = {
    matcher: ["/", "/auth/login", "/auth/register"],
}