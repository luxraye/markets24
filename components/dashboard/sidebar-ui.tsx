"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  LineChart, 
  List, 
  FileText, 
  PieChart, 
  ShieldCheck, 
  Settings // <--- Added the icon
} from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Market Data",
    icon: LineChart,
    href: "/market",
    color: "text-violet-500",
  },
  {
    label: "My Watchlist",
    icon: List,
    href: "/watchlist",
    color: "text-pink-700",
  },
  {
    label: "Daily Markets",
    icon: FileText,
    href: "/news",
    color: "text-orange-700",
  },
  {
    label: "Sectors",
    icon: PieChart,
    href: "/sectors",
    color: "text-emerald-500",
  },
];

export function SidebarUI({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">
            Markets<span className="text-blue-500">24</span>
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
          
          {/* --- ADMIN LINK (Conditionally Rendered) --- */}
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition mt-4",
                pathname.startsWith("/admin") ? "text-white bg-white/10" : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <ShieldCheck className="h-5 w-5 mr-3 text-red-500" />
                Admin Panel
              </div>
            </Link>
          )}

        </div>
      </div>

      {/* --- SETTINGS LINK (Anchored at the bottom) --- */}
      <div className="px-3 py-2 border-t border-slate-800">
        <Link
          href="/settings"
          className={cn(
            "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
            pathname === "/settings" ? "text-white bg-white/10" : "text-zinc-400"
          )}
        >
          <div className="flex items-center flex-1">
            <Settings className="h-5 w-5 mr-3 text-gray-400" />
            Settings
          </div>
        </Link>
      </div>
    </div>
  );
}