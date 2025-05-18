import { NextRequest, NextResponse } from "next/server";
import { verifyToken, parseAuthHeader } from "./jwt";

/**
 * Middleware function to check if a user is authenticated via JWT token
 */
export function isAuthenticated(
  request: NextRequest,
  onUnauthenticated = () => 
    NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    )
) {
  const authHeader = request.headers.get("authorization");
  const token = parseAuthHeader(authHeader || "");

  if (!token) {
    return { isAuth: false, response: onUnauthenticated() };
  }

  const payload = verifyToken(token);
  if (!payload) {
    return { isAuth: false, response: onUnauthenticated() };
  }

  return { isAuth: true, user: payload };
}

/**
 * Higher-order function to create a protected API handler
 */
export function withAuth(
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const { isAuth, user, response } = isAuthenticated(request);
    
    if (!isAuth) {
      return response;
    }
    
    return handler(request, user);
  };
} 