import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function Navbar() {
  // Check if user is logged in
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

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
      <Link className="flex items-center justify-center" href="/">
        <span className="font-bold text-xl tracking-tight">
          Markets<span className="text-blue-600">24</span>
        </span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        {user ? (
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        ) : (
          <>
            <Link href="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/login">
              <Button>Get Started</Button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}