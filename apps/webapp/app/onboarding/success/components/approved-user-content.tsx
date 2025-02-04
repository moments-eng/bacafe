"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { hebrewContent } from "@/locales/he";
import { ContentProps } from "../types";
import { LoadingIndicator } from "./loading-indicator";
import { UserSummaryCard } from "./user-summary-card";
import { DigestSettingsCard } from "./digest-settings-card";

const { success } = hebrewContent.onboarding.steps;

export function ApprovedUserContent({
  userInfo,
  loading,
  onNavigate,
}: ContentProps) {
  if (loading.isLoading) {
    return (
      <LoadingIndicator status={loading.status} progress={loading.progress} />
    );
  }

  return (
    <AnimatePresence>
      <div className="space-y-3">
        {userInfo?.enrichment?.summary && (
          <UserSummaryCard summary={userInfo.enrichment.summary} />
        )}
        {userInfo && <DigestSettingsCard userInfo={userInfo} />}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-2"
        >
          <Button
            className="w-full h-11 rounded-lg bg-gradient-to-r from-primary to-primary/60 hover:from-primary/90 hover:to-primary/50"
            onClick={() => onNavigate("/dashboard")}
          >
            {success.cta}
          </Button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
