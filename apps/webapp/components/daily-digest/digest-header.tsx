import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { hebrewContent } from "@/locales/he";

const { dailyDigest } = hebrewContent;

interface DigestHeaderProps {
  progress: number;
}

export function DigestHeader({ progress }: DigestHeaderProps) {
  return (
    <Card className="sticky top-0 z-50 backdrop-blur-lg border-0 rounded-none bg-background/80 shadow-none">
      <CardContent className="py-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold">{dailyDigest.title}</h2>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("he-IL", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <Progress value={progress} className="w-28 h-1.5" />
        </div>
      </CardContent>
    </Card>
  );
}
