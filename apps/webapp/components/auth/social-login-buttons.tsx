"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import GoogleLogo from "@/public/google-logo.svg";
import FacebookLogo from "@/public/facebook-logo.svg";
import { hebrewContent } from "@/locales/he";

interface SocialLoginButtonsProps extends React.HTMLAttributes<HTMLDivElement> {
  onGoogleLogin: () => Promise<void>;
  onFacebookLogin: () => Promise<void>;
}

export function SocialLoginButtons({
  onGoogleLogin,
  onFacebookLogin,
  className,
  ...props
}: SocialLoginButtonsProps) {
  const [isLoading, setIsLoading] = useState({
    google: false,
    facebook: false,
  });

  const handleGoogle = async () => {
    setIsLoading((prev) => ({ ...prev, google: true }));
    try {
      await onGoogleLogin();
    } finally {
      setIsLoading((prev) => ({ ...prev, google: false }));
    }
  };

  const handleFacebook = async () => {
    setIsLoading((prev) => ({ ...prev, facebook: true }));
    try {
      await onFacebookLogin();
    } finally {
      setIsLoading((prev) => ({ ...prev, facebook: false }));
    }
  };

  const isAuthenticating = isLoading.google || isLoading.facebook;

  return (
    <div className={cn("relative w-full", className)} {...props}>
      <div className="mb-4 space-y-2">
        <Button
          variant="outline"
          className="relative h-11 w-full justify-center gap-2 overflow-hidden bg-white/5 backdrop-blur-sm hover:bg-white/10"
          onClick={handleGoogle}
          disabled={isAuthenticating}
        >
          {isLoading.google ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Image src={GoogleLogo} alt="Google Logo" width={20} height={20} />
          )}
          <span>{hebrewContent.login.socialLogin.google}</span>
        </Button>
      </div>
      <div className="mb-4 space-y-2">
        <Button
          variant="outline"
          className="relative h-11 w-full justify-center gap-2 overflow-hidden bg-white/5 backdrop-blur-sm hover:bg-white/10"
          onClick={handleFacebook}
          disabled={isAuthenticating}
        >
          {isLoading.facebook ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Image
              src={FacebookLogo}
              alt="Facebook Logo"
              width={20}
              height={20}
            />
          )}
          <span>{hebrewContent.login.socialLogin.facebook}</span>
        </Button>
      </div>
    </div>
  );
}
