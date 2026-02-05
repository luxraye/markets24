"use client";

import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { addToWatchlist } from "@/app/actions";
import { useState } from "react";

export function WatchlistButton({ ticker }: { ticker: string }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleClick = async () => {
    setLoading(true);
    const result = await addToWatchlist(ticker);
    setLoading(false);

    if (result.success) {
      setStatus("success");
      alert("Added to watchlist!"); // Simple feedback for the demo
    } else {
      setStatus("error");
      alert(result.error);
    }
  };

  return (
    <Button 
      size="lg" 
      className={`gap-2 ${status === "success" ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
      onClick={handleClick}
      disabled={loading || status === "success"}
    >
      <Star className={`h-4 w-4 ${status === "success" ? "fill-white" : ""}`} />
      {loading ? "Adding..." : status === "success" ? "Added" : "Add to Watchlist"}
    </Button>
  );
}