"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FaPlus, FaUser, FaSignOutAlt, FaComments, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ComplaintForm } from "@/components/ComplaintForm";

export function Header() {
  const { data: session } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get the selected role from localStorage
    const role = localStorage.getItem('selectedRole');
    setUserRole(role);
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };
  
  const toggleComplaintForm = () => {
    setShowComplaintForm(!showComplaintForm);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-300 sticky top-0 z-10 shadow-sm">
      {/* Complaint Form Modal */}
      {showComplaintForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Submit a Complaint</h2>
              <button 
                onClick={toggleComplaintForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="p-4">
              <ComplaintForm onSuccess={toggleComplaintForm} />
            </div>
          </div>
        </div>
      )}
      
      <div className="w-full px-0">
        <div className="flex justify-between items-center h-16 px-4">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-amber-600">CES</span>
              <span className="hidden md:block ml-2 text-lg font-medium text-gray-700">Citizen Engagement System</span>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-amber-600 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <FaTimes size={24} />
              ) : (
                <FaBars size={24} />
              )}
            </button>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
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
            
            {userRole === 'citizen' && (
              <Button 
                onClick={toggleComplaintForm}
                size="sm" 
                className="flex items-center bg-amber-600 hover:bg-amber-700"
              >
                <FaPlus className="mr-1" size={12} />
                Add Complaint
              </Button>
            )}
            
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
          </nav>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                href="/dashboard" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/dashboard/complaints" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Complaints
              </Link>
              <Link 
                href="/dashboard/chat" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50 flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaComments className="mr-2" />
                Chat
              </Link>
              
              {userRole === 'citizen' && (
                <button
                  onClick={toggleComplaintForm}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-amber-600 hover:bg-amber-700 flex items-center"
                >
                  <FaPlus className="mr-2" />
                  Add Complaint
                </button>
              )}
              
              {session && (
                <div className="border-t border-gray-200 pt-4 pb-3">
                  <div className="px-3 flex items-center">
                    {session.user?.image ? (
                      <Image 
                        src={session.user.image} 
                        alt={session.user.name || "User"} 
                        width={40} 
                        height={40} 
                        className="rounded-full border border-gray-300 object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white">
                        <FaUserCircle className="text-xl" />
                      </div>
                    )}
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{session.user?.name}</div>
                      <div className="text-sm font-medium text-gray-500">{session.user?.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <Link 
                      href="/dashboard/profile" 
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50 flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FaUser className="mr-2 text-amber-600" /> 
                      Profile
                    </Link>
                    <button 
                      onClick={handleSignOut} 
                      className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50 flex items-center"
                    >
                      <FaSignOutAlt className="mr-2 text-amber-600" /> 
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 