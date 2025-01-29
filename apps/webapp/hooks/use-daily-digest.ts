import { useState } from "react";
import type { DigestState, DigestActions } from "@/types/daily-digest";

export function useDailyDigest(
  totalSections: number
): DigestState & DigestActions {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set()
  );
  const [completedSections, setCompletedSections] = useState<Set<number>>(
    new Set()
  );
  const [progress, setProgress] = useState(0);

  const updateProgress = (expanded: Set<number>, completed: Set<number>) => {
    const totalProgress = new Set([...expanded, ...completed]);
    setProgress((totalProgress.size / totalSections) * 100);
  };

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
    updateProgress(newExpanded, completedSections);
  };

  const markAsComplete = (index: number) => {
    const newCompleted = new Set(completedSections);
    newCompleted.add(index);
    setCompletedSections(newCompleted);
    updateProgress(expandedSections, newCompleted);
  };

  return {
    expandedSections,
    completedSections,
    progress,
    toggleSection,
    markAsComplete,
  };
}
