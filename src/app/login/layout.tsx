import type { Metadata } from "next";
import "../globals.css";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Login - Citizen Engagement System",
  description: "Sign in to your account",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white min-h-screen text-gray-800">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
} 