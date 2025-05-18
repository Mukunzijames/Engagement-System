import { Card, CardBadge, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { FaMapMarkerAlt, FaTag, FaClock } from "react-icons/fa";

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
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-xl text-gray-800">{title}</CardTitle>
          <CardBadge variant={getStatusVariant(status)}>
            {statusDisplayName}
          </CardBadge>
        </div>
        <div className="text-sm text-gray-600">{ticketNumber}</div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-700">
            <FaTag className="mr-2 text-blue-500" />
            <span>{category}</span>
          </div>
          {location && (
            <div className="flex items-center text-sm text-gray-700">
              <FaMapMarkerAlt className="mr-2 text-blue-500" />
              <span>{location}</span>
            </div>
          )}
          <div className="flex items-center text-sm text-gray-700">
            <FaClock className="mr-2 text-blue-500" />
            <span>Submitted: {formatDate(createdAt)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Link href={`/complaints/${id}`} className="w-full">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 