"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { hebrewContent } from "@/locales/he";
import { getUserInformation } from "../actions";
import { useOnboardingStore } from "../store/onboarding-store";

const { onboarding } = hebrewContent;
const step = onboarding.steps.success;

interface UserInfo {
  name?: string;
  digestTime?: string;
  digestChannel?: "email" | "whatsapp";
  enrichment?: {
    summary?: string;
  };
}

export function SuccessStep() {
  const router = useRouter();
  const { reset } = useOnboardingStore();
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [error, setError] = useState<string>();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const result = await getUserInformation();
        if (result.success) {
          setUserInfo(result.data);
          setProgress(100);
        } else {
          setError(result.error);
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load user information"
        );
      }
    };

    loadUserInfo();
  }, []);

  useEffect(() => {
    const simulateProgress = () => {
      setProgress((prev) => Math.min(prev + Math.random() * 3, 75));
    };

    const interval = setInterval(simulateProgress, 300);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const handleNavigate = async (path: string) => {
    setIsLoading(true);
    try {
      await router.push(path);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center p-4 space-y-6">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ position: "fixed", top: 0, left: 0, zIndex: 0 }}
        numberOfPieces={200}
        recycle={false}
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-3 z-10"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {step.title}
        </h1>
        <p className="text-muted-foreground">{step.subtitle}</p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-2xl border shadow-lg p-6 space-y-6 z-10"
      >
        {progress < 100 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <h3 className="font-medium text-lg text-center">
                {onboarding.loading.title}
              </h3>
              <p className="text-sm text-muted-foreground text-center">
                {onboarding.loading.subtitle}
              </p>
            </div>

            <Progress
              value={progress}
              className="h-3 bg-background transition-all duration-300 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-primary/50"
            />

            <div className="flex justify-center space-x-2 pt-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -10, 0] }}
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
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {userInfo?.enrichment?.summary && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold">{step.greeting}</h2>
                  </div>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {userInfo.enrichment.summary}
                  </p>
                </div>
              )}

              {(userInfo?.digestTime || userInfo?.digestChannel) && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">ההגדרות שלך</h3>
                  </div>

                  <div className="grid gap-4 grid-cols-1">
                    {userInfo.digestTime && (
                      <div className="bg-muted/50 p-4 rounded-xl space-y-1">
                        <p className="text-sm text-muted-foreground">
                          שעת המשלוח
                        </p>
                        <p className="font-medium">{userInfo.digestTime}</p>
                      </div>
                    )}

                    {userInfo.digestChannel && (
                      <div className="bg-muted/50 p-4 rounded-xl space-y-1">
                        <p className="text-sm text-muted-foreground">
                          ערוץ המשלוח
                        </p>
                        <p className="font-medium flex items-center gap-2">
                          {userInfo.digestChannel === "email" ? (
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
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4 z-10"
      >
        <Button
          className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary/60 hover:from-primary/90 hover:to-primary/50"
          size="lg"
          onClick={() => handleNavigate("/dashboard")}
          disabled={isLoading || progress < 100}
        >
          {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
          {step.cta}
        </Button>

        <div className="text-center">
          <Button
            variant="link"
            className="text-muted-foreground hover:text-primary"
            onClick={() => handleNavigate("/chat")}
            disabled={isLoading || progress < 100}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {step.chatButton}
          </Button>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 left-4 right-4 p-4 bg-destructive/10 text-destructive rounded-lg text-sm text-center z-50"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
}
