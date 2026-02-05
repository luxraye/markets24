import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { MarketChart } from "@/components/dashboard/market-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WatchlistButton } from "@/components/market/watchlist-button";

export default async function StockDetailPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  // 1. CRITICAL FIX: Await the params before using properties
  const { ticker } = await params;

  // 2. Initialize Supabase
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

  // 3. Fetch Real Stock Data from DB
  const { data: stock } = await supabase
    .from("stocks")
    .select("*")
    .eq("ticker", ticker) 
    .single();

  // Handle 404 if stock doesn't exist in your DB
  if (!stock) {
    return notFound();
  }

  // 4. Calculate dynamic change (using DB data)
  const previousClose = stock.previous_close || stock.current_price;
  const change = stock.current_price - previousClose;
  const percentChange = ((change / previousClose) * 100).toFixed(2);
  const isPositive = change >= 0;

  return (
    <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
      <Link
        href="/market"
        className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Market
      </Link>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold tracking-tight">{stock.ticker}</h1>
            <Badge className="text-base px-3 py-1">{stock.sector || "Equity"}</Badge>
          </div>
          <p className="text-xl text-muted-foreground mt-2">
            {stock.name}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-3xl font-bold">{stock.current_price.toFixed(2)}</div>
            <div className={`font-medium ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
              {isPositive ? "+" : ""}{percentChange}% ({change.toFixed(2)})
            </div>
          </div>
          
          <WatchlistButton ticker={stock.ticker} /> 
          
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Price History (1 Year)</CardTitle>
        </CardHeader>
        <CardContent>
          <MarketChart />
        </CardContent>
      </Card>

       {/* Stats Grid - Populated with Real DB Data */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Previous Close", value: stock.previous_close?.toFixed(2) || "N/A" },
          { label: "Open", value: stock.current_price.toFixed(2) }, // Mocking Open as Current
          { label: "Volume", value: stock.volume?.toLocaleString() || "---" },
          { label: "P/E Ratio", value: "12.4" }, // Hardcoded for MVP
          { label: "Market Cap", value: "850M" }, // Hardcoded for MVP
          { label: "52 Week High", value: (stock.current_price * 1.1).toFixed(2) }, // Mock logic
          { label: "52 Week Low", value: (stock.current_price * 0.9).toFixed(2) }, // Mock logic
          { label: "Dividend Yield", value: "4.2%" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}