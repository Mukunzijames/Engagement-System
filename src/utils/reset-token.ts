import db from '@/db';
import { passwordResetTokens, users } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { eq, and, gt } from 'drizzle-orm';

// Token expiration time in minutes
const TOKEN_EXPIRATION_MINUTES = 30;

/**
 * Generate a password reset token for a user
 */
export async function generatePasswordResetToken(userId: number): Promise<string> {
  // Generate a random token
  const token = uuidv4();
  
  // Calculate expiration date (30 minutes from now)
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + TOKEN_EXPIRATION_MINUTES);
  
  // Store the token in the database
  await db.insert(passwordResetTokens).values({
    userId,
    token,
    expiresAt,
  });
  
  return token;
}

/**
 * Verify a password reset token
 */
export async function verifyPasswordResetToken(token: string): Promise<{ valid: boolean; userId?: number }> {
  try {
    // Find the token in the database
    const results = await db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.token, token),
          eq(passwordResetTokens.used, false),
          gt(passwordResetTokens.expiresAt, new Date())
        )
      )
      .limit(1);
    
    // If no token found or expired, return invalid
    if (!results.length) {
      return { valid: false };
    }
    
    return { valid: true, userId: results[0].userId };
  } catch (error) {
    console.error('Error verifying token:', error);
    return { valid: false };
  }
}

/**
 * Mark a token as used
 */
export async function markTokenAsUsed(token: string): Promise<boolean> {
  try {
    await db
      .update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.token, token));
    
    return true;
  } catch (error) {
    console.error('Error marking token as used:', error);
    return false;
  }
}

/**
 * Find a user by email
 */
export async function findUserByEmail(email: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  
  return result.length ? result[0] : null;
} 