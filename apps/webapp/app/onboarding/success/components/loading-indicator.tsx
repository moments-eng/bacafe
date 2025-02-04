"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface LoadingIndicatorProps {
  status: string;
  progress: number;
}

export function LoadingIndicator({ status, progress }: LoadingIndicatorProps) {
  return (
    <div className="bg-card rounded-xl border shadow-sm p-4 space-y-4">
      <div className="space-y-3">
        <h3 className="font-medium text-base text-center">{status}</h3>
        <Progress
          value={progress}
          className="h-2 bg-background transition-all duration-300 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-primary/50"
        />
        <div className="flex justify-center space-x-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-1.5 h-1.5 bg-primary rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
} 