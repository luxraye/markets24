import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/settings/sign-out-button";
import { updateSettings } from "@/app/actions"; // Ensure this matches your actions file location
import { User, Bell, Shield, Mail } from "lucide-react";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // 1. Get User
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Get User Settings (for default checked state)
  const { data: settings } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user?.id)
    .single();

  return (
    <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account preferences and notifications.</p>
      </div>

      <div className="grid gap-6 max-w-4xl">
        
        {/* Account Information Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              <CardTitle>Account Information</CardTitle>
            </div>
            <CardDescription>
              Your personal account details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  id="email" 
                  value={user?.email || ""} 
                  disabled 
                  className="pl-9 bg-gray-50" 
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Managed via Supabase Auth. Contact support to change.
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4 bg-gray-50/50 flex justify-between items-center">
             <span className="text-sm text-muted-foreground font-mono text-xs">ID: {user?.id.slice(0, 8)}...</span>
             <SignOutButton />
          </CardFooter>
        </Card>

        {/* Notifications Card (Working Form) */}
        <Card>
          <CardHeader>
             <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-600" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure how you receive market alerts.
            </CardDescription>
          </CardHeader>
          
          {/* Server Action Form */}
          <form action={updateSettings}>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="market-summary" className="flex flex-col space-y-1">
                  <span>Daily Market Summary</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Receive a digest of top stories at 8:00 AM.
                  </span>
                </Label>
                {/* 'name' attribute is critical for the FormData in the server action */}
                <Switch 
                  id="market-summary" 
                  name="market_summary" 
                  defaultChecked={settings?.market_summary ?? true} 
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="watchlist-alerts" className="flex flex-col space-y-1">
                  <span>Watchlist Volatility</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Email me if my stocks move by more than 5%.
                  </span>
                </Label>
                <Switch 
                  id="watchlist-alerts" 
                  name="watchlist_alerts" 
                  defaultChecked={settings?.watchlist_alerts ?? false} 
                />
              </div>
            </CardContent>
            
            <CardFooter className="border-t px-6 py-4 bg-gray-50/50">
              <Button type="submit">Save Preferences</Button>
            </CardFooter>
          </form>
        </Card>

        {/* Security Card */}
        <Card>
           <CardHeader>
             <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              <CardTitle>Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium">Password</p>
                    <p className="text-xs text-muted-foreground">Last changed: Never</p>
                </div>
                <Button variant="outline">Reset Password</Button>
             </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}