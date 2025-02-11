"use client";

import { useEffect, useRef } from "react";
import { DigestSection } from "@/components/daily-digest/digest-section";
import { Skeleton } from "@/components/ui/skeleton";
import { useDigestFeed } from "@/hooks/use-digest-feed";
import { hebrewContent } from "@/locales/he";
import { Section } from "@/types/daily-digest";
import { AnimatePresence } from "framer-motion";

const { dailyDigest } = hebrewContent;

export default function DailyPage() {
  const { digestPages, isLoading, hasNextPage, fetchNextPage } =
    useDigestFeed();
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  if (!digestPages?.pages[0]?.items.length) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-center text-muted-foreground">
          {dailyDigest.noDigestAvailable}
        </p>
      </div>
    );
  }

  const allDigests = digestPages.pages.flatMap((page) => page.items);

  return (
    <div className="h-screen overflow-hidden bg-black">
      <div className="h-screen snap-y snap-mandatory overflow-y-scroll">
        <AnimatePresence mode="popLayout">
          {allDigests.map((section: Section) => (
            <DigestSection key={section.title} section={section} />
          ))}
        </AnimatePresence>

        {/* Intersection Observer Target */}
        <div
          ref={observerTarget}
          className="h-screen w-full flex items-center justify-center"
        >
          {hasNextPage && (
            <div className="relative">
              <Skeleton className="h-12 w-12 rounded-full animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
