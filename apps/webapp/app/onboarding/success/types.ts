export interface UserInfo {
  name?: string;
  digestTime?: string;
  digestChannel?: "email" | "whatsapp";
  enrichment?: {
    summary?: string;
  };
}

export interface LoadingState {
  isLoading: boolean;
  status: string;
  progress: number;
}

export interface ContentProps {
  userInfo: UserInfo | undefined;
  loading: LoadingState;
  onNavigate: (path: string) => Promise<void>;
}

export const loadingStates = {
  persisting: "שומר את המידע שלך...",
  building: "בונה את הפרופיל האישי שלך...",
  ingesting: "מכין את התוכן המותאם אישית...",
  finalizing: "מסיים את ההגדרות...",
} as const; 