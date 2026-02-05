import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, UserPlus } from "lucide-react";
// IMPORT THE NEW COMPONENT
import { PromoteUserForm } from "@/components/admin/promote-user-form";

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );

  const { data: roles } = await supabase.from("user_roles").select("*");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Management</h1>
        <p className="text-slate-500">Grant administrative access to other team members.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        
        {/* INVITE FORM */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" /> Add New Admin
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* USE THE NEW COMPONENT HERE */}
            <PromoteUserForm />
          </CardContent>
        </Card>

        {/* EXISTING ADMINS LIST */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" /> Current Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roles?.map((role) => (
                <div key={role.id} className="flex items-center justify-between p-3 border rounded bg-slate-50">
                  <span className="font-mono text-xs text-slate-600 truncate max-w-[200px]">
                    {role.user_id}
                  </span>
                  <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded font-medium capitalize">
                    {role.role}
                  </span>
                </div>
              ))}
              {(!roles || roles.length === 0) && (
                <p className="text-sm text-muted-foreground">No admins found.</p>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}