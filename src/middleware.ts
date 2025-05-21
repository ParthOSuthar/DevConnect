import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const isProtectedAdmin = req.nextUrl.pathname.startsWith("/dashboard");

    if (isProtectedAdmin) {
        if (!token) {
            const url = new URL("/", req.url);
            url.searchParams.set("unauthorized", "login");
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
