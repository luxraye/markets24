import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, LineChart, ShieldCheck, Newspaper } from "lucide-react";
import { Navbar } from "@/components/layout/navbar"; // <--- Import the Navbar

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Navbar /> {/* <--- Add the Navbar here */}
      
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-24 text-center space-y-8 px-4">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900">
            Markets<span className="text-blue-600">24</span>
          </h1>
          <p className="text-2xl text-muted-foreground font-light">
            Botswana's premier financial intelligence platform.
          </p>
          <p className="text-base text-gray-500 max-w-[600px] mx-auto">
             Real-time BSE data, exclusive sector reports, and personalized watchlists for the modern investor.
          </p>
        </div>
        
        <div className="flex gap-4">
          {/* This button will now trigger the Middleware if logged out! */}
          <Link href="/dashboard">
            <Button size="lg" className="h-12 px-8 text-lg gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">
              Launch Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid md:grid-cols-3 gap-8 px-8 pb-24 max-w-6xl mx-auto w-full">
        <Card className="border-none shadow-md bg-white/50 backdrop-blur">
          <CardHeader>
            <LineChart className="h-12 w-12 text-emerald-500 mb-4" />
            <CardTitle>BSE Market Data</CardTitle>
            <CardDescription>
              Live tracking of share prices, volume, and DCI performance for all domestic companies.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-none shadow-md bg-white/50 backdrop-blur">
          <CardHeader>
            <Newspaper className="h-12 w-12 text-orange-500 mb-4" />
            <CardTitle>Daily Markets</CardTitle>
            <CardDescription>
              Exclusive reporting on mergers, acquisitions, and earnings from Gabz FM Business News.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-none shadow-md bg-white/50 backdrop-blur">
          <CardHeader>
            <ShieldCheck className="h-12 w-12 text-indigo-500 mb-4" />
            <CardTitle>Secure Watchlist</CardTitle>
            <CardDescription>
              Bank-grade security with Row Level Security (RLS) ensuring your portfolio data remains private.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
      
    </div>
  );
}