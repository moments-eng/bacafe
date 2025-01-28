import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { hebrewContent } from "@/locales/he";

const { dailyDigest } = hebrewContent;

interface DigestHighlightsProps {
  highlights: string[];
}

export function DigestHighlights({ highlights }: DigestHighlightsProps) {
  return (
    <Card className="bg-muted/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-primary">
          <Sparkles className="h-4 w-4" />
          {dailyDigest.section.highlights}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-2">
          {highlights.map((highlight, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-2"
            >
              <span className="text-primary mt-1">•</span>
              <span>{highlight}</span>
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
