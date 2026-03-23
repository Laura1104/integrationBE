import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Fakestagram",
  description: "Instagram clone — teaching project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {/* Sidebar is a client component (uses usePathname) */}
        <Sidebar />

        {/* Main content — offset left by sidebar width on desktop, add bottom padding for mobile nav */}
        <main className="lg:pl-64 min-h-screen pb-20 lg:pb-0">
          {children}
        </main>
        <Toaster position="bottom-center" richColors />
      </body>
    </html>
  );
}
