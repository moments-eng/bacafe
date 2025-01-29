"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { hebrewContent } from "@/locales/he";
import FacebookLogo from "@/public/facebook-logo.svg";
import GoogleLogo from "@/public/google-logo.svg";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { login } = hebrewContent;
  const [isLoading, setIsLoading] = useState<{
    google: boolean;
    facebook: boolean;
  }>({
    google: false,
    facebook: false,
  });

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    try {
      setIsLoading((prev) => ({ ...prev, [provider]: true }));
      await signIn(provider, { redirectTo: "/dashboard" });
    } catch (error) {
      setIsLoading((prev) => ({ ...prev, [provider]: false }));
    }
  };

  const isAuthenticating = isLoading.google || isLoading.facebook;

  return (
    <div className={cn("relative w-full", className)} {...props}>
      {/* Decorative Elements */}
      <div className="absolute -right-16 top-10 h-24 w-24 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -left-16 top-20 h-24 w-24 rounded-full bg-primary/10 blur-3xl" />

      {/* Welcome Text */}
      <div className="relative mb-4 text-center">
        <h2 className="text-lg font-medium">{login.welcome}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{login.subtitle}</p>
      </div>

      {/* Social Buttons */}
      <div className="relative mb-4 space-y-2">
        <Button
          variant="outline"
          className="relative h-11 w-full justify-center gap-2 overflow-hidden bg-white/5 backdrop-blur-sm hover:bg-white/10"
          onClick={() => handleSocialLogin("google")}
          disabled={isAuthenticating}
        >
          {isLoading.google ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Image src={GoogleLogo} alt="Google Logo" width={20} height={20} />
          )}
          <span>{login.socialLogin.google}</span>
        </Button>

        <Button
          variant="outline"
          className="relative h-11 w-full justify-center gap-2 overflow-hidden bg-white/5 backdrop-blur-sm hover:bg-white/10"
          onClick={() => handleSocialLogin("facebook")}
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
          <span>{login.socialLogin.facebook}</span>
        </Button>
      </div>

      {/* Terms */}
      <div className="relative text-center text-xs text-muted-foreground">
        <span>{login.terms.prefix} </span>
        <Link href="/terms" className="hover:text-primary">
          {login.terms.termsOfService}
        </Link>{" "}
        <span>{login.terms.and}</span>{" "}
        <Link href="/privacy" className="hover:text-primary">
          {login.terms.privacyPolicy}
        </Link>
      </div>
    </div>
  );
}
