"use client";
import { hebrewContent } from "@/locales/he";
import { Mail } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { isApproved } from "./actions";

export default async function ApprovalPendingPage() {
  const session = useSession();

  useEffect(() => {
    isApproved().then((approved) => {
      if (approved) {
        session.update({ user: { ...session.data?.user, approved: true } });
        redirect("/dashboard");
      }
    });
  }, []);

  const { approvalPending } = hebrewContent.app;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-2 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-2xl">🎉</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
          {approvalPending.title}
        </h1>
        <p className="text-muted-foreground">{approvalPending.subtitle}</p>
      </div>

      <div className="space-y-4">
        <div className="bg-secondary/30 p-4 rounded-lg">
          <p className="font-medium">{approvalPending.message}</p>
        </div>
        <p className="text-sm leading-relaxed">{approvalPending.explanation}</p>
        <p className="text-sm leading-relaxed">{approvalPending.waitingList}</p>
      </div>

      <div className="border-t pt-4 mt-2">
        <p className="text-center text-sm text-muted-foreground">
          {approvalPending.thankYou}
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          <span>{approvalPending.contact}</span>
          <Mail className="h-4 w-4 text-primary" />
        </div>
      </div>
    </div>
  );
}
