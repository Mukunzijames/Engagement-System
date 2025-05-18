"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FaPlus, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export function Header() {
  const { data: session } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <header className="bg-white border-b border-gray-300 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">CES</span>
              <span className="ml-2 text-lg font-medium text-gray-700">Citizen Engagement System</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
            <Link href="/complaints" className="text-gray-700 hover:text-blue-600">
              My Complaints
            </Link>
            
            {session ? (
              <div className="relative ml-4">
                <button 
                  className="flex items-center space-x-2 focus:outline-none" 
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  {session.user?.image ? (
                    <Image 
                      src={session.user.image} 
                      alt={session.user.name || "User"} 
                      width={32} 
                      height={32} 
                      className="rounded-full border border-gray-300"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      <span>{session.user?.name?.charAt(0) || <FaUser />}</span>
                    </div>
                  )}
                  <span className="text-gray-700">{session.user?.name || "User"}</span>
                </button>
                
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <FaUser className="mr-2" /> Profile
                    </Link>
                    <button 
                      onClick={handleSignOut} 
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <FaSignOutAlt className="mr-2" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-gray-700 hover:text-blue-600">
                Login
              </Link>
            )}
            
            <Link href="/submit">
              <Button size="sm" className="flex items-center bg-blue-600 hover:bg-blue-700">
                <FaPlus className="mr-1" />
                Submit Complaint
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 