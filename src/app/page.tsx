"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaUser, FaBuilding } from "react-icons/fa";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Handle card click - store role selection and navigate to login
  const handleRoleSelect = (role: 'citizen' | 'agency') => {
    // Store selected role in localStorage for retrieval after login
    localStorage.setItem('selectedRole', role);
    router.push('/login');
  };
  
  // If already logged in, redirect to dashboard
  if (status !== "loading" && session) {
    router.push('/dashboard');
    return null;
  }
  
  return (
    <div className="bg-white min-h-[80vh] flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Citizen Engagement System</h1>
        <p className="text-xl text-gray-600 mb-8">Please select your role to continue</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Citizen Card */}
        <div 
          onClick={() => handleRoleSelect('citizen')}
          className="bg-white rounded-lg shadow-md border border-gray-200 p-8 flex flex-col items-center cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="w-20 h-20 flex items-center justify-center bg-amber-100 rounded-full mb-4">
            <FaUser className="text-amber-600 text-3xl" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Citizen</h2>
          <p className="text-gray-600 text-center">
            Submit and track complaints, access public services, and communicate with government agencies.
          </p>
        </div>
        
        {/* Agency Card */}
        <div 
          onClick={() => handleRoleSelect('agency')}
          className="bg-white rounded-lg shadow-md border border-gray-200 p-8 flex flex-col items-center cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="w-20 h-20 flex items-center justify-center bg-amber-100 rounded-full mb-4">
            <FaBuilding className="text-amber-600 text-3xl" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Agency</h2>
          <p className="text-gray-600 text-center">
            Manage and respond to citizen complaints, coordinate with departments, and generate reports.
          </p>
        </div>
      </div>
    </div>
  );
}
