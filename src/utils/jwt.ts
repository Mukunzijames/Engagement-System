import jwt from 'jsonwebtoken';

// JWT secret key - in a production environment, this should be stored in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Token expiration time
const EXPIRES_IN = '7d'; // 7 days

export interface JwtPayload {
  userId: string;
  email: string;
  name?: string;
  image?: string | null;
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
}

/**
 * Verify a JWT token
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    console.error('JWT Verification failed:', error);
    return null;
  }
}

/**
 * Parse JWT token from Authorization header
 */
export function parseAuthHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7); // Remove 'Bearer ' prefix
} 