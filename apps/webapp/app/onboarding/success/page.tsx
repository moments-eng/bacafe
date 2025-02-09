"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

import { useContainerDimensions } from "@/hooks/use-container-dimensions";
import { hebrewContent } from "@/locales/he";
import { getUserInformation, ingestReader, updateUser } from "../actions";
import { useOnboardingStore } from "../store/onboarding-store";
import { ApprovedUserContent, PendingUserContent } from "./components";
import { LoadingState, UserInfo, loadingStates } from "./types";

const { onboarding } = hebrewContent;
const { success } = onboarding.steps;

export default function OnboardingSuccessPage() {
  const router = useRouter();
  const { data: session, update, status } = useSession();

  const { width, height } = useContainerDimensions();
  const {
    name,
    age,
    gender,
    digestTime,
    digestChannel,
    phoneNumber,
    articlePreferences,
    reset,
    hasHydrated,
  } = useOnboardingStore();

  const [loading, setLoading] = useState<LoadingState>({
    isLoading: true,
    status: loadingStates.persisting,
    progress: 20,
  });
  const [isOnboardingDone, setIsOnboardingDone] = useState(false);

  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    const updateSession = async () => {
      if (
        isOnboardingDone &&
        status === "authenticated" &&
        session?.user &&
        !session.user.isOnboardingDone
      ) {
        await update({
          user: { ...session.user, isOnboardingDone: true },
        });
      }
    };
    updateSession();
  }, [isOnboardingDone, status, session?.user]);

  const updateLoadingState = (
    status: keyof typeof loadingStates,
    progress: number
  ) => {
    setLoading({
      isLoading: true,
      status: loadingStates[status],
      progress,
    });
  };

  const completeOnboarding = async () => {
    if (!hasHydrated) {
      return;
    }
    const user = await getUserInformation();

    try {
      updateLoadingState("persisting", 40);
      await updateUser({
        name,
        age,
        gender,
        digestTime,
        digestChannel,
        phoneNumber,
        preferences: articlePreferences || [],
        isOnboardingDone: true,
      });

      setIsOnboardingDone(true);
      updateLoadingState("building", 60);
      updateLoadingState("ingesting", 80);

      if (!user.data?.enrichment) {
        const result = await ingestReader();
        if (!result.success) {
          throw new Error(result.error);
        }
      }

      const updatedUserResult = await getUserInformation();
      if (!updatedUserResult.success) {
        throw new Error("Failed to get updated user information");
      }

      setUserInfo(updatedUserResult.data);
      updateLoadingState("finalizing", 100);
      setLoading((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to complete onboarding"
      );
      setLoading({ isLoading: false, status: "", progress: 0 });
    }
  };

  useEffect(() => {
    if (hasHydrated) {
      console.log("Store hydrated, starting onboarding completion");
      completeOnboarding();
    } else {
      console.log("Waiting for store hydration...");
    }
  }, [hasHydrated]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  const handleNavigate = async (path: string) => {
    try {
      await router.push(path);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to navigate");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Confetti
        width={width}
        height={height}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 0,
        }}
        numberOfPieces={200}
        recycle={false}
      />

      <div className="container max-w-md mx-auto px-4 py-6 space-y-4 relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-3">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            {success.title}
          </h1>
          <p className="text-sm text-muted-foreground">{success.subtitle}</p>
        </motion.div>

        {session?.user?.approved ? (
          <ApprovedUserContent
            userInfo={userInfo}
            loading={loading}
            onNavigate={handleNavigate}
          />
        ) : (
          <PendingUserContent
            userInfo={userInfo}
            loading={loading}
            onNavigate={handleNavigate}
          />
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 left-4 right-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm text-center z-50"
          >
            {error}
          </motion.div>
        )}
      </div>
    </div>
  );
}
