import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, FileText, BarChart3, Users } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  
  // 1. Create the Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
      },
    }
  );

  // 2. Get Current User
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.log("Admin Layout: No user found, redirecting to login.");
    redirect("/login");
  }

  // --- DEBUGGING LOGS START ---
  console.log("------------------------------------------------");
  console.log("Admin Layout Check for User:", user.email);
  console.log("User ID:", user.id);

  // 3. Fetch User Role
  const { data: roleData, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  console.log("DB Result - Role:", roleData?.role);
  console.log("DB Result - Error:", error?.message);
  console.log("------------------------------------------------");
  // --- DEBUGGING LOGS END ---

  const isAdmin = roleData?.role === 'admin';

  if (!isAdmin) {
    // If this hits, check your terminal logs to see WHY
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:block shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold tracking-tight">Markets<span className="text-blue-500">24</span> Admin</h2>
          <p className="text-xs text-slate-400 mt-1">Administrator Control</p>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
          <Link href="/admin/news" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
            <FileText className="h-4 w-4" /> Manage News
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
            <Users className="h-4 w-4" /> Manage Admins
          </Link>
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-blue-400 hover:bg-slate-800 transition-colors mt-8">
            <BarChart3 className="h-4 w-4" /> View Live App
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}