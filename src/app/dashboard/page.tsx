"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useComplaints, useCategories } from "@/hooks/useQueries";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ComplaintCard } from "@/components/ComplaintCard";
import Link from "next/link";
import { FaPlus, FaChartLine, FaListUl, FaCheckCircle, FaClock, FaUser, FaBuilding } from "react-icons/fa";

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
  
  return (
    <div className="bg-white">
      <div className="flex justify-between items-center mb-6">
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
        
        {/* Only citizens can submit new complaints */}
        {userRole === 'citizen' && (
          <Link href="/dashboard/submit">
            <Button className="flex items-center bg-amber-600 hover:bg-amber-700">
              <FaPlus className="mr-1" />
              New Complaint
            </Button>
          </Link>
        )}
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FaListUl className="text-amber-500 mr-2" />
              <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FaClock className="text-yellow-500 mr-2" />
              <div className="text-2xl font-bold text-gray-800">{stats.inProgress}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FaCheckCircle className="text-green-500 mr-2" />
              <div className="text-2xl font-bold text-gray-800">{stats.resolved}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Open Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FaChartLine className="text-purple-500 mr-2" />
              <div className="text-2xl font-bold text-gray-800">
                {stats.total ? Math.round(((stats.submitted + stats.inProgress) / stats.total) * 100) : 0}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Complaints */}
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        {userRole === 'citizen' ? 'Your Recent Complaints' : 'Recent Complaints'}
      </h2>
      
      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : recentComplaints?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-300">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints found</h3>
          {userRole === 'citizen' ? (
            <>
              <p className="text-gray-600 mb-4">
                Get started by submitting your first complaint
              </p>
              <Link href="/dashboard/submit">
                <Button className="bg-amber-600 hover:bg-amber-700">Submit a Complaint</Button>
              </Link>
            </>
          ) : (
            <p className="text-gray-600 mb-4">
              There are no complaints in the system yet
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      
      {recentComplaints?.length > 0 && (
        <div className="mt-6 text-center">
          <Link href="/dashboard/complaints">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
              View All Complaints
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
