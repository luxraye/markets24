import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight, Minus, EyeOff } from "lucide-react";
import { DeleteWatchlistButton } from "@/components/dashboard/delete-button";

export async function WatchlistCard() {
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

  if (!user) return null;

  // 2. Fetch Watchlist with joined Stock data
  // We explicitly select the 'id' of the watchlist row to allow deletion
  const { data: watchlist } = await supabase
    .from('watchlists')
    .select(`
      id,
      stock:stocks (
        id,
        ticker,
        name,
        current_price,
        previous_close,
        sector
      )
    `)
    .eq('user_id', user.id);

  const hasItems = watchlist && watchlist.length > 0;

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>My Watchlist</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasItems ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground space-y-2">
            <EyeOff className="h-8 w-8 opacity-50" />
            <p>Your watchlist is empty.</p>
            <p className="text-xs">Go to "Market Data" to add stocks.</p>
            <Link href="/market" className="text-sm text-blue-600 hover:underline">
              Browse Market
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticker</TableHead>
                <TableHead className="hidden sm:table-cell">Company</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Change</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {watchlist.map((item: any) => {
                const stock = item.stock;
                if (!stock) return null;

                // Calculate Change
                const prev = stock.previous_close || stock.current_price;
                const change = stock.current_price - prev;
                const percent = ((change / prev) * 100).toFixed(2);
                const isUp = change >= 0;
                const isNeutral = change === 0;

                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <Link href={`/market/${stock.ticker}`} className="hover:underline text-blue-600">
                        {stock.ticker}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                      {stock.name}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {stock.current_price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                       <span className={`flex items-center justify-end text-xs font-medium ${
                         isUp ? "text-emerald-600" : isNeutral ? "text-gray-500" : "text-rose-600"
                       }`}>
                        {isUp && !isNeutral && <ArrowUpRight className="mr-1 h-3 w-3" />}
                        {!isUp && !isNeutral && <ArrowDownRight className="mr-1 h-3 w-3" />}
                        {isNeutral && <Minus className="mr-1 h-3 w-3" />}
                        {Math.abs(Number(percent))}%
                      </span>
                    </TableCell>
                    <TableCell>
                      {/* Pass the WATCHLIST ROW ID, not the stock ID */}
                      <DeleteWatchlistButton id={item.id} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}