export interface Section {
  category: string;
  title: string;
  teaser: string;
  highlights: string[];
  body: string[];
  articleLinks: string[];
  imageUrl: string;
  readTime?: number;
  mood?: "positive" | "negative" | "neutral";
}

export interface DailyDigest {
  sections: Section[];
  date: string;
  readTime: number;
}

export interface DigestState {
  expandedSections: Set<number>;
  completedSections: Set<number>;
  progress: number;
}

export interface DigestActions {
  toggleSection: (index: number) => void;
  markAsComplete: (index: number) => void;
  handleFeedback: (type: "like" | "dislike", sectionIndex: number) => void;
  handleSwipe: (index: number, direction: "Left" | "Right") => void;
}
