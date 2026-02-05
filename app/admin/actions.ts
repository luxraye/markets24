"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Helper: Get Supabase Client & Verify Admin
async function getAuthenticatedAdmin() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (roleData?.role !== 'admin') throw new Error("Forbidden: Admins only");

  return { supabase, user };
}

// Helper: Admin Client (Bypasses RLS for User Management)
// We only use this when we've already verified the user is an admin above
function getServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// --- NEWS MANAGEMENT ---

export async function createArticle(formData: FormData) {
  try {
    const { supabase } = await getAuthenticatedAdmin(); // <--- SECURITY CHECK
    
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const image_url = formData.get("image_url") as string;
    const snippet = content.substring(0, 150) + "...";

    const { error } = await supabase.from("news").insert({
      title, content, snippet, category, image_url,
      source: "Markets24 Editorial",
      published_at: new Date().toISOString(),
    });

    if (error) return { error: error.message };
  } catch (e) {
    return { error: "Unauthorized" };
  }
  
  revalidatePath("/admin/news");
  redirect("/admin/news");
}

export async function deleteArticle(id: string) {
  try {
    const { supabase } = await getAuthenticatedAdmin(); // <--- SECURITY CHECK
    const { error } = await supabase.from("news").delete().eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/admin/news");
    return { success: true };
  } catch (e) {
    return { error: "Unauthorized" };
  }
}

// --- USER MANAGEMENT (Promote Admin) ---

export async function promoteUserToAdmin(formData: FormData) {
  try {
    await getAuthenticatedAdmin(); // <--- Verify requester is an admin first

    const email = formData.get("email") as string;
    if (!email) return { error: "Email is required" };

    // Use Service Role to find User ID by Email (Normal client can't see emails)
    const supabaseAdmin = getServiceRoleClient();
    
    // We need to list users to find the ID. 
    // Note: listUsers() is an admin-only function.
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) return { error: error.message };
    
    const targetUser = users.find(u => u.email === email);
    if (!targetUser) return { error: "User not found. Have they signed up?" };

    // Insert role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .upsert({ user_id: targetUser.id, role: 'admin' });

    if (roleError) return { error: roleError.message };

    revalidatePath("/admin/users");
    return { success: true };

  } catch (e) {
    return { error: "Unauthorized" };
  }
}
export async function triggerScraper(type: 'stocks' | 'news') {
  try {
    await getAuthenticatedAdmin(); // <--- Verify requester is an admin

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    
    // Call the API route we created earlier
    await fetch(`${baseUrl}/api/cron/update-${type}`, { 
      method: 'GET',
      cache: 'no-store' 
    });

    revalidatePath("/dashboard");
    revalidatePath("/market");
    return { success: true };

  } catch (e) {
    return { error: "Unauthorized or Failed" };
  }
}