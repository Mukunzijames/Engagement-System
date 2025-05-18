"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ComplaintForm } from "@/components/ComplaintForm";

export default function SubmitComplaintPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  
  useEffect(() => {
    // Get the selected role from localStorage
    const role = localStorage.getItem('selectedRole');
    setUserRole(role);
    
    // If user is not a citizen, redirect to dashboard
    if (role && role !== 'citizen') {
      router.push('/dashboard');
    }
  }, [router]);
  
  if (userRole !== 'citizen') {
    return (
      <div className="text-center py-16">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-amber-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Checking permissions...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Submit a Complaint</h1>
      <ComplaintForm />
    </div>
  );
} 