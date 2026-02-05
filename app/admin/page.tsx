import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Database, FileText, RefreshCw, Users } from "lucide-react";
import { triggerScraper } from "@/app/admin/actions";

// Client component for the trigger buttons to handle loading states
import { ScraperButton } from "@/components/admin/scraper-button";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { get(name: string) { return cookieStore.get(name)?.value; } },
    }
  );

  // Fetch quick stats
  const [newsCount, stockCount] = await Promise.all([
    supabase.from("news").select("*", { count: "exact", head: true }),
    supabase.from("stocks").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Overview</h1>
        <p className="text-slate-500">Welcome back. Here is what's happening on Markets24.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newsCount.count || 0}</div>
            <p className="text-xs text-muted-foreground">Published news stories</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tracked Stocks</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockCount.count || 0}</div>
            <p className="text-xs text-muted-foreground">Companies in database</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">Healthy</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Data Pipeline Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Force Stock Update</p>
                <p className="text-sm text-slate-500">Run the BSE scraper immediately.</p>
              </div>
              <ScraperButton type="stocks" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-medium">Force News Sync</p>
                <p className="text-sm text-slate-500">Fetch latest RSS from Mmegi.</p>
              </div>
              <ScraperButton type="news" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}