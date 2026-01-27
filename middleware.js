import { NextResponse } from 'next/server';

export function middleware(request) {
    // Get the userId from the cookies
    const userId = request.cookies.get('userId')?.value;

    // Only redirect if we are exactly at the root path AND have a user ID
    if (request.nextUrl.pathname === '/' && userId) {
        return NextResponse.redirect(new URL('/main', request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Only run this middleware on the root path
    matcher: '/',
};
