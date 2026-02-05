import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export default async function WatchlistPage() {
  const cookieStore = await cookies(); // Next.js 15: await cookies
  
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

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold">Please log in to view your watchlist.</h2>
        </div>
    )
  }

  // Fetch watchlist with stock details
  const { data: watchlist } = await supabase
    .from('watchlists')
    .select(`
      id,
      stock:stocks (
        ticker,
        name,
        sector,
        current_price,
        previous_close
      )
    `)
    .eq('user_id', user.id);

  return (
    <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Watchlist</h2>
          <p className="text-muted-foreground">
            Track your favorite BSE equities.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Holdings</CardTitle>
        </CardHeader>
        <CardContent>
            {!watchlist || watchlist.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">Your watchlist is empty.</p>
                    <Link href="/market" className="text-blue-600 hover:underline">
                        Go to Market to add stocks
                    </Link>
                </div>
            ) : (
                <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Ticker</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {watchlist.map((item: any) => {
                    const stock = item.stock;
                    const change = stock.current_price - stock.previous_close;
                    const percentChange = ((change / stock.previous_close) * 100).toFixed(2);
                    
                    return (
                    <TableRow key={item.id}>
                        <TableCell className="font-bold">
                            <Link href={`/market/${stock.ticker}`} className="hover:underline">
                                {stock.ticker}
                            </Link>
                        </TableCell>
                        <TableCell>{stock.name}</TableCell>
                        <TableCell><Badge variant="outline">{stock.sector}</Badge></TableCell>
                        <TableCell className="text-right font-mono">{stock.current_price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                             <span
                                className={`flex items-center justify-end ${
                                    change > 0 ? "text-emerald-600" : change < 0 ? "text-rose-600" : "text-gray-500"
                                }`}
                                >
                                {change > 0 ? <ArrowUpRight className="h-4 w-4 mr-1"/> : <ArrowDownRight className="h-4 w-4 mr-1"/>}
                                {percentChange}%
                            </span>
                        </TableCell>
                    </TableRow>
                    );
                })}
                </TableBody>
            </Table>
            )}
        </CardContent>
      </Card>
    </div>
  );
}