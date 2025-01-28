"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useContainerDimensions } from "@/hooks/use-container-dimensions";
import { hebrewContent } from "@/locales/he";
import { useOnboardingStore } from "@/stores/onboarding";
import { motion } from "framer-motion";
import { Clock, Loader2, Mail, MessageCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { ingestReader, updateUser } from "../actions";

const { success } = hebrewContent.onboarding;

export function SuccessStep() {
  const router = useRouter();
  const { name, digestTime, digestChannel } = useOnboardingStore();
  const { width, height } = useContainerDimensions();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [summary, setSummary] = useState<string>();
  const [isLoadingIngest, setIsLoadingIngest] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const simulateProgress = () => {
      setProgress((prev) => Math.min(prev + Math.random() * 3, 75));
    };

    const interval = setInterval(simulateProgress, 300);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoadingIngest) {
      setProgress(100);
    }
  }, [isLoadingIngest]);

  useEffect(() => {
    async function completeOnboarding() {
      try {
        await updateUser({ isOnboardingDone: true });
        const result = await ingestReader();

        if (result.success) {
          setSummary(result.summary);
        } else {
          setError(result.error);
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to complete onboarding"
        );
      } finally {
        setIsLoadingIngest(false);
      }
    }

    completeOnboarding();
  }, []);

  const handleNavigate = async () => {
    setIsLoading(true);
    try {
      await router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatNavigate = async () => {
    setIsLoading(true);
    try {
      await router.push("/chat");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative space-y-6">
      <Confetti
        width={width}
        height={height}
        style={{
          top: -200,
          left: -200,
          zIndex: 1000,
        }}
        numberOfPieces={500}
        recycle={false}
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-3"
      >
        <div className="bg-gradient-to-r from-primary to-purple-500 inline-block text-transparent bg-clip-text">
          <h1 className="text-4xl font-bold">{success.title}</h1>
        </div>
        <p className="text-lg text-muted-foreground">{success.subtitle}</p>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-background rounded-2xl border p-6 space-y-6 shadow-lg"
      >
        {isLoadingIngest ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <h3 className="font-medium text-lg text-center">
                {hebrewContent.onboarding.loading.title}
              </h3>
              <p className="text-sm text-muted-foreground text-center">
                {hebrewContent.onboarding.loading.subtitle}
              </p>
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-full"
            >
              <Progress
                value={progress}
                className="h-3 bg-background transition-all duration-300 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-primary/50"
              />
            </motion.div>

            <div className="flex justify-center space-x-2 pt-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -15, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-2 h-2 bg-primary rounded-full"
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <>
            {summary && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">
                    {hebrewContent.onboarding.success.profileSummary}
                  </h2>
                </div>

                <p className="text-muted-foreground whitespace-pre-line">
                  {summary}
                </p>
              </div>
            )}

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">ההגדרות שלך</h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-muted/50 p-4 rounded-xl space-y-1">
                  <p className="text-sm text-muted-foreground">שעת המשלוח</p>
                  <p className="font-medium">{digestTime}</p>
                </div>

                <div className="bg-muted/50 p-4 rounded-xl space-y-1">
                  <p className="text-sm text-muted-foreground">ערוץ המשלוח</p>
                  <p className="font-medium flex items-center gap-2">
                    {digestChannel === "email" ? (
                      <>
                        <Mail className="h-4 w-4" />
                        אימייל
                      </>
                    ) : (
                      <>
                        <MessageCircle className="h-4 w-4" />
                        ווטסאפ
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <Button
          className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90"
          size="lg"
          onClick={handleNavigate}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
          {success.cta}
        </Button>

        <div className="text-center">
          <Button
            variant="link"
            className="text-muted-foreground hover:text-primary"
            onClick={handleChatNavigate}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {success.chatButton}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
