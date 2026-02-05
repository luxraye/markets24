import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SidebarUI } from "@/components/dashboard/sidebar-ui";

export async function Sidebar() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );

  // 1. Get Current User
  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;

  // 2. Check Role if user exists
  if (user) {
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();
    
    isAdmin = roleData?.role === 'admin';
  }

  // 3. Render the UI with the permission flag
  return <SidebarUI isAdmin={isAdmin} />;
}