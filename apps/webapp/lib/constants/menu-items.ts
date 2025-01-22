import { hebrewContent } from '@/locales/he';
import { Newspaper, Settings, Shield, User } from 'lucide-react';

export const mainMenuItems = [
	{
		title: hebrewContent.navigation.menu.dailyDigest,
		href: '/daily-digest',
		icon: Newspaper,
	},
	{
		title: hebrewContent.navigation.menu.personalArea,
		href: '/personal',
		icon: User,
	},
];

export const bottomMenuItems = [
	{
		title: hebrewContent.navigation.menu.settings,
		href: '/settings',
		icon: Settings,
	},
	{
		title: hebrewContent.navigation.menu.privacyPolicy,
		href: '/privacy',
		icon: Shield,
	},
];
