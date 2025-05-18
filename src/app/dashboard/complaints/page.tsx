"use client";

import { useState, useEffect } from "react";
import { ComplaintCard } from "@/components/ComplaintCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ComplaintForm } from "@/components/ComplaintForm";
import { useComplaints, useCategories } from "@/hooks/useQueries";
import Link from "next/link";
import { FaPlus, FaFilter, FaSearch, FaTimes, FaFileAlt } from "react-icons/fa";

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

export default function ComplaintsPage() {
  const [filters, setFilters] = useState<{
    status?: string;
    categoryId?: number;
  }>({});
  const [showFilters, setShowFilters] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  
  useEffect(() => {
    // Get the selected role from localStorage
    const role = localStorage.getItem('selectedRole');
    setUserRole(role);
  }, []);
  
  const { data: complaints, isLoading } = useComplaints(filters);
  const { data: categories } = useCategories();
  
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const isCitizen = userRole === 'citizen';
  
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
      
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {isCitizen ? 'My Complaints' : 'All Complaints'}
        </h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center ${showFilters ? 'bg-gray-100' : ''}`}
          >
            <FaFilter className="mr-1" size={14} />
            Filters
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-700">Filter Complaints</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowFilters(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={14} />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Status"
              value={filters.status || ""}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </Select>
            
            <Select
              label="Category"
              value={filters.categoryId?.toString() || ""}
              onChange={(e) => handleFilterChange("categoryId", e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">All Categories</option>
              {categories?.map((category: Category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="h-10"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-16">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-amber-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading complaints...</p>
        </div>
      ) : complaints?.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
          <div className="bg-amber-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center">
            <FaFileAlt className="text-amber-600 text-xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">No complaints found</h3>
          <p className="text-gray-600 mb-4 max-w-md mx-auto">
            {Object.keys(filters).length > 0
              ? "Try changing your filters or clearing them to see all complaints."
              : "You haven't submitted any complaints yet."}
          </p>
          {isCitizen && Object.keys(filters).length === 0 && (
            <Link href="/dashboard/submit">
              <Button className="bg-amber-600 hover:bg-amber-700">
                <FaPlus className="mr-1" size={12} />
                Submit Your First Complaint
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints?.map((complaint: Complaint) => (
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