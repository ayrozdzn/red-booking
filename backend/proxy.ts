import { NextRequest, NextResponse } from "next/server";

const allowedOrigin = process.env.FRONTEND_URL ?? "http://localhost:3000";

function withCors(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export function proxy(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return withCors(new NextResponse(null, { status: 204 }));
  }

  return withCors(NextResponse.next());
}

export const config = {
  matcher: "/api/:path*",
};
