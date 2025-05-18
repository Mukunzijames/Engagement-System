import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Citizen Engagement System",
  description: "Reset your password for the Citizen Engagement System",
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
} 