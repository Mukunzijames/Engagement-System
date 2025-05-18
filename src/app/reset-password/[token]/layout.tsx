import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Citizen Engagement System",
  description: "Create a new password for your Citizen Engagement System account",
};

export default function ResetPasswordLayout({
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