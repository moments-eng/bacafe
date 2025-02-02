import { Button } from "@/components/ui/button";
import { hebrewContent } from "@/locales/he";
import Image from "next/image";
import Link from "next/link";
import "./global-error.css";

export default function NotFound() {
  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-image-container">
          <Image
            src="/sad-pony.png"
            alt={hebrewContent.errors["404"].altText}
            fill
            priority
            className="object-contain"
          />
        </div>

        <div>
          <h1 className="error-title font-heebo">
            {hebrewContent.errors["404"].title}
          </h1>
          <p className="error-description font-heebo">
            {hebrewContent.errors["404"].description}
          </p>
        </div>

        <div className="error-actions">
          <Link href="/" className="w-full">
            <Button size="lg" className="w-full font-medium font-heebo">
              {hebrewContent.errors["404"].buttonText}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
