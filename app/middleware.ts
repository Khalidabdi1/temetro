import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export  function middleware(request:NextRequest){
    console.log("--- الـ Middleware يعمل الآن على مسار: ", request.nextUrl.pathname);
    const sessionsToken=request.cookies.get("better-auth.session_token") || request.cookies.get("__Secure-better-auth.session_token")

    const isDashboard =request.nextUrl.pathname.startsWith("/dashboard")

    if(isDashboard && !sessionsToken){
        console.log("❌ مستخدم غير مسجل، جاري التحويل للـ Login");
        return NextResponse.redirect(new URL("/auth/login",request.url))

    }
console.log("✅ المستخدم لديه كوكي أو المسار غير محمي");
    return NextResponse.next()

}

export const config={
    matcher:["/dashboard/:path*"]
}