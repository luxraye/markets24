import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function MarketPage() {
  // 1. Initialize Supabase on the server
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

  // 2. Fetch REAL data from the 'stocks' table
  const { data: stocks, error } = await supabase
    .from('stocks')
    .select('*')
    .order('ticker', { ascending: true });

  if (error) {
    console.error("Error fetching stocks:", error);
  }

  return (
    <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Market Data</h2>
          <p className="text-muted-foreground">
            Live prices for all BSE listed equities.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equities Board</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Ticker</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead className="text-right">Price (BWP)</TableHead>
                <TableHead className="text-right">Change (%)</TableHead>
                <TableHead className="text-right">Volume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* 3. Map through the REAL database rows */}
              {stocks?.map((stock) => {
                // Calculate pseudo-change if not in DB, or use DB fields if you added them
                const change = stock.current_price - stock.previous_close;
                const percentChange = ((change / stock.previous_close) * 100);
                
                return (
                  <TableRow key={stock.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/market/${stock.ticker}`}
                        className="text-blue-600 hover:underline"
                      >
                        {stock.ticker}
                      </Link>
                    </TableCell>
                    <TableCell>{stock.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {stock.sector}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {stock.current_price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      <span
                        className={`flex items-center justify-end ${
                          change > 0
                            ? "text-emerald-600"
                            : change < 0
                            ? "text-rose-600"
                            : "text-gray-500"
                        }`}
                      >
                        {change > 0 ? (
                          <ArrowUpRight className="mr-1 h-4 w-4" />
                        ) : change < 0 ? (
                          <ArrowDownRight className="mr-1 h-4 w-4" />
                        ) : (
                          <Minus className="mr-1 h-4 w-4" />
                        )}
                        {Math.abs(percentChange).toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {/* Randomizing volume for demo if not in DB, or use stock.volume */}
                      {stock.volume ? stock.volume.toLocaleString() : "---"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}