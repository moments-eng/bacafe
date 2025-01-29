import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Check, ChevronDownIcon } from "lucide-react";
import { DigestHighlights } from "./digest-highlights";
import { DigestArticleLinks } from "./digest-article-links";
import type { Section } from "@/types/daily-digest";
import { hebrewContent } from "@/locales/he";

const { dailyDigest } = hebrewContent;

interface DigestSectionProps {
  section: Section;
  index: number;
  isExpanded: boolean;
  onComplete: (index: number) => void;
  onToggle: (index: number) => void;
}

export function DigestSection({
  section,
  index,
  isExpanded,
  onComplete,
  onToggle,
}: DigestSectionProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.div
      key={section.title}
      initial={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20, transition: { duration: 0.3 } }}
      className="relative"
    >
      <Card
        className={`overflow-hidden cursor-pointer transition-all duration-200 active:scale-[0.99] ${
          isPressed ? "scale-[0.99]" : "scale-100"
        }`}
        onClick={() => onToggle(index)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
      >
        <Collapsible open={isExpanded}>
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
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="flex-1">{section.title}</CardTitle>
              <div className="flex flex-col items-center text-xs text-muted-foreground">
                <ChevronDownIcon
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
                <span className="text-[10px]">
                  {isExpanded
                    ? dailyDigest.section.feedback.readLess
                    : dailyDigest.section.feedback.readMore}
                </span>
              </div>
            </div>
            <CardDescription className="text-base">
              {section.teaser}
            </CardDescription>

            {/* Action Buttons */}
            <div className="flex items-center justify-end pt-2">
              <Button
                variant="default"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onComplete(index);
                }}
                className="text-sm font-medium hover:scale-105 transition-transform"
              >
                <Check className="h-4 w-4 mr-2" />
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
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </motion.div>
  );
}
