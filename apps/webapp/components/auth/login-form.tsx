"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { hebrewContent } from "@/locales/he";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";

export function LoginForm(props: React.ComponentPropsWithoutRef<"div">) {
  const { login } = hebrewContent;

  const handleGoogleLogin = async () => {
    await signIn("google", { redirectTo: "/dashboard" });
  };

  const handleFacebookLogin = async () => {
    await signIn("facebook", { redirectTo: "/dashboard" });
  };

  return (
    <div className={cn("relative w-full", props.className)} {...props}>
      {/* Decorative Elements */}
      <div className="absolute -right-16 top-10 h-24 w-24 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -left-16 top-20 h-24 w-24 rounded-full bg-primary/10 blur-3xl" />

      {/* Welcome Text */}
      <div className="relative mb-4 text-center">
        <h2 className="text-lg font-medium">{login.welcome}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{login.subtitle}</p>
      </div>

      {/* Social Login Buttons using shared component */}
      <SocialLoginButtons
        onGoogleLogin={handleGoogleLogin}
        onFacebookLogin={handleFacebookLogin}
      />

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
