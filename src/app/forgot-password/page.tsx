"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess(true);
    } catch (error) {
      console.error("Error requesting password reset:", error);
      setError(error instanceof Error ? error.message : "Failed to request password reset");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-md  flex items-center justify-center text-[#FCB045] text-xl font-bold mr-2">
                CES
              </div>
              <span className="text-xl font-semibold text-gray-800">Citizen Engagement System</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h1>
          <p className="text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 p-4 rounded-md mb-6">
            <h3 className="text-green-800 font-medium mb-1">Check your email</h3>
            <p className="text-green-700 text-sm">
              If an account exists for {email}, we've sent a password reset link to this email address.
            </p>
            <div className="mt-4">
              <Link
                href="/login"
                className="block w-full text-center py-2 px-4 bg-[#FCB045] text-white rounded-md hover:bg-[#e9a040] transition-colors"
              >
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCB045]"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                  isLoading ? "bg-[#ffd093]" : "bg-[#FCB045] hover:bg-[#e9a040]"
                } transition-colors focus:outline-none focus:ring-2 focus:ring-[#FCB045] focus:ring-offset-2`}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-[#FCB045] hover:underline">
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 