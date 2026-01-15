import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    if (process.env.NODE_ENV === "development") {
        console.log("⏩ Development Mode: Skipping Middleware");
        return NextResponse.next();
    }

    console.log("🔒 Production Mode: Checking Auth");
    
    const sessionToken = request.cookies.get("__Secure-better_auth.session_token") || 
                         request.cookies.get("better_auth.session_token");

    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/dashboard")) {
        if (!sessionToken) {
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"]
}