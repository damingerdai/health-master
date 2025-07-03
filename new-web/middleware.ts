export { default } from "next-auth/middleware";

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up).*)']
}

// export async function middleware(request: NextRequest) {
//     console.log("Middleware is running");
//     console.log("Request URL:", request.url);
//     console.log("Request Method:", request.method);
//     console.log("Request Headers:", request.headers);
//     console.log("Request Cookies:", request.cookies);
//     const cookieHeader = request.headers.get("cookie");
//     console.log("Cookie Header:", cookieHeader);
//     const token = parseAuthCookie(cookieHeader ?? undefined);
//     console.log("Parsed Token:", token);

//     return NextResponse.next();
// }

// export const config = { matcher: ["/", "/dashboard", "/blood-pressure-new"] };