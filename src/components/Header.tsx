"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FaPlus, FaUser, FaSignOutAlt, FaComments, FaUserCircle } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Header() {
  const { data: session } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get the selected role from localStorage
    const role = localStorage.getItem('selectedRole');
    setUserRole(role);
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <header className="bg-white border-b border-gray-300 sticky top-0 z-10 shadow-sm">
      <div className="w-full px-0">
        <div className="flex justify-between items-center h-16 px-4">
          <div className="flex">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-amber-600">CES</span>
              <span className="ml-2 text-lg font-medium text-gray-700">Citizen Engagement System</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-gray-700 hover:text-amber-600">
              Dashboard
            </Link>
            <Link href="/dashboard/complaints" className="text-gray-700 hover:text-amber-600">
              My Complaints
            </Link>
            <Link href="/dashboard/chat" className="text-gray-700 hover:text-amber-600 flex items-center">
              <FaComments className="mr-1" />
              Chat
            </Link>
            
            {session ? (
              <div className="relative ml-4">
                <button 
                  className="flex items-center focus:outline-none" 
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-label="Open user menu"
                >
                  {session.user?.image ? (
                    <div className="relative">
                      <Image 
                        src={session.user.image} 
                        alt={session.user.name || "User"} 
                        width={40} 
                        height={40} 
                        className="rounded-full border border-gray-300 object-cover"
                      />
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white">
                        <FaUserCircle className="text-xl" />
                      </div>
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                    </div>
                  )}
                </button>
                
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                      <p className="text-xs text-gray-500">{session.user?.email}</p>
                      <div className="mt-1 text-xs bg-amber-100 text-amber-800 py-0.5 px-2 rounded-md inline-block capitalize">
                        {userRole || 'User'}
                      </div>
                    </div>
                    <Link 
                      href="/dashboard/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <FaUser className="mr-2 text-amber-600" /> Profile
                    </Link>
                    <button 
                      onClick={handleSignOut} 
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <FaSignOutAlt className="mr-2 text-amber-600" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-gray-700 hover:text-amber-600">
                Login
              </Link>
            )}
            
            {userRole === 'citizen' && (
              <Link href="/dashboard/submit">
                <Button 
                  size="sm" 
                  className="flex items-center bg-amber-600 hover:bg-amber-700"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    className="w-4 h-4 mr-1"
                  >
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                  </svg>
                  New Complaint
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
} 