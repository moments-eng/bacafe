import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { hebrewContent } from "@/locales/he";

const { dailyDigest } = hebrewContent;

interface DigestArticleLinksProps {
  links: string[];
}

export function DigestArticleLinks({ links }: DigestArticleLinksProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-base font-semibold flex items-center gap-2 text-primary">
        <BookOpen className="h-4 w-4" />
        {dailyDigest.section.articleLinks}
      </h4>
      <div className="grid gap-2">
        {links.map((link, index) => (
          <a
            key={index}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="block"
          >
            <Card className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-3 flex items-center justify-between">
                <span className="text-muted-foreground text-xs">
                  {dailyDigest.section.article} {index + 1}
                </span>
                <span className="text-primary text-sm">
                  {dailyDigest.section.readMore}
                </span>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
