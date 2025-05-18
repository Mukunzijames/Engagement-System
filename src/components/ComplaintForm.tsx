import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { useCategories, useCreateComplaint } from "@/hooks/useQueries";
import { FaPaperclip, FaMapMarkerAlt, FaUser, FaEnvelope } from "react-icons/fa";
import axios from "axios";

interface Category {
  id: number;
  name: string;
}

type FormData = {
  title: string;
  description: string;
  categoryId: number;
  location: string;
  anonymous: boolean;
};

interface ComplaintFormProps {
  onSuccess?: () => void;
}

export function ComplaintForm({ onSuccess }: ComplaintFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const createComplaintMutation = useCreateComplaint();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (!session?.user) {
      alert("You must be logged in to submit a complaint");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Convert files to base64 for storage
      const attachmentPromises = files.map((file) => {
        return new Promise<{ name: string; type: string; data: string }>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              name: file.name,
              type: file.type,
              data: reader.result as string,
            });
          };
          reader.readAsDataURL(file);
        });
      });

      const attachments = await Promise.all(attachmentPromises);
      
      // Get user ID from session
      const userId = session.user.id ? parseInt(session.user.id) : null;
      
      // Submit the form data with attachments
      const complaintData = {
        title: data.title,
        description: data.description,
        categoryId: parseInt(data.categoryId.toString()),
        location: data.location,
        anonymous: data.anonymous,
        attachments,
        userId
      };
      
      await createComplaintMutation.mutateAsync(complaintData);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Redirect to complaints page if no callback provided
        router.push("/dashboard/complaints");
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const getLocationFromBrowser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location:", position.coords);
          // In a real app, you would use these coordinates or
          // call an API to get the address from these coordinates
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit a Complaint or Feedback</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* User Information */}
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h3 className="font-medium mb-3">Your Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <FaUser className="text-amber-600" />
                <span className="text-gray-700">{session?.user?.name || "Not logged in"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope className="text-amber-600" />
                <span className="text-gray-700">{session?.user?.email || "No email available"}</span>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Your complaint will be filed using your account information.
            </div>
          </div>
          
          <Input
            label="Title"
            placeholder="Brief title of your complaint"
            error={errors.title?.message}
            {...register("title", { required: "Title is required" })}
          />
          
          <Select
            label="Category"
            error={errors.categoryId?.message}
            disabled={categoriesLoading}
            {...register("categoryId", { required: "Category is required" })}
          >
            <option value="">Select a category</option>
            {categories?.map((category: Category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <Input
                label="Location"
                placeholder="Enter location"
                error={errors.location?.message}
                {...register("location")}
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={getLocationFromBrowser}
              className="h-10"
            >
              <FaMapMarkerAlt className="mr-1" />
              Get Location
            </Button>
          </div>
          
          <Textarea
            label="Description"
            placeholder="Provide detailed information about your complaint"
            error={errors.description?.message}
            {...register("description", { required: "Description is required" })}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attachments
            </label>
            <div className="flex items-center space-x-2">
              <label className="flex cursor-pointer items-center rounded-md bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200">
                <FaPaperclip className="mr-2" />
                <span>Attach Files</span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              <span className="text-sm text-gray-500">
                {files.length > 0
                  ? `${files.length} file(s) selected`
                  : "No files selected"}
              </span>
            </div>
            <div className="mt-2">
              {files.map((file, index) => (
                <div key={index} className="text-sm text-gray-600">
                  {file.name}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="anonymous"
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
              {...register("anonymous")}
            />
            <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
              Submit anonymously
            </label>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !session?.user}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {isSubmitting ? "Submitting..." : "Submit Complaint"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 