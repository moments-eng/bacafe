import { useState } from "react";
import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Check, ChevronDownIcon, ThumbsDown, ThumbsUp } from "lucide-react";
import { DigestHighlights } from "./digest-highlights";
import { DigestArticleLinks } from "./digest-article-links";
import type { Section } from "@/types/daily-digest";
import { hebrewContent } from "@/locales/he";

const { dailyDigest } = hebrewContent;

interface DigestSectionProps {
  section: Section;
  index: number;
  isExpanded: boolean;
  onSwipe: (index: number, direction: "Left" | "Right") => void;
  onComplete: (index: number) => void;
  onToggle: (index: number) => void;
}

export function DigestSection({
  section,
  index,
  isExpanded,
  onSwipe,
  onComplete,
  onToggle,
}: DigestSectionProps) {
  const [swiping, setSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );

  const handlers = useSwipeable({
    onSwipeStart: () => setSwiping(true),
    onSwipedLeft: () => {
      setSwipeDirection("left");
      onSwipe(index, "Left");
    },
    onSwipedRight: () => {
      setSwipeDirection("right");
      onSwipe(index, "Right");
    },
    onSwiping: (data) => {
      const rotationAngle = data.deltaX * 0.03;
      const element = document.querySelector(
        `#section-${index}`
      ) as HTMLElement;
      if (element) {
        element.style.transform = `rotate(${rotationAngle}deg)`;
      }
    },
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true,
    delta: 100,
  });

  return (
    <motion.div
      key={section.title}
      initial={{ opacity: 1, scale: 1, y: 0 }}
      exit={{
        opacity: 0,
        scale: 0.8,
        x: swiping ? (swipeDirection === "left" ? -1000 : 1000) : 0,
        transition: { duration: 0.3 },
      }}
      className="relative"
    >
      {/* Swipe Indicators */}
      <motion.div
        className="absolute inset-0 flex items-center justify-start pl-8 pointer-events-none"
        style={{ opacity: swiping ? 1 : 0 }}
      >
        <div className="bg-red-500/80 text-white px-4 py-2 rounded-lg">
          <ThumbsDown className="h-8 w-8" />
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none"
        style={{ opacity: swiping ? 1 : 0 }}
      >
        <div className="bg-green-500/80 text-white px-4 py-2 rounded-lg">
          <ThumbsUp className="h-8 w-8" />
        </div>
      </motion.div>

      {/* Card with swipe handlers */}
      <div
        {...handlers}
        id={`section-${index}`}
        className="transition-transform"
        style={{ touchAction: "none" }}
      >
        <Card className="overflow-hidden cursor-grab active:cursor-grabbing">
          <Collapsible open={isExpanded} onOpenChange={() => onToggle(index)}>
            {/* Image Header */}
            <div className="relative h-48">
              <img
                src={section.imageUrl || "/default-news-bg.jpg"}
                alt={section.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <Badge className="absolute top-4 right-4 bg-primary/90 hover:bg-primary text-primary-foreground">
                {section.category}
              </Badge>
            </div>

            <CardHeader className="space-y-4">
              <CardTitle>{section.title}</CardTitle>
              <CardDescription className="text-base">
                {section.teaser}
              </CardDescription>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-primary">
                    <span className="ml-2">
                      {isExpanded
                        ? dailyDigest.section.feedback.hideDetails
                        : dailyDigest.section.feedback.showDetails}
                    </span>
                    <ChevronDownIcon
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <div className="h-4 w-px bg-border mx-2" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onComplete(index)}
                  className="text-xs text-primary"
                >
                  <Check className="h-3.5 w-3.5 mr-1.5" />
                  {dailyDigest.section.feedback.markAsRead}
                </Button>
              </div>
            </CardHeader>

            <CollapsibleContent>
              <CardContent className="space-y-6">
                <DigestHighlights highlights={section.highlights} />

                {/* Main Content */}
                <div className="space-y-4">
                  {section.body.map((paragraph, index) => (
                    <p key={index} className="text-base leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <DigestArticleLinks links={section.articleLinks} />

                {/* Feedback */}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSwipe(index, "Left")}
                    className="text-green-600 hover:bg-green-500/10 text-xs"
                  >
                    <ThumbsUp className="h-3 w-3 ml-1.5" />
                    {dailyDigest.section.feedback.like}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSwipe(index, "Right")}
                    className="text-red-600 hover:bg-red-500/10 text-xs"
                  >
                    <ThumbsDown className="h-3 w-3 ml-1.5" />
                    {dailyDigest.section.feedback.dislike}
                  </Button>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>
    </motion.div>
  );
}
