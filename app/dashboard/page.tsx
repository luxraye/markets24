import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { MarketChart } from "@/components/dashboard/market-chart";
import { WatchlistCard } from "@/components/dashboard/watchlist-card";
import { NewsCard } from "@/components/dashboard/news-card";

export default async function DashboardPage() {
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

  // Parallel Fetch: News + Indices
  const [newsResult, indicesResult] = await Promise.all([
    supabase.from('news').select('*').order('published_at', { ascending: false }).limit(4),
    supabase.from('market_indices').select('*').order('symbol', { ascending: true })
  ]);

  const news = newsResult.data || [];
  const indices = indicesResult.data || [];

  return (
    <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Market Overview</h2>
          <p className="text-muted-foreground">Real-time insights into the Botswana economy.</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {indices.length > 0 ? indices.map((metric) => (
          <Card key={metric.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              {metric.trend === "up" ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-rose-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}{metric.symbol === 'CPI' ? '%' : ''}</div>
              <p className="text-xs text-muted-foreground">
                <span className={metric.change_percent >= 0 ? "text-emerald-500" : "text-rose-500"}>
                  {metric.change_percent > 0 ? "+" : ""}{metric.change_percent}%
                </span> from yesterday
              </p>
            </CardContent>
          </Card>
        )) : (
            // Loading State Mock
           [1,2,3,4].map(i => (
             <Card key={i}><CardContent className="h-24 flex items-center justify-center text-muted-foreground">Loading...</CardContent></Card>
           ))
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>BSE Domestic Company Index (DCI)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <MarketChart />
          </CardContent>
        </Card>

        {/* Real News Feed */}
        <NewsCard news={news} />
      </div>

      <div className="grid gap-4 md:grid-cols-1">
          <WatchlistCard />
      </div>
    </div>
  );
}