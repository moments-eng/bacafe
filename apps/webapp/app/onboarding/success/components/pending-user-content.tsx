"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, HourglassIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hebrewContent } from "@/locales/he";
import { ContentProps } from "../types";
import { LoadingIndicator } from "./loading-indicator";
import { UserSummaryCard } from "./user-summary-card";

const { success } = hebrewContent.onboarding.steps;
const { approvalPending } = hebrewContent.app;

export function PendingUserContent({
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
      <div className="space-y-4">
        {userInfo?.enrichment?.summary && (
          <UserSummaryCard summary={userInfo.enrichment.summary} />
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-card rounded-xl border shadow-sm p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <HourglassIcon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold">
                {approvalPending.title}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {approvalPending.message}
            </p>
            <div className="bg-secondary/30 p-3 rounded-lg">
              <p className="text-sm font-medium">
                {approvalPending.explanation}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {approvalPending.waitingList}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3 pt-2"
        >
          <Button
            variant="link"
            className="text-muted-foreground hover:text-primary text-sm w-full"
            onClick={() => onNavigate("/chat")}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {success.chatButton}
          </Button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
