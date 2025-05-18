import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  QueryClient,
  QueryClientProvider as Provider
} from '@tanstack/react-query';
import {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  deleteComplaint,
  getResponses,
  addResponse,
  getCategories,
  createCategory
} from '@/services/api';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Export provider for easy access
export const QueryClientProvider = Provider;

// Complaint Hooks
export const useComplaints = (filters = {}) => {
  return useQuery({
    queryKey: ['complaints', filters],
    queryFn: () => getComplaints(filters),
  });
};

export const useComplaintDetails = (id: number) => {
  return useQuery({
    queryKey: ['complaint', id],
    queryFn: () => getComplaintById(id),
    enabled: !!id,
  });
};

export const useCreateComplaint = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
  });
};

export const useUpdateComplaint = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateComplaint,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['complaint', data.id] });
    },
  });
};

export const useDeleteComplaint = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
  });
};

// Response Hooks
export const useResponses = (complaintId: number) => {
  return useQuery({
    queryKey: ['responses', complaintId],
    queryFn: () => getResponses(complaintId),
    enabled: !!complaintId,
  });
};

export const useAddResponse = (complaintId: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (responseData: any) => addResponse(complaintId, responseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responses', complaintId] });
      queryClient.invalidateQueries({ queryKey: ['complaint', complaintId] });
    },
  });
};

// Category Hooks
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}; 