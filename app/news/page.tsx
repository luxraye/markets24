import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
// Note: We use a standard <img> tag for simplicity with external URLs, 
// but in production, Next.js <Image> is better if domains are configured.

export default async function DailyMarketsPage() {
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

  const { data: news } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false });

  return (
    <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Daily Markets</h2>
          <p className="text-muted-foreground">Breaking financial headlines and exclusive reports.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {news?.map((article) => (
          <Link key={article.id} href={`/news/${article.id}`} className="group h-full">
            <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-200 border-gray-200 overflow-hidden">
              
              {/* Image Section */}
              <div className="h-48 w-full bg-gray-200 relative overflow-hidden">
                {article.image_url ? (
                  <img 
                    src={article.image_url} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  // Fallback Gradient if no image
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white/50">
                    <span className="text-4xl font-bold opacity-20">Markets24</span>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                   <Badge variant="secondary" className="bg-white/90 text-black backdrop-blur-sm shadow-sm hover:bg-white">
                      {article.category || "Business"}
                   </Badge>
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-lg leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col justify-between">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {article.snippet?.replace(/<[^>]*>/g, "")}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t">
                  <div className="flex items-center text-xs text-muted-foreground">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      {article.published_at 
                        ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true }) 
                        : "Today"}
                  </div>
                  <div className="flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                      Read Story <ArrowRight className="ml-1 h-3 w-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}