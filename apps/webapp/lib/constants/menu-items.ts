import { hebrewContent } from "@/locales/he";
import { Newspaper, Settings, Shield, User } from "lucide-react";

export const mainMenuItems = [
  {
    title: hebrewContent.navigation.menu.dailyDigest,
    href: "/dashboard/daily",
    icon: Newspaper,
  },
];

export const bottomMenuItems = [
  {
    title: hebrewContent.navigation.menu.settings,
    href: "/settings",
    icon: Settings,
  },
  {
    title: hebrewContent.navigation.menu.privacyPolicy,
    href: "/privacy",
    icon: Shield,
  },
];
