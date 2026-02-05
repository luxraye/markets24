import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, CalendarDays } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export function NewsCard({ news }: { news: any[] }) {
  const validNews = news?.filter(item => item.title && item.title !== "No Title") || [];

  return (
    <Card className="col-span-3 h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-orange-600" />
          Latest Headlines
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Live feed from Markets24 & Gabz FM
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {validNews.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>No recent news found.</p>
            </div>
          ) : (
            validNews.map((article) => (
              <Link key={article.id} href={`/news/${article.id}`} className="block group">
                <div className="flex items-start border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-semibold leading-tight group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {article.snippet?.replace(/<[^>]*>/g, "")}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors border-transparent bg-secondary text-secondary-foreground">
                        {article.category || "Business"}
                      </span>
                      <span className="flex items-center text-xs text-muted-foreground">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        {article.published_at 
                          ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true }) 
                          : "Today"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}