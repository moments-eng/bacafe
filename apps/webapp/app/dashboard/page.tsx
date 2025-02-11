"use server";

import { auth } from "@/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { hebrewContent } from "@/locales/he";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;
  const { dashboard } = hebrewContent;

  return (
    <div className="mobile-container">
      <main>
        {/* Welcome Section */}
        <div className="text-center mb-6">
          <p className="text-base text-primary font-medium">
            ברוכים הבאים, {user?.name || "אורח"}
          </p>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight">
            {dashboard.headline}
          </h1>
          <p className="text-lg font-medium text-muted-foreground">
            {dashboard.tagline}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {dashboard.description}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {Object.entries(dashboard.stats).map(([key, label]) => (
            <Card key={key} className="p-3 text-center bg-card/50">
              <div className="text-xl font-bold text-primary">
                {key === "sources"
                  ? "100+"
                  : key === "articles"
                    ? "100K+"
                    : "10K+"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="pt-4">
          <Link href="/dashboard/daily" className="block">
            <Button
              size="lg"
              className="w-full text-base font-medium h-14 rounded-full"
            >
              {dashboard.cta}
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
