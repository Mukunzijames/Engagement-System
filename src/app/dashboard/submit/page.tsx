"use client";

import { ComplaintForm } from "@/components/ComplaintForm";

export default function SubmitComplaintPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Submit a Complaint</h1>
      <ComplaintForm />
    </div>
  );
} 