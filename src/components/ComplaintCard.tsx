import { Card, CardBadge, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { FaMapMarkerAlt, FaTag, FaClock, FaChevronRight, FaEye } from "react-icons/fa";

interface ComplaintCardProps {
  id: number;
  ticketNumber: string;
  title: string;
  category: string;
  status: string;
  location: string;
  createdAt: string;
}

export function ComplaintCard({
  id,
  ticketNumber,
  title,
  category,
  status,
  location,
  createdAt,
}: ComplaintCardProps) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-amber-100 text-amber-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusTopColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-500";
      case "in_progress":
        return "bg-amber-500";
      case "resolved":
        return "bg-green-500";
      case "closed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const statusDisplayName = {
    submitted: "Submitted",
    in_progress: "In Progress",
    resolved: "Resolved",
    closed: "Closed",
  }[status] || status;

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200">
      <div className={`w-full h-1.5 ${getStatusTopColor(status)}`}></div>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-1">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">{title}</CardTitle>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500 font-medium">{ticketNumber}</div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(status)}`}>
            {statusDisplayName}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-3 pt-0">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-700">
            <FaTag className="mr-2 text-amber-600 flex-shrink-0" size={14} />
            <span className="truncate">{category}</span>
          </div>
          {location && (
            <div className="flex items-center text-sm text-gray-700">
              <FaMapMarkerAlt className="mr-2 text-amber-600 flex-shrink-0" size={14} />
              <span className="truncate">{location}</span>
            </div>
          )}
          <div className="flex items-center text-sm text-gray-700">
            <FaClock className="mr-2 text-amber-600 flex-shrink-0" size={14} />
            <span>Submitted: {formatDate(createdAt)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-auto pt-0">
        <Link href={`/dashboard/complaints/${id}`} className="w-full">
          <Button className="w-full bg-amber-600 hover:bg-amber-700 group flex justify-center items-center shadow-sm">
            <FaEye className="mr-2" size={16} />
            View Details
            <FaChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={12} />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 