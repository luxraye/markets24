"use client";

import { Trash2 } from "lucide-react";
import { removeFromWatchlist } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteWatchlistButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if(!confirm("Remove from watchlist?")) return;
    setLoading(true);
    await removeFromWatchlist(id);
    setLoading(false);
    router.refresh();
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleDelete} 
      disabled={loading}
      className="h-8 w-8 text-muted-foreground hover:text-rose-600"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}