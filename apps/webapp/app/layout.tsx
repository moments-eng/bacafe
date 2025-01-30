import { hebrewContent } from "@/locales/he";
import { Providers } from "@/providers";
import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: hebrewContent.metadata.title,
  description: hebrewContent.metadata.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className="overflow-x-hidden">
      <body className={`${heebo.className} mobile-container`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
