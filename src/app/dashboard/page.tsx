"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useComplaints, useCategories } from "@/hooks/useQueries";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ComplaintCard } from "@/components/ComplaintCard";
import { ComplaintForm } from "@/components/ComplaintForm";
import Link from "next/link";
import { FaPlus, FaChartLine, FaListUl, FaCheckCircle, FaClock, FaUser, FaBuilding, FaFileAlt, FaTimes } from "react-icons/fa";

// Define types for our data
interface Complaint {
  id: number;
  ticketNumber: string;
  title: string;
  categoryId: number;
  status: string;
  location: string;
  createdAt: string;
  userId?: number;
}

interface Category {
  id: number;
  name: string;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [userRole, setUserRole] = useState<string | null>(null);
  const userId = session?.user?.id ? parseInt(session.user.id) : undefined;
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  
  // Set up filter conditions based on role
  const queryParams = userRole === 'citizen' && userId ? { userId } : {};
  
  const { data: complaints, isLoading } = useComplaints(queryParams);
  const { data: categories } = useCategories();
  
  useEffect(() => {
    // Get the selected role from localStorage
    const role = localStorage.getItem('selectedRole');
    setUserRole(role);
  }, []);
  
  // Calculate statistics
  const stats = {
    total: complaints?.length || 0,
    submitted: complaints?.filter((c: Complaint) => c.status === "submitted").length || 0,
    inProgress: complaints?.filter((c: Complaint) => c.status === "in_progress").length || 0,
    resolved: complaints?.filter((c: Complaint) => c.status === "resolved").length || 0,
    closed: complaints?.filter((c: Complaint) => c.status === "closed").length || 0,
  };
  
  // Get the most recent complaints
  const recentComplaints = complaints
    ?.sort((a: Complaint, b: Complaint) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);
  
  const toggleComplaintForm = () => {
    setShowComplaintForm(!showComplaintForm);
  };
  
  return (
    <div className="bg-white p-1 md:p-6 rounded-lg">
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
      
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          {userRole && (
            <div className="flex items-center text-gray-500 mt-1">
              {userRole === 'citizen' ? (
                <><FaUser className="mr-1" /> Citizen View</>
              ) : (
                <><FaBuilding className="mr-1" /> Agency View</>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <div className="bg-amber-100 p-2 rounded-md mr-2">
                <FaListUl className="text-amber-600" />
              </div>
              Total Complaints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
              {userRole === 'citizen' && (
                <span className="text-xs text-gray-500 mt-1">Total complaints you've submitted</span>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <div className="bg-yellow-100 p-2 rounded-md mr-2">
                <FaClock className="text-yellow-600" />
              </div>
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-gray-800">{stats.inProgress}</div>
              <span className="text-xs text-gray-500 mt-1">Being actively addressed</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <div className="bg-green-100 p-2 rounded-md mr-2">
                <FaCheckCircle className="text-green-600" />
              </div>
              Resolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-gray-800">{stats.resolved}</div>
              <span className="text-xs text-gray-500 mt-1">Successfully addressed</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <div className="bg-purple-100 p-2 rounded-md mr-2">
                <FaChartLine className="text-purple-600" />
              </div>
              Open Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-gray-800">
                {stats.total ? Math.round(((stats.submitted + stats.inProgress) / stats.total) * 100) : 0}%
              </div>
              <span className="text-xs text-gray-500 mt-1">Complaints still open</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Complaints */}
      <div className="mb-2 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          {userRole === 'citizen' ? 'Your Recent Complaints' : 'Recent Complaints'}
        </h2>
        
        <div className="flex items-center space-x-3">
          {recentComplaints?.length > 0 && (
            <Link href="/dashboard/complaints">
              <Button variant="ghost" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                View All
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-16">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-amber-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading your complaints...</p>
        </div>
      ) : recentComplaints?.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
          <div className="bg-amber-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center">
            <FaFileAlt className="text-amber-600 text-xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">No complaints found</h3>
          {userRole === 'citizen' && (
            <>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                You haven't submitted any complaints yet. Get started by clicking the button below.
              </p>
              <Link href="/dashboard/submit">
                <Button className="bg-amber-600 hover:bg-amber-700">
                  <FaPlus className="mr-1" size={12} />
                  Submit Your First Complaint
                </Button>
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentComplaints?.map((complaint: Complaint) => (
            <ComplaintCard
              key={complaint.id}
              id={complaint.id}
              ticketNumber={complaint.ticketNumber}
              title={complaint.title}
              category={categories?.find((c: Category) => c.id === complaint.categoryId)?.name || "Unknown"}
              status={complaint.status}
              location={complaint.location}
              createdAt={complaint.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
