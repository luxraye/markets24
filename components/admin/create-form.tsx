"use client";

import { useRef, useState } from "react";
import { createArticle } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export function CreateNewsForm() {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    
    // Call the server action
    const result = await createArticle(formData);
    
    setLoading(false);

    if (result?.error) {
      alert(`Error: ${result.error}`);
    } else {
      // Success! Clear the form
      formRef.current?.reset();
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Headline</Label>
        <Input id="title" name="title" placeholder="e.g. Market Rallies..." required />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input id="category" name="category" placeholder="e.g. Banking" required />
      </div>

      <div className="space-y-2">
         <Label htmlFor="image_url">Image URL</Label>
         <Input id="image_url" name="image_url" placeholder="https://..." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Full Content</Label>
        <Textarea 
          id="content" 
          name="content" 
          placeholder="Paste article text here..." 
          className="min-h-[200px]" 
          required 
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Publish Article
      </Button>
    </form>
  );
}