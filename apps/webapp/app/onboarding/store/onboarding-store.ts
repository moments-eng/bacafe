import { PreferredArticle } from "@/lib/models/user.model";
import { UserGender } from "@/lib/types/user.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export enum OnboardingStep {
  ContentMatching = 1,
  PersonalDetails = 2,
  TimePreference = 3,
  DigestChannel = 4,
  Login = 5,
}

interface OnboardingState {
  step: OnboardingStep;
  name?: string;
  age?: number;
  gender?: UserGender;
  digestTime?: string;
  digestChannel?: "email" | "whatsapp";
  phoneNumber?: string;
  articlePreferences?: PreferredArticle[];
  setStep: (step: OnboardingStep) => void;
  updatePersonalDetails: (details: {
    name?: string;
    age?: number;
    gender?: UserGender;
  }) => void;
  updateDigestTime: (time: string) => void;
  updateDigestChannel: (
    channel: "email" | "whatsapp",
    phoneNumber?: string
  ) => void;
  updateArticlePreferences: (preferences: PreferredArticle[]) => void;
  reset: () => void;
}

const initialState = {
  step: OnboardingStep.ContentMatching,
  name: undefined,
  age: undefined,
  gender: undefined,
  digestTime: undefined,
  digestChannel: undefined,
  phoneNumber: undefined,
  articlePreferences: [],
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,
      setStep: (step) => set({ step }),
      updatePersonalDetails: (details) =>
        set((state) => ({ ...state, ...details })),
      updateDigestTime: (time) => set({ digestTime: time }),
      updateDigestChannel: (channel, phoneNumber) =>
        set({ digestChannel: channel, phoneNumber }),
      updateArticlePreferences: (preferences) =>
        set({ articlePreferences: preferences }),
      reset: () => set(initialState),
    }),
    {
      name: "onboarding-storage",
    }
  )
);
