import React, { useRef, useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { hebrewContent } from "@/locales/he";
import type { Section } from "@/types/daily-digest";
import { motion } from "framer-motion";
import { ArrowUpRightFromSquare } from "lucide-react";

const { dailyDigest } = hebrewContent;

export function DigestSection({ section }: { section: Section }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef<number>(0);
  const scrollThreshold = 100;
  const scrollDelay = 500;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (isMobile) return; // Allow natural scroll behavior on mobile

      const container = e.currentTarget;
      const now = Date.now();
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;

      if (!isAtBottom) {
        e.stopPropagation();
        return;
      }

      if (isAtBottom && now - lastScrollTime.current > scrollDelay) {
        lastScrollTime.current = now;
      } else {
        e.stopPropagation();
      }
    },
    [isMobile]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-screen w-full snap-start shrink-0 overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
        {section.imageUrl && (
          <img
            src={section.imageUrl}
            alt={section.title}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="relative h-full w-full flex flex-col">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-grow overflow-y-auto overscroll-auto md:overscroll-contain scrollbar-none p-4 pb-32"
        >
          <div className="relative">
            <div className="absolute inset-0 -m-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
            <Badge className="relative w-fit bg-primary/90 hover:bg-primary text-primary-foreground">
              {section.category}
            </Badge>
            <div>
              <h1 className="relative mb-3 text-3xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                {section.title}
              </h1>
              <p className="relative text-lg font-medium text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                {section.teaser}
              </p>
            </div>
          </div>

          {section.highlights.length > 0 && (
            <div className="mt-4 rounded-lg bg-black/40 p-3 backdrop-blur-sm">
              <h2 className="mb-2 text-xl font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                {dailyDigest.section.highlights}
              </h2>
              <ul className="space-y-2">
                {section.highlights.map((highlight, index) => (
                  <li
                    key={index}
                    className="flex items-start text-base text-white/90"
                  >
                    <span className="mr-2 text-primary">•</span>
                    <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="relative mt-4">
            {section.body.map((paragraph, index) => (
              <p
                key={index}
                className="text-base text-white/90 leading-relaxed mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
              >
                {paragraph}
              </p>
            ))}

            
          </div>
          {section.articleLinks.length > 0 && (
              <div className="mt-8 bg-black/60rounded-xl backdrop-blur-sm shadow-lg">
                <h2 className="mb-3 text-lg font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                  {dailyDigest.section.articleLinks}
                </h2>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                  {section.articleLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-w-[120px] h-10 flex-shrink-0 rounded-lg bg-white/20 px-3 text-sm text-white hover:bg-white/30 transition-colors flex items-center justify-center gap-2 backdrop-blur-sm hover:shadow-lg"
                    >
                      <span>{dailyDigest.section.feedback.readMore}</span>
                      <ArrowUpRightFromSquare className="h-4 w-4 flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </motion.div>
  );
}
