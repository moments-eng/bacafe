"use client";

import ArticleCard from "@/components/article-card";
import { Progress } from "@/components/ui/progress";
import { hebrewContent } from "@/locales/he";
import { useOnboardingStore } from "@/stores/onboarding";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getProductionOnboarding, updateArticleScore } from "../actions";
import { PreferredArticle } from "@/lib/models/user.model";
import { motion } from "framer-motion";
import { useScrollTop } from "../hooks/use-scroll-top";

const { onboarding } = hebrewContent;

export function ContentMatchingStep() {
  useScrollTop();
  const { name, nextStep } = useOnboardingStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const { data: onboardingData, isLoading } = useQuery({
    queryKey: ["onboarding", "production"],
    queryFn: () => getProductionOnboarding(),
    select: (data) => ({
      ...data,
      articles: [...data.articles].sort((a, b) => a.position - b.position),
    }),
  });

  const handleSwipe = (direction: "left" | "right") => {
    if (isAnimating || !onboardingData) return;

    setIsAnimating(true);

    const currentArticle = onboardingData.articles[currentIndex].article;
    const article: PreferredArticle = {
      title: currentArticle.title,
      subtitle: currentArticle.subtitle,
      content: currentArticle.content,
      enrichment: currentArticle.enrichment,
      description: currentArticle.description,
      categories: currentArticle.categories,
      author: currentArticle.author,
    };
    if (direction === "right") {
      updateArticleScore(article);
    }

    if (currentIndex >= onboardingData.articles.length - 1) {
      setTimeout(() => {
        setIsAnimating(false);
        nextStep();
      }, 100);
    } else {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsAnimating(false);
      }, 100);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[450px] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6 text-center max-w-sm mx-auto p-8 rounded-lg bg-card"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="mx-auto h-16 w-16 rounded-full border-4 border-primary border-t-transparent"
          />
          <div className="space-y-2">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-medium text-xl"
            >
              {hebrewContent.onboarding.loading.title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-muted-foreground"
            >
              {hebrewContent.onboarding.loading.subtitle}
            </motion.p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!onboardingData || onboardingData.articles.length === 0) {
    return <div>No articles available</div>;
  }

  const progress = ((currentIndex + 1) / onboardingData.articles.length) * 100;
  const currentArticle = onboardingData.articles[currentIndex].article;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col items-center px-2 sm:px-4"
    >
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <h3 className="font-medium text-lg">
            {onboarding.steps.interests.title} {name}?
          </h3>
          <p className="text-sm text-muted-foreground">
            {onboarding.steps.interests.description}
          </p>
        </div>

        <Progress value={progress} className="w-full" />

        <div className="relative h-[450px] w-full">
          <ArticleCard
            key={currentIndex}
            article={currentArticle}
            onSwipe={handleSwipe}
          />
        </div>
      </div>
    </motion.div>
  );
}
