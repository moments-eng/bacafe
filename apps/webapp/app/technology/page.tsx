import { Button } from "@/components/ui/button";
import { hebrewContent } from "@/locales/he";
import { Bona_Nova_SC } from "next/font/google";
import Image from "next/image";
import Link from "next/link";


export default function TechnologyPage() {
  return (
    <main className="flex flex-col min-h-full px-4">
      <div className="flex-1">
        <div className="py-2 flex flex-col items-center">
          <h1 className={`text-3xl text-center mb-2`}>
            {hebrewContent.technology.title}
          </h1>

          <p className="text-center text-sm text-muted-foreground mb-8 font-heebo">
            {hebrewContent.technology.subtitle}
          </p>
        </div>

        <div className="space-y-6 font-heebo">
          <section className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">
              {hebrewContent.technology.sections.uniqueRepresentation.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {
                hebrewContent.technology.sections.uniqueRepresentation
                  .description
              }
            </p>
          </section>

          <section className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">
              {hebrewContent.technology.sections.advancedProcessing.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {hebrewContent.technology.sections.advancedProcessing.description}
            </p>
          </section>

          <section className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">
              {hebrewContent.technology.sections.personalizedMatching.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {
                hebrewContent.technology.sections.personalizedMatching
                  .description
              }
            </p>
          </section>
        </div>

        <div className="mt-8 mb-12">
          <Link href="/onboarding" className="w-full block">
            <Button size="lg" className="w-full font-medium font-heebo">
              {hebrewContent.technology.cta}
            </Button>
          </Link>
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
