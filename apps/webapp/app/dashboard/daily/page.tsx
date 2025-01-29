"use client";

import { DigestCompletionMessage } from "@/components/daily-digest/digest-completion-message";
import { DigestHeader } from "@/components/daily-digest/digest-header";
import { DigestSection } from "@/components/daily-digest/digest-section";
import { Skeleton } from "@/components/ui/skeleton";
import { useDailyDigest } from "@/hooks/use-daily-digest";
import { QUERY_KEYS } from "@/lib/queries";
import { hebrewContent } from "@/locales/he";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { getLatestDailyDigest } from "./actions";

const { dailyDigest } = hebrewContent;

export default function DailyPage() {
  const { data: digest, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.DAILY_DIGEST],
    queryFn: () => getLatestDailyDigest(),
  });

  const {
    expandedSections,
    completedSections,
    progress,
    toggleSection,
    markAsComplete,
  } = useDailyDigest(digest?.sections.length ?? 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <DigestHeader progress={0} />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!digest) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <p className="text-center text-muted-foreground">
          {dailyDigest.noDigestAvailable}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DigestHeader progress={progress} />

      {/* Main Content */}
      <div className="space-y-6">
        <AnimatePresence>
          {digest.sections.map(
            (section, index) =>
              !completedSections.has(index) && (
                <DigestSection
                  key={section.title}
                  section={section}
                  index={index}
                  onComplete={markAsComplete}
                  isExpanded={expandedSections.has(index)}
                  onToggle={toggleSection}
                />
              )
          )}
        </AnimatePresence>

        {/* Completion Message */}
        {completedSections.size === digest.sections.length && (
          <DigestCompletionMessage />
        )}
      </div>
    </div>
  );
}
