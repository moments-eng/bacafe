"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { hebrewContent } from "@/locales/he";

const { success } = hebrewContent.onboarding.steps;

interface UserSummaryCardProps {
  summary: string;
}

export function UserSummaryCard({ summary }: UserSummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border shadow-sm p-4 space-y-3"
    >
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 p-2 rounded-full">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-base font-semibold">{success.greeting}</h2>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
    </motion.div>
  );
}
