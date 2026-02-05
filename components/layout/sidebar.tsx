"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  LineChart,
  Newspaper,
  PieChart,
  List,
  Settings,
} from "lucide-react";

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
    label: "Daily Markets", // <--- UPDATED
    icon: Newspaper,
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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">
            Markets<span className="text-emerald-500">24</span> {/* <--- UPDATED */}
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href
                  ? "text-white bg-white/10"
                  : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
        <Link
          href="/settings"
          className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition text-zinc-400"
        >
          <div className="flex items-center flex-1">
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </div>
        </Link>
      </div>
    </div>
  );
}