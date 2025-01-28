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

  const handleFeedback = (type: "like" | "dislike", sectionIndex: number) => {
    // TODO: Implement API call for feedback
    console.log(`Feedback ${type} for section ${sectionIndex}`);
  };

  const handleSwipe = (index: number, direction: "Left" | "Right") => {
    if (direction === "Right") {
      handleFeedback("like", index);
    } else {
      handleFeedback("dislike", index);
    }
    markAsComplete(index);
  };

  return {
    expandedSections,
    completedSections,
    progress,
    toggleSection,
    markAsComplete,
    handleFeedback,
    handleSwipe,
  };
}
