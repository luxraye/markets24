import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// --- CRITICAL CHANGE HERE ---
// Switch from the old layout sidebar to the new dashboard sidebar that checks Admin status
import { Sidebar } from "@/components/dashboard/sidebar"; 
// ----------------------------

import { MobileSidebar } from "@/components/layout/mobile-sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BWP Data | Botswana Financial Insights",
  description: "Real-time market data for the Botswana Stock Exchange",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="h-full relative">
          {/* Desktop Sidebar */}
          <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
            {/* This now renders the "Smart" Sidebar with the Admin check */}
            <Sidebar />
          </div>

          {/* Main Content Area */}
          <main className="md:pl-72 h-full">
            {/* Mobile Header */}
            <div className="flex items-center p-4 md:hidden border-b">
                <MobileSidebar />
                <div className="ml-4 font-bold text-lg">BWP Data</div>
            </div>
            
            {/* Page Content */}
            <div className="h-full">
                {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}