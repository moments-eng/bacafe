import { Button } from "@/components/ui/button";
import { hebrewContent } from "@/locales/he";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-bold mb-4">
          {hebrewContent.errors["404"].title}
        </h1>

        <p className="text-xl mb-8 max-w-md mx-auto leading-relaxed">
          {hebrewContent.errors["404"].description}
        </p>

        <Link href="/">
          <Button>{hebrewContent.errors["404"].buttonText}</Button>
        </Link>

        <div className="mt-16 border-t pt-8 space-y-6">
          <h3 className="text-2xl font-semibold">
            {hebrewContent.errors.coffeeThemedMessage}
          </h3>
          <ul className="space-y-4  text-lg">
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
