import type { Metadata } from "next";
import "../globals.css";
import { Header } from "@/components/Header";
import { Providers } from "../providers";

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
      <body className="bg-white min-h-screen text-gray-800">
        <Providers>
        <Header />
        <main className="w-full bg-white">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}