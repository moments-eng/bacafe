import { useRef, useState, useCallback, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { hebrewContent } from "@/locales/he";
import type { Section } from "@/types/daily-digest";
import { motion } from "framer-motion";
import {
  ArrowUpRightFromSquare,
  ChevronDown,
  Heart,
  Share2,
  ThumbsDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const { dailyDigest } = hebrewContent;

interface DigestSectionProps {
  section: Section;
  onNavigateNext?: () => void;
}

export function DigestSection({ section, onNavigateNext }: DigestSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef<number>(0);

  // Handle scroll events
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (!isExpanded || !onNavigateNext) return;

      const container = e.currentTarget;
      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollThreshold = 50; // pixels from bottom to trigger next
      const now = Date.now();
      const scrollDelay = 500; // ms between scroll triggers

      // Calculate distance from bottom
      const distanceFromBottom = scrollHeight - clientHeight - scrollTop;

      // If we've reached near the bottom and enough time has passed
      if (
        distanceFromBottom <= scrollThreshold &&
        now - lastScrollTime.current > scrollDelay
      ) {
        lastScrollTime.current = now;
        onNavigateNext();
      }
    },
    [isExpanded, onNavigateNext]
  );

  // Handle like/dislike
  const handleLike = () => {
    setIsLiked(!isLiked);
    setIsDisliked(false);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    setIsLiked(false);
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: section.title,
          text: section.teaser,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-screen w-full snap-start shrink-0 overflow-hidden"
    >
      {/* Background Image with Dynamic Gradient */}
      <div className="absolute inset-0">
        {section.imageUrl && (
          <>
            {/* Main Image */}
            <motion.div
              initial={{ scale: 1.1, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <img
                src={section.imageUrl}
                alt={section.title}
                className="h-full w-full object-cover"
              />
            </motion.div>
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
          </>
        )}
      </div>

      {/* Header Actions */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10">
        <Badge className="bg-primary/90 hover:bg-primary text-primary-foreground backdrop-blur-md">
          {section.category}
        </Badge>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 flex flex-col pt-16 pb-safe">
        {/* Scrollable Content Area */}
        <div
          ref={contentRef}
          onScroll={handleScroll}
          className={cn(
            "flex-grow px-4",
            isExpanded
              ? "overflow-y-auto overscroll-contain pb-24"
              : "overflow-hidden pb-16",
            "scrollbar-none"
          )}
        >
          {/* Title and Teaser */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-3"
          >
            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              {section.title}
            </h1>
            <p className="text-lg font-medium text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              {section.teaser}
            </p>
          </motion.div>

          {/* Highlights */}
          {section.highlights.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-3 rounded-lg bg-black/30 p-3 backdrop-blur-sm border border-white/10"
            >
              <h2 className="text-lg font-semibold text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                {dailyDigest.section.highlights}
              </h2>
              <ul className="space-y-1.5">
                {section.highlights.map((highlight, index) => (
                  <li
                    key={index}
                    className="flex items-start text-base text-white/95"
                  >
                    <span className="mr-2 text-primary">•</span>
                    <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Body Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={cn(
              "space-y-3 transition-all duration-300",
              !isExpanded && "line-clamp-4"
            )}
          >
            {section.body.map((paragraph, index) => (
              <p
                key={index}
                className="text-base text-white/95 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
              >
                {paragraph}
              </p>
            ))}
          </motion.div>

          {/* Read More Toggle */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-3"
          >
            <Button
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full text-white/90 hover:text-white hover:bg-black/20 backdrop-blur-sm"
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 mr-2 transition-transform duration-300",
                  isExpanded && "rotate-180"
                )}
              />
              {isExpanded
                ? dailyDigest.section.feedback.showLess
                : dailyDigest.section.feedback.showMore}
            </Button>
          </motion.div>

          {/* Article Links (improved horizontal scroll) */}
          {section.articleLinks.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-4 mb-20 relative"
            >
              <div className="flex space-x-4 overflow-x-auto scrollbar-none px-2">
                {section.articleLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-[200px] flex-shrink-0 flex items-center justify-between p-3 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 text-white hover:bg-black/40 transition-all hover:border-white/20"
                  >
                    <span>{dailyDigest.section.feedback.readMore}</span>
                    <ArrowUpRightFromSquare className="h-4 w-4" />
                  </a>
                ))}
              </div>
              <div className="absolute top-0 right-0 w-8 h-full pointer-events-none bg-gradient-to-l from-black/70" />
            </motion.div>
          )}
        </div>

        {/* Bottom Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="fixed bottom-0 left-0 right-0 p-4 pb-safe flex justify-center gap-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20"
        >
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-12 w-12 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all",
              isLiked && "bg-primary/20 hover:bg-primary/40"
            )}
            onClick={handleLike}
          >
            <Heart
              className={cn(
                "h-6 w-6",
                isLiked ? "text-primary fill-primary" : "text-white"
              )}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-12 w-12 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all",
              isDisliked && "bg-destructive/20 hover:bg-destructive/40"
            )}
            onClick={handleDislike}
          >
            <ThumbsDown
              className={cn(
                "h-6 w-6",
                isDisliked ? "text-destructive" : "text-white"
              )}
            />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
