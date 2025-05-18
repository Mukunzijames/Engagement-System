"use client";

import { useState } from "react";
import { ComplaintCard } from "@/components/ComplaintCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useComplaints, useCategories } from "@/hooks/useQueries";
import Link from "next/link";
import { FaPlus, FaFilter } from "react-icons/fa";

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Complaints</h1>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center"
          >
            <FaFilter className="mr-1" />
            Filters
          </Button>
          <Link href="/submit">
            <Button size="sm" className="flex items-center bg-amber-600 hover:bg-amber-700">
              <FaPlus className="mr-1" />
              New Complaint
            </Button>
          </Link>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
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
        <div className="text-center py-8">Loading...</div>
      ) : complaints?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints found</h3>
          <p className="text-gray-500 mb-4">
            {Object.keys(filters).length > 0
              ? "Try changing your filters or"
              : "Get started by submitting your first complaint"}
          </p>
          <Link href="/submit">
            <Button className="bg-amber-600 hover:bg-amber-700">Submit a Complaint</Button>
          </Link>
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