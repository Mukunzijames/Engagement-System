import { NextRequest, NextResponse } from "next/server";
import { verifyToken, parseAuthHeader } from "./jwt";
import { auth } from "@/auth";

/**
 * Middleware function to check if a user is authenticated via JWT token or NextAuth session
 */
export async function isAuthenticated(
  request: NextRequest,
  onUnauthenticated = () => 
    NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    )
) {
  // First try JWT token from Authorization header
  const authHeader = request.headers.get("authorization");
  const token = parseAuthHeader(authHeader || "");

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      return { isAuth: true, user: payload };
    }
  }

  // If JWT auth fails, try to get NextAuth session
  try {
    // Get session from NextAuth
    const session = await auth();
    
    if (session?.user) {
      // Convert NextAuth session user to our JWT payload format
      const user = {
        userId: session.user.id || session.user.email,
        email: session.user.email || '',
        name: session.user.name,
        image: session.user.image
      };
      
      return { isAuth: true, user };
    }
  } catch (error) {
    console.error("Error getting NextAuth session:", error);
  }
  
  // If all authentication methods fail
  return { isAuth: false, response: onUnauthenticated() };
}

/**
 * Higher-order function to create a protected API handler
 */
export function withAuth(
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const auth = await isAuthenticated(request);
    
    if (!auth.isAuth) {
      return auth.response;
    }
    
    return handler(request, auth.user);
  };
} 