import { UserGender } from "@/lib/types/user.types";
import { create } from "zustand";

interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  name: string;
  age: number;
  gender: UserGender;
  setName: (name: string) => void;
  setAge: (age: number) => void;
  setGender: (gender: UserGender) => void;
  nextStep: () => void;
  previousStep: () => void;
  setStep: (step: number) => void;
  digestTime: string;
  setDigestTime: (time: string) => void;
  digestChannel: "email" | "whatsapp";
  setDigestChannel: (channel: "email" | "whatsapp") => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  currentStep: 1,
  totalSteps: 5,
  name: "",
  age: 0,
  gender: UserGender.NOT_SPECIFIED,
  setName: (name) => set({ name }),
  setAge: (age) => set({ age }),
  setGender: (gender) => set({ gender }),
  nextStep: () => {
    set((state) => ({
      currentStep:
        state.currentStep === state.totalSteps
          ? state.currentStep
          : state.currentStep + 1,
    }));
  },
  previousStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),
  setStep: (step) => set({ currentStep: step }),
  digestTime: "",
  setDigestTime: (digestTime) => set({ digestTime }),
  digestChannel: "email",
  setDigestChannel: (digestChannel) => set({ digestChannel }),
}));
