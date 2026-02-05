"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh(); // Clear the cache so the middleware kicks in
  };

  return (
    <Button 
      variant="destructive" 
      onClick={handleSignOut} 
      disabled={loading}
      className="gap-2"
    >
      <LogOut className="h-4 w-4" />
      {loading ? "Signing out..." : "Sign Out"}
    </Button>
  );
}