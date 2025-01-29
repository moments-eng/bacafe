"use client";

import { Button } from "@/components/ui/button";
import { hebrewContent } from "@/locales/he";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import "./error.css";

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
    <div className="error-container">
      <div className="error-content">
        <div className="error-image-container">
          <Image
            src="/sad-pony.png"
            alt={hebrewContent.errors.generic.altText}
            fill
            priority
            className="object-contain"
          />
        </div>

        <div>
          <h1 className="error-title font-heebo">
            {hebrewContent.errors.generic.title}
          </h1>
          <p className="error-description font-heebo">
            {hebrewContent.errors.generic.description}
          </p>
        </div>

        <div className="error-actions">
          <Button
            size="lg"
            onClick={reset}
            className="w-full font-medium font-heebo"
          >
            {hebrewContent.errors.generic.buttonText}
          </Button>

          <Link href="/" className="w-full">
            <Button
              variant="outline"
              size="lg"
              className="w-full font-medium font-heebo"
            >
              {hebrewContent.navigation.menu.dailyDigest}
            </Button>
          </Link>
        </div>

        <div className="error-divider" />
      </div>
    </div>
  );
}
