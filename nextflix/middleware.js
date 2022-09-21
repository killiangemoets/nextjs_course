import { NextResponse } from "next/server";
import { verifyToken } from "./lib/utils";

// middleware is always going to ryn before any or the routes run
// export function middleware(req, ev) {
//   //   console.log({ req, ev });

//   // it will return a "NextResponse" that continue the middleware chain
//   return NextResponse.next();
// }

export async function middleware(req, ev) {
  // console.log("hello from middleware");
  const token = req ? req.cookies?.get("token") : null;
  const userId = await verifyToken(token);
  const { pathname } = req.nextUrl;

  if (
    pathname.includes("/api/login") ||
    userId ||
    pathname.includes("/static")
  ) {
    return NextResponse.next();
  }

  if ((!token || !userId) && pathname !== "/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}
