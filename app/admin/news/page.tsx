import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { deleteArticle } from "@/app/admin/actions";
import { DeleteNewsButton } from "@/components/admin/delete-news-button";
// Import your new component
import { CreateNewsForm } from "@/components/admin/create-form";

export default async function AdminNewsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );

  const { data: news } = await supabase.from("news").select("*").order("published_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-slate-900">News Management</h1>
           <p className="text-slate-500">Create, edit, or remove articles.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* CREATE FORM (Left Column) */}
        <Card className="lg:col-span-1 h-fit sticky top-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" /> Write New Article
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Replaced the raw form with the new Client Component */}
            <CreateNewsForm />
          </CardContent>
        </Card>

        {/* LIST (Right Column) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Published Articles ({news?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {news?.map((article) => (
                <div key={article.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-slate-50">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">{article.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{article.snippet}</p>
                    <div className="flex gap-2 text-xs text-slate-400 mt-2">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{article.category}</span>
                      <span>{new Date(article.published_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {/* Delete Button */}
                  <DeleteNewsButton id={article.id} title={article.title} />
                  
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}