"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface ResetPasswordPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { token } = await params;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const [validating, setValidating] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Validate the token when the component mounts
    async function validateToken() {
      try {
        const response = await fetch(`/api/auth/validate-reset-token?token=${token}`);
        const data = await response.json();
        
        if (!response.ok || !data.valid) {
          setIsValidToken(false);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setIsValidToken(false);
      } finally {
        setValidating(false);
      }
    }

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess(true);
    } catch (error) {
      console.error("Error resetting password:", error);
      setError(error instanceof Error ? error.message : "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FCB045] border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-red-500 mb-4 text-5xl">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid or Expired Link</h1>
          <p className="text-gray-600 mb-6">This password reset link is invalid or has expired.</p>
          <Link
            href="/forgot-password"
            className="block w-full text-center py-2 px-4 bg-[#FCB045] text-white rounded-md hover:bg-[#e9a040] transition-colors"
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-md bg-[#FCB045] flex items-center justify-center text-white text-xl font-bold mr-2">
                CES
              </div>
              <span className="text-xl font-semibold text-gray-800">Citizen Engagement System</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Password</h1>
          <p className="text-gray-600">
            Enter a new password for your account.
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 p-4 rounded-md mb-6">
            <h3 className="text-green-800 font-medium mb-1">Password Updated!</h3>
            <p className="text-green-700 text-sm">
              Your password has been successfully reset. You can now login with your new password.
            </p>
            <div className="mt-4">
              <Link
                href="/login"
                className="block w-full text-center py-2 px-4 bg-[#FCB045] text-white rounded-md hover:bg-[#e9a040] transition-colors"
              >
                Go to Login
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCB045]"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-500" />
                    ) : (
                      <FaEye className="text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCB045]"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="text-gray-500" />
                    ) : (
                      <FaEye className="text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                  isLoading ? "bg-[#ffd093]" : "bg-[#FCB045] hover:bg-[#e9a040]"
                } transition-colors focus:outline-none focus:ring-2 focus:ring-[#FCB045] focus:ring-offset-2`}
              >
                {isLoading ? "Updating..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
} 