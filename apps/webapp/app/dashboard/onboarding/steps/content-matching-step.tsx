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

const { onboarding } = hebrewContent;

export function ContentMatchingStep() {
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4 text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="mx-auto h-12 w-12 rounded-full border-4 border-primary border-t-transparent"
        />
        <div className="space-y-2">
          <h3 className="font-medium text-lg">
            {hebrewContent.onboarding.loading.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {hebrewContent.onboarding.loading.subtitle}
          </p>
        </div>
      </motion.div>
    );
  }

  if (!onboardingData || onboardingData.articles.length === 0) {
    return <div>No articles available</div>;
  }

  const progress = ((currentIndex + 1) / onboardingData.articles.length) * 100;
  const currentArticle = onboardingData.articles[currentIndex].article;

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">
        {onboarding.steps.interests.title} {name}?
      </h3>
      <p className="text-sm text-muted-foreground">
        {onboarding.steps.interests.description}
      </p>
      <div className="w-full max-w-sm mb-4">
        <Progress value={progress} className="w-full" />
      </div>

      <div className="w-full max-w-sm relative h-[450px]">
        <div className="relative w-full h-full">
          <ArticleCard
            key={currentIndex}
            article={currentArticle}
            onSwipe={handleSwipe}
          />
        </div>
      </div>
    </div>
  );
}
