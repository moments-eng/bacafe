"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { hebrewContent } from "@/locales/he";

const { onboarding } = hebrewContent;
const step = onboarding.steps.login;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function LoginStep() {
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      await signIn("google", { redirectTo: "/onboarding/success" });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to sign in with Google"
      );
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signIn("facebook", { redirectTo: "/onboarding/success" });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to sign in with Facebook"
      );
    }
  };

  return (
    <motion.div
      data-testid="login-step"
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-[80vh] flex flex-col justify-center p-4"
    >
      <motion.div variants={item} className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
          <CheckCircle2 className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {step.title}
        </h2>
      </motion.div>

      <motion.div variants={item} className="max-w-sm mx-auto w-full space-y-6">
        <div className="bg-gradient-to-b from-card to-background shadow-lg rounded-xl p-6">
          <SocialLoginButtons
            onGoogleLogin={handleGoogleLogin}
            onFacebookLogin={handleFacebookLogin}
          />
        </div>

        <motion.div variants={item} className="grid grid-cols-3 gap-3">
          {step.benefits.items.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-primary/5 p-3 rounded-lg text-center"
            >
              <p className="text-xs text-primary/80 font-medium">{benefit}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div variants={item} className="text-center mt-6">
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          {step.description}
        </p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center max-w-sm mx-auto"
        >
          {error}
        </motion.div>
      )}
    </motion.div>
  );
}
