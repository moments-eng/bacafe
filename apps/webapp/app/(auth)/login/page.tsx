import { LoginForm } from "@/components/auth/login-form";
import { hebrewContent } from "@/locales/he";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "התחברות | בול בפוני",
  description: "התחברו בקלות עם חשבון הרשת החברתית שלכם",
};

export default function LoginPage() {
  const { auth } = hebrewContent;

  return (
    <div className="flex min-h-[100dvh] flex-col items-center  p-4">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={64}
              height={64}
              className="mb-4"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold">{auth.pages.login.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {auth.pages.login.description}
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
