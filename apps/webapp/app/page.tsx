import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { hebrewContent } from "@/locales/he";
import { Bona_Nova_SC } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./page.css";

const titleFont = Bona_Nova_SC({
  subsets: ["hebrew"],
  weight: ["400"],
});

async function getStartHereUrl() {
  const session = await auth();
  return session?.user ? "/dashboard" : "/login";
}

export default async function Home() {
  const startHereUrl = await getStartHereUrl();
  return (
    <main className="flex flex-col min-h-full">
      <div className="flex-1">
        <h1 className={`${titleFont.className} brand-title`}>
          {hebrewContent.companyName}
        </h1>

        <p className="text-center text-sm text-muted-foreground mt-0.5 font-medium font-heebo">
          {hebrewContent.tagline}
        </p>

        <div className="hero-section">
          <Image
            src="/logo.png"
            alt="Friendly Mascot"
            width={120}
            height={120}
            className="hero-mascot"
            priority
          />

          <h2 className="hero-title font-heebo">
            {hebrewContent.mainTitle}
            <span className="hero-highlight">
              {hebrewContent.mainTitleHighlight}
            </span>
          </h2>

          <p className="hero-description font-heebo">
            {hebrewContent.description}
          </p>

          <div className="cta-container">
            <Link href={startHereUrl} className="w-full">
              <Button size="default" className="w-full font-medium font-heebo">
                {hebrewContent.startButton}
              </Button>
            </Link>

            <Button
              variant="outline"
              size="default"
              className="w-full font-medium font-heebo"
            >
              {hebrewContent.learnMore}
            </Button>
          </div>
        </div>
      </div>

      <footer className="mt-auto border-t border-border/40">
        <div className="py-4">
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-muted-foreground font-heebo">
              {hebrewContent.footer.allRightsReserved}
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="text-xs text-muted-foreground hover:text-primary transition-colors font-heebo"
              >
                {hebrewContent.footer.privacyPolicy}
              </Link>
              <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              <Link
                href="/terms"
                className="text-xs text-muted-foreground hover:text-primary transition-colors font-heebo"
              >
                {hebrewContent.footer.termsAndConditions}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
