"use client";

import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();
  
  return (
    <div className="bg-white min-h-[50vh] flex flex-col items-center justify-center p-8">
      {status === "loading" ? (
        <p className="text-gray-600">Loading...</p>
      ) : session ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome, {session.user?.name}!</h1>
          <p className="text-xl text-gray-600 mb-6">Thank you for logging in to the Citizen Engagement System.</p>
          {session.user?.image && (
            <div className="mb-4">
              <img 
                src={session.user.image} 
                alt={session.user.name || "User"} 
                className="w-24 h-24 rounded-full mx-auto border-2 border-amber-400"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to the Citizen Engagement System</h1>
          <p className="text-xl text-gray-600">Please login to submit and track your complaints.</p>
        </div>
      )}
    </div>
  );
}
