import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownRight, Minus, Briefcase, Layers } from "lucide-react";
import Link from "next/link";

export default async function SectorsPage() {
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

  // 1. Fetch ALL stocks
  const { data: stocks } = await supabase
    .from("stocks")
    .select("*")
    .order("ticker", { ascending: true });

  if (!stocks) return <div>Loading...</div>;

  // 2. Group stocks by Sector dynamically
  const sectors: Record<string, typeof stocks> = {};
  stocks.forEach((stock) => {
    const sectorName = stock.sector || "Unclassified";
    if (!sectors[sectorName]) sectors[sectorName] = [];
    sectors[sectorName].push(stock);
  });

  const sectorNames = Object.keys(sectors).sort();

  return (
    <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Sector Spotlight</h2>
        <p className="text-muted-foreground">
          Performance analysis across {sectorNames.length} key industries.
        </p>
      </div>

      {/* Sector Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {sectorNames.slice(0, 4).map((name) => (
          <Card key={name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{name}</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sectors[name].length}</div>
              <p className="text-xs text-muted-foreground">Listed Companies</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content: Tabs for Each Sector */}
      <Card className="min-h-[500px]">
        <CardHeader>
          <CardTitle>Industry Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={sectorNames[0]} className="w-full">
            <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent justify-start mb-6">
              {sectorNames.map((name) => (
                <TabsTrigger 
                  key={name} 
                  value={name}
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white border px-4 py-2"
                >
                  {name}
                </TabsTrigger>
              ))}
            </TabsList>

            {sectorNames.map((name) => (
              <TabsContent key={name} value={name} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {sectors[name].map((stock) => {
                    // Calc change
                    const prev = stock.previous_close || stock.current_price;
                    const change = stock.current_price - prev;
                    const percent = ((change / prev) * 100).toFixed(2);
                    const isUp = change >= 0;

                    return (
                      <Link key={stock.id} href={`/market/${stock.ticker}`}>
                        <div className="flex items-center justify-between p-4 rounded-lg border bg-white hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${isUp ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                               <Briefcase className={`h-4 w-4 ${isUp ? 'text-emerald-600' : 'text-rose-600'}`} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{stock.ticker}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1 w-32">{stock.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-mono font-semibold">{stock.current_price.toFixed(2)}</p>
                            <p className={`text-xs flex items-center justify-end ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                               {isUp ? <ArrowUpRight className="h-3 w-3 mr-1"/> : <ArrowDownRight className="h-3 w-3 mr-1"/>}
                               {percent}%
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}