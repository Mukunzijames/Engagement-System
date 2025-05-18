"use client";

import { useComplaints, useCategories } from "@/hooks/useQueries";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ComplaintCard } from "@/components/ComplaintCard";
import Link from "next/link";
import { FaPlus, FaChartLine, FaListUl, FaCheckCircle, FaClock } from "react-icons/fa";

// Define types for our data
interface Complaint {
  id: number;
  ticketNumber: string;
  title: string;
  categoryId: number;
  status: string;
  location: string;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
}

export default function HomePage() {
  const { data: complaints, isLoading } = useComplaints({});
  const { data: categories } = useCategories();
  
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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link href="/submit">
          <Button className="flex items-center bg-blue-600 hover:bg-blue-700">
            <FaPlus className="mr-1" />
            New Complaint
          </Button>
        </Link>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FaListUl className="text-blue-500 mr-2" />
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
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Recent Complaints</h2>
      
      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : recentComplaints?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-300">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints found</h3>
          <p className="text-gray-600 mb-4">
            Get started by submitting your first complaint
          </p>
          <Link href="/submit">
            <Button className="bg-blue-600 hover:bg-blue-700">Submit a Complaint</Button>
          </Link>
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
          <Link href="/complaints">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">View All Complaints</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
