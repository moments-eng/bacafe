import { create } from 'zustand';

interface OnboardingState {
	currentStep: number;
	totalSteps: number;
	name: string;
	age: number;
	gender: 'male' | 'female' | 'notSpecified';
	setName: (name: string) => void;
	setAge: (age: number) => void;
	setGender: (gender: 'male' | 'female' | 'notSpecified') => void;
	nextStep: () => void;
	previousStep: () => void;
	setStep: (step: number) => void;
	digestTime: string;
	setDigestTime: (time: string) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
	currentStep: 1,
	totalSteps: 4,
	name: '',
	age: 0,
	gender: 'notSpecified',
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
	digestTime: '',
	setDigestTime: (digestTime) => set({ digestTime }),
}));
