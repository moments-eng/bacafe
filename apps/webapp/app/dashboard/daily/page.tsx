"use client";

import { useEffect, useRef, useState } from "react";
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
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const handleNavigateNext = () => {
    const allDigests = digestPages?.pages.flatMap((page) => page.items) || [];
    if (currentIndex < allDigests.length - 1) {
      setCurrentIndex(currentIndex + 1);
      // Find the next section's element and scroll to it
      const nextSection = document.querySelector(
        `[data-index="${currentIndex + 1}"]`
      );
      nextSection?.scrollIntoView({ behavior: "smooth" });
    }
  };

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
    <div className="fixed inset-0 bg-black">
      <div className="h-full snap-y snap-mandatory overflow-y-scroll scrollbar-none">
        <AnimatePresence mode="popLayout" initial={false}>
          {allDigests.map((section: Section, index: number) => (
            <div key={section.title} data-index={index}>
              <DigestSection
                section={section}
                onNavigateNext={
                  index < allDigests.length - 1 ? handleNavigateNext : undefined
                }
              />
            </div>
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
