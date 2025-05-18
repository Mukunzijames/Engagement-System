import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Citizen Engagement System",
  description: "Submit complaints and feedback on public services",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen text-gray-800">
        <Providers>
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
