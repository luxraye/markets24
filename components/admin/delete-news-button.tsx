"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteArticle } from "@/app/admin/actions";
import { useRouter } from "next/navigation";

export function DeleteNewsButton({ id, title }: { id: string, title: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    // 1. Confirm intention (Prevents accidental clicks)
    const confirmed = window.confirm(`Are you sure you want to delete "${title}"?`);
    if (!confirmed) return;

    setLoading(true);

    // 2. Call Server Action
    const result = await deleteArticle(id);

    if (result?.error) {
      alert(`Error: ${result.error}`);
      setLoading(false);
    } else {
      // Success! Refresh the page to show it's gone
      router.refresh();
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleDelete} 
      disabled={loading}
      className="text-red-500 hover:text-red-600 hover:bg-red-50"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
}