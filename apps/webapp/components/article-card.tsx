"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { ArticleDto } from "@/generated/http-clients/backend";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  HeartOff,
  Sparkles,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { useState } from "react";
import { animated, useSpring } from "react-spring";
import { useSwipeable } from "react-swipeable";

interface ArticleCardProps {
  article: ArticleDto;
  onSwipe: (direction: "left" | "right") => void;
}

export default function ArticleCard({ article, onSwipe }: ArticleCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [{ x, rot, scale }, api] = useSpring(() => ({
    x: 0,
    rot: 0,
    scale: 1,
    config: { tension: 300, friction: 20 },
  }));

  const SWIPE_THRESHOLD = 150; // Minimum swipe distance to trigger action

  const handlers = useSwipeable({
    onSwiping: ({ deltaX }) => {
      api.start({
        x: deltaX,
        rot: deltaX / 100,
        scale: 1,
      });
    },
    onSwipedLeft: ({ deltaX }) => {
      if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
        api.start({
          x: -500,
          rot: -20,
          scale: 0.5,
          config: { duration: 150 },
          onRest: () => onSwipe("left"),
        });
      } else {
        // Return to center if swipe wasn't strong enough
        api.start({
          x: 0,
          rot: 0,
          scale: 1,
          config: { tension: 200, friction: 20 },
        });
      }
    },
    onSwipedRight: ({ deltaX }) => {
      if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
        api.start({
          x: 500,
          rot: 20,
          scale: 0.5,
          config: { duration: 150 },
          onRest: () => onSwipe("right"),
        });
      } else {
        // Return to center if swipe wasn't strong enough
        api.start({
          x: 0,
          rot: 0,
          scale: 1,
          config: { tension: 200, friction: 20 },
        });
      }
    },
    trackMouse: true,
    trackTouch: true,
    preventScrollOnSwipe: true,
  });

  return (
    <animated.div
      {...handlers}
      style={{
        x,
        rotate: rot,
        scale,
        touchAction: "pan-y",
      }}
      className="absolute w-full max-w-sm origin-bottom"
    >
      <Card
        className={cn(
          "w-full transition-all duration-200",
          isOpen ? "max-h-[600px]" : "max-h-[500px]",
          "overflow-y-auto"
        )}
      >
        <CardHeader className="relative p-0 h-44 sticky top-0 z-10 bg-background">
          <img
            src={article.image?.url}
            alt={article.title}
            className="object-cover rounded-t-lg h-full w-full"
          />
          <Badge className="absolute top-2 left-2" variant="secondary">
            {article.categories?.[0] || "כללי"}
          </Badge>
        </CardHeader>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{article.title}</h2>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <p
              className={cn("text-muted-foreground", !isOpen && "line-clamp-2")}
            >
              {article.subtitle}
            </p>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 flex items-center justify-center gap-1 h-6"
              >
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isOpen && "transform rotate-180"
                  )}
                />
                <span className="text-xs">
                  {isOpen ? "הצג פחות" : "קרא עוד"}
                </span>
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </CardContent>
        <CardFooter className="flex justify-between p-4 border-t gap-3 sticky bottom-0 bg-background">
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "rounded-full w-12 h-12 transition-all duration-200",
              "border-green-200 hover:border-green-400 group",
              "border-2 hover:scale-110 hover:bg-green-50"
            )}
            onClick={() => onSwipe("right")}
          >
            <Sparkles
              className="w-6 h-6 text-green-500 group-hover:text-green-600 transition-colors"
              fill="currentColor"
            />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "rounded-full w-12 h-12 transition-all duration-200",
              "border-emerald-200 hover:border-emerald-400 group",
              "border-2 hover:scale-110 hover:bg-emerald-50"
            )}
            onClick={() => onSwipe("right")}
          >
            <ThumbsUpIcon
              className="w-6 h-6 text-emerald-500 group-hover:text-emerald-600 transition-colors"
              fill="currentColor"
            />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "rounded-full w-12 h-12 transition-all duration-200",
              "border-orange-200 hover:border-orange-400 group",
              "border-2 hover:scale-110 hover:bg-orange-50"
            )}
            onClick={() => onSwipe("left")}
          >
            <ThumbsDownIcon
              className="w-6 h-6 text-orange-500 group-hover:text-orange-600 transition-colors"
              fill="currentColor"
            />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "rounded-full w-12 h-12 transition-all duration-200",
              "border-red-200 hover:border-red-400 group",
              "border-2 hover:scale-110 hover:bg-red-50"
            )}
            onClick={() => onSwipe("left")}
          >
            <HeartOff
              className="w-6 h-6 text-red-500 group-hover:text-red-600 transition-colors"
              fill="currentColor"
            />
          </Button>
        </CardFooter>
      </Card>
    </animated.div>
  );
}
