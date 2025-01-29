export interface Section {
  title: string;
  teaser: string;
  body: string[];
  highlights: string[];
  articleLinks: string[];
  category: string;
  imageUrl?: string;
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
}
