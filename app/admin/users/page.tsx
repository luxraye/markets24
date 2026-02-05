import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, UserPlus } from "lucide-react";
import { promoteUserToAdmin } from "@/app/admin/actions";

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );

  // Fetch all assigned roles
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
            <form action={promoteUserToAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">User Email</Label>
                <Input id="email" name="email" placeholder="colleague@markets24.bw" required />
                <p className="text-xs text-muted-foreground">
                  The user must already have a Markets24 account.
                </p>
              </div>
              <Button type="submit" className="w-full">Promote to Admin</Button>
            </form>
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
                <p className="text-sm text-muted-foreground">No admins found (Wait, how are you seeing this?)</p>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}