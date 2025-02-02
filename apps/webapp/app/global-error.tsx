"use client";

import * as Sentry from "@sentry/nextjs";

import { Button } from "@/components/ui/button";
import { hebrewContent } from "@/locales/he";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import "./global-error.css";

import { Heebo } from "next/font/google";

const heebo = Heebo({
  subsets: ["hebrew"],
  weight: ["300", "400", "500", "700"],
});

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  const refresh = () => window.location.reload();

  return (
    <html lang="he" dir="rtl" className="overflow-x-hidden">
      <body className={`${heebo.className} mobile-container`}>
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
                onClick={refresh}
                className="w-full font-medium font-heebo"
              >
                {hebrewContent.errors.generic.buttonText}
              </Button>
            </div>

            <div className="error-divider" />
          </div>
        </div>
      </body>
    </html>
  );
}
