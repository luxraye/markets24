"use server";

import { createClient } from "@/lib/supabase/client";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";

async function createServerSupabase() {
  const cookieStore = await cookies(); // <--- FIXED: Added await
  
  return createServerClient(
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
}

export async function addToWatchlist(ticker: string) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const { data: stock } = await supabase
    .from('stocks')
    .select('id')
    .eq('ticker', ticker)
    .single();

  if (!stock) return { error: "Stock not found" };

  const { error } = await supabase
    .from('watchlists')
    .insert({ user_id: user.id, stock_id: stock.id });

  if (error) return { error: error.message };
  return { success: true };
}

// app/actions.ts (Add this to the bottom)
export async function removeFromWatchlist(watchlistId: string) {
  const supabase = await createServerSupabase();
  
  const { error } = await supabase
    .from('watchlists')
    .delete()
    .eq('id', watchlistId); // Ensure you delete by the WATCHLIST row ID, not stock ID

  if (error) return { error: error.message };
  
  // Revalidate the dashboard and watchlist page so the item disappears immediately
  revalidatePath('/dashboard');
  revalidatePath('/watchlist');
  return { success: true };
}

export async function updateSettings(formData: FormData) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const market_summary = formData.get('market_summary') === 'on';
  const watchlist_alerts = formData.get('watchlist_alerts') === 'on';

  await supabase
    .from('user_settings')
    .upsert({ 
      user_id: user.id, 
      market_summary, 
      watchlist_alerts 
    });

  revalidatePath('/settings');
}
