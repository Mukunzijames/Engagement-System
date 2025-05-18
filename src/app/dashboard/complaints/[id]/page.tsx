"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardBadge, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { useComplaintDetails, useCategories, useAddResponse, useUpdateComplaint } from "@/hooks/useQueries";
import { FaMapMarkerAlt, FaTag, FaClock, FaArrowLeft, FaPaperclip } from "react-icons/fa";

interface Complaint {
  id: number;
  ticketNumber: string;
  title: string;
  categoryId: number;
  status: string;
  location: string;
  description: string;
  createdAt: string;
  attachments?: Attachment[];
  statusHistory?: StatusHistory[];
  responses?: Response[];
}

interface Attachment {
  name: string;
  type: string;
  data: string;
}

interface StatusHistory {
  id: number;
  status: string;
  comment?: string;
  createdAt: string;
}

interface Response {
  id: number;
  response: string;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
}

export default async function ComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = await params;
  const { data: complaint, isLoading } = useComplaintDetails(parseInt(id));
  const { data: categories } = useCategories();
  const [response, setResponse] = useState("");
  const addResponseMutation = useAddResponse(parseInt(id));
  const updateComplaintMutation = useUpdateComplaint();
  
  const handleSubmitResponse = async () => {
    if (!response.trim()) return;
    
    try {
      await addResponseMutation.mutateAsync({
        response,
        // In a real app, the responder ID would come from auth
        responderId: 2,
      });
      
      setResponse("");
    } catch (error) {
      console.error("Error submitting response:", error);
    }
  };
  
  const handleStatusChange = async (status: string) => {
    try {
      await updateComplaintMutation.mutateAsync({
        id: parseInt(id),
        status,
        statusComment: `Status changed to ${status}`,
        // In a real app, the updatedBy ID would come from auth
        updatedBy: 2,
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  
  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }
  
  if (!complaint) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Complaint not found</h3>
        <Button onClick={() => router.push("/complaints")} variant="outline">
          Back to Complaints
        </Button>
      </div>
    );
  }
  
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "submitted":
        return "info";
      case "in_progress":
        return "warning";
      case "resolved":
        return "success";
      case "closed":
        return "default";
      default:
        return "default";
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };
  
  const statusDisplayName = {
    submitted: "Submitted",
    in_progress: "In Progress",
    resolved: "Resolved",
    closed: "Closed",
  }[complaint.status as 'submitted' | 'in_progress' | 'resolved' | 'closed'] || complaint.status;
  
  const category = categories?.find((c: Category) => c.id === complaint.categoryId)?.name || "Unknown";

  return (
    <div>
      <div className="mb-6">
        <Button 
          variant="outline" 
          className="flex items-center"
          onClick={() => router.back()}
        >
          <FaArrowLeft className="mr-1" />
          Back
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <div>
              <CardTitle className="text-2xl">{complaint.title}</CardTitle>
              <div className="text-sm text-gray-500">{complaint.ticketNumber}</div>
            </div>
            <CardBadge variant={getStatusVariant(complaint.status)}>
              {statusDisplayName}
            </CardBadge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center text-sm">
              <FaTag className="mr-2 text-gray-400" />
              <span>Category: {category}</span>
            </div>
            
            {complaint.location && (
              <div className="flex items-center text-sm">
                <FaMapMarkerAlt className="mr-2 text-gray-400" />
                <span>Location: {complaint.location}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center text-sm">
            <FaClock className="mr-2 text-gray-400" />
            <span>Submitted: {formatDate(complaint.createdAt)}</span>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-line">{complaint.description}</p>
          </div>
          
          {complaint.attachments && complaint.attachments.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="font-medium mb-2 flex items-center">
                <FaPaperclip className="mr-2" />
                Attachments ({complaint.attachments.length})
              </h3>
              <div className="space-y-2">
                {complaint.attachments.map((attachment: Attachment, index: number) => (
                  <div key={index} className="text-blue-600 hover:underline">
                    {/* In a real app, this would be a download link */}
                    {attachment.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex-col items-start">
          <h3 className="font-medium mb-2">Update Status</h3>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant={complaint.status === "in_progress" ? "primary" : "outline"}
              disabled={complaint.status === "in_progress"}
              onClick={() => handleStatusChange("in_progress")}
              className={complaint.status === "in_progress" ? "bg-amber-600 hover:bg-amber-700" : ""}
            >
              In Progress
            </Button>
            <Button 
              size="sm" 
              variant={complaint.status === "resolved" ? "success" : "outline"}
              disabled={complaint.status === "resolved"}
              onClick={() => handleStatusChange("resolved")}
            >
              Resolved
            </Button>
            <Button 
              size="sm" 
              variant={complaint.status === "closed" ? "secondary" : "outline"}
              disabled={complaint.status === "closed"}
              onClick={() => handleStatusChange("closed")}
            >
              Closed
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Status History */}
      {complaint.statusHistory && complaint.statusHistory.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Status History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complaint.statusHistory.map((history: StatusHistory) => (
                <div key={history.id} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-medium">Status: </span>
                      <CardBadge variant={getStatusVariant(history.status)} className="ml-1">
                        {history.status}
                      </CardBadge>
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(history.createdAt)}</span>
                  </div>
                  {history.comment && (
                    <p className="text-gray-700 mt-1 text-sm">{history.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Responses */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Responses</CardTitle>
        </CardHeader>
        <CardContent>
          {complaint.responses && complaint.responses.length > 0 ? (
            <div className="space-y-4">
              {complaint.responses.map((response: Response) => (
                <div key={response.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Official Response</span>
                    <span className="text-sm text-gray-500">{formatDate(response.createdAt)}</span>
                  </div>
                  <p className="text-gray-700">{response.response}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No responses yet.</p>
          )}
        </CardContent>
      </Card>
      
      {/* Add Response Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add Response</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Write your response here..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="mb-4"
          />
          <Button 
            onClick={handleSubmitResponse}
            disabled={!response.trim() || addResponseMutation.isPending}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {addResponseMutation.isPending ? "Submitting..." : "Submit Response"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 