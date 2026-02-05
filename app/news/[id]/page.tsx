import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Share2, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

  // Fetch the specific article
  const { data: article } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single();

  if (!article) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header / Nav */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link 
            href="/dashboard" 
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="px-3 py-1 text-sm">
                {article.category || "Business"}
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center">
                <CalendarDays className="h-4 w-4 mr-2" />
                {article.published_at 
                  ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true }) 
                  : "Recently"}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
              By {article.source || "Markets24 Reporter"}
            </div>
          </div>

          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0">
               {/* If we have 'content', display it. 
                  If not (e.g. RSS item with no full text), display the snippet + disclaimer.
               */}
              {article.content ? (
                <div className="prose prose-lg prose-gray max-w-none">
                  <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
                    {article.content}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                    <p className="text-lg leading-relaxed text-gray-700">
                        {article.snippet}
                    </p>
                    <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                        This is a syndicated news snippet. 
                        <a href={article.url || "#"} target="_blank" className="underline ml-1 font-semibold">
                            Read the full story on the source website.
                        </a>
                    </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}