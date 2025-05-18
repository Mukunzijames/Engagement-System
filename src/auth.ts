import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/db"
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { compare, hash } from "bcrypt";

// Adding a function to hash passwords
export async function hashPassword(password: string) {
  return await hash(password, 12);
}

// Adding a function to verify passwords
export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          const user = await db.select().from(users).where(eq(users.email, credentials.email as string)).limit(1);
          
          if (!user || user.length === 0) {
            return null;
          }
          
          const isValid = await verifyPassword(credentials.password as string, user[0].password);
          
          if (!isValid) {
            return null;
          }
          
          return {
            id: user[0].id.toString(),
            name: user[0].name,
            email: user[0].email,
            image: user[0].image || null
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Check if user already exists
          const existingUser = await db.select().from(users).where(eq(users.email, user.email as string)).limit(1);
          
          if (existingUser.length === 0) {
            // Create a new user with random password for Google sign-in
            const randomPassword = Math.random().toString(36).slice(-10);
            const hashedPassword = await hashPassword(randomPassword);
            
            await db.insert(users).values({
              name: user.name as string,
              email: user.email as string,
              password: hashedPassword,
              image: user.image,
              role: 'citizen',
            });

            console.log(`User created from Google login: ${user.email}`);
          }
        } catch (error) {
          console.error("Error saving Google user to database:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
})