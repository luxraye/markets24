"use client";

import { useRef, useState } from "react";
import { promoteUserToAdmin } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function PromoteUserForm() {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    
    // Call the server action safely
    const result = await promoteUserToAdmin(formData);
    
    setLoading(false);

    if (result?.error) {
      alert(`Error: ${result.error}`);
    } else {
      alert("Success! User has been promoted.");
      formRef.current?.reset();
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">User Email</Label>
        <Input 
          id="email" 
          name="email" 
          placeholder="colleague@markets24.bw" 
          required 
        />
        <p className="text-xs text-muted-foreground">
          The user must already have a Markets24 account.
        </p>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Promote to Admin
      </Button>
    </form>
  );
}