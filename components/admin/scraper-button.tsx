"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { triggerScraper } from "@/app/admin/actions";

export function ScraperButton({ type }: { type: 'stocks' | 'news' }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await triggerScraper(type);
    setLoading(false);
    alert(`${type} update triggered!`);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleClick} disabled={loading}>
      <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
      {loading ? "Running..." : "Run Now"}
    </Button>
  );
}