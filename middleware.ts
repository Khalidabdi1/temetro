
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export  function middleware(request:NextRequest){
    console.log("--- الـ Middleware يعمل الآن على مسار: ", request.nextUrl.pathname);
const sessionToken = request.cookies.get("__Secure-better_auth.session_token") || 
                         request.cookies.get("better_auth.session_token");

        const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
        const { pathname } = request.nextUrl;

   // 2. التحقق من مسار الداشبورد
    if (pathname.startsWith("/dashboard")) {
        if (!sessionToken) {
            // إذا لم يوجد توكن، يتم التحويل لصفحة تسجيل الدخول
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
    }

    return NextResponse.next();

}

export const config={
    matcher:["/dashboard/:path*"]
}