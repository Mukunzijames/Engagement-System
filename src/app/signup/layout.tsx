import type { Metadata } from "next";
import "../globals.css";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Sign Up - Citizen Engagement System",
  description: "Create a new account",
};

export default function SignupLayout({
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