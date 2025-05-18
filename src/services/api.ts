import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Complaints
export const getComplaints = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, String(value));
  });
  
  const response = await API.get(`/complaints?${params.toString()}`);
  return response.data;
};

export const getComplaintById = async (id: number) => {
  const response = await API.get(`/complaints/${id}`);
  return response.data;
};

export const createComplaint = async (complaint: any) => {
  const response = await API.post('/complaints', complaint);
  return response.data;
};

export const updateComplaint = async ({ id, ...data }: { id: number, [key: string]: any }) => {
  const response = await API.patch(`/complaints/${id}`, data);
  return response.data;
};

export const deleteComplaint = async (id: number) => {
  const response = await API.delete(`/complaints/${id}`);
  return response.data;
};

// Responses
export const getResponses = async (complaintId: number) => {
  const response = await API.get(`/complaints/${complaintId}/responses`);
  return response.data;
};

export const addResponse = async (complaintId: number, responseData: any) => {
  const response = await API.post(`/complaints/${complaintId}/responses`, responseData);
  return response.data;
};

// Categories
export const getCategories = async () => {
  const response = await API.get('/categories');
  return response.data;
};

export const createCategory = async (category: any) => {
  const response = await API.post('/categories', category);
  return response.data;
}; 