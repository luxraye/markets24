import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // 1. Fetch BSE Market Summary with a real User-Agent to avoid being blocked
    const response = await fetch("https://www.bse.co.bw/market-summary/", {
      next: { revalidate: 0 },
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });
    
    const html = await response.text();
    const $ = cheerio.load(html);
    const stocks: any[] = [];

    // 2. ROBUST SCRAPING STRATEGY: Scan every table row
    $("tr").each((index, element) => {
      const tds = $(element).find("td");
      
      // A valid stock row usually has at least 3 columns
      if (tds.length < 3) return; 

      // Extract text content 
      const col0 = $(tds[0]).text().trim(); // Likely Ticker
      const col2 = $(tds[2]).text().trim(); // Likely Price (or Col 3)

      // 3. Validation: Is 'col0' a ticker? (Uppercase, no spaces, 3-10 chars)
      const tickerRegex = /^[A-Z0-9-]{3,10}$/;
      const price = parseFloat(col2.replace(/,/g, ""));

      if (tickerRegex.test(col0) && !isNaN(price)) {
         stocks.push({
            ticker: col0,
            current_price: price,
            volume: 0, // Hard to pinpoint volume column safely without specific ID
            last_updated: new Date().toISOString(),
            name: col0, // Default name to ticker
            sector: "Unknown"
         });
      }
    });

    // 4. Update Database
    let updateCount = 0;
    for (const stock of stocks) {
      // Filter out header row keywords
      if (stock.ticker === "SECURITY" || stock.ticker === "TRADES") continue;

      const { error } = await supabase
        .from("stocks")
        .upsert(
            { 
              ticker: stock.ticker, 
              current_price: stock.current_price,
              last_updated: stock.last_updated
            },
            { onConflict: "ticker" } 
        );
      
      if (!error) updateCount++;
    }

    return NextResponse.json({ 
        success: true, 
        found_in_html: stocks.length,
        updated_in_db: updateCount,
        sample_stock: stocks[0] || "None"
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}