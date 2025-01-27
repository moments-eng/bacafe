"use client";

import { Button } from "@/components/ui/button";
import { hebrewContent } from "@/locales/he";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-bold mb-4">
          {hebrewContent.errors.generic.title}
        </h1>

        <p className="text-xl mb-8 max-w-md mx-auto leading-relaxed">
          {hebrewContent.errors.generic.description}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button onClick={reset}>
            {hebrewContent.errors.generic.buttonText}
          </Button>

          <Link href="/">
            {hebrewContent.navigation.menu.dailyDigest}
          </Link>
        </div>

        <div className="mt-16 border-t pt-8 space-y-6">
          <h3 className="text-2xl font-semibold">
            {hebrewContent.errors.coffeeThemedMessage}
          </h3>
          <ul className="space-y-4 text-lg">
            {hebrewContent.errors.options.map((option, index) => (
              <li
                key={index}
                className="flex items-center justify-center gap-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span>•</span>
                {option}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
