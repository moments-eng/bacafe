import { type NextRequest, NextResponse } from 'next/server';

import { auth0 } from './lib/auth0';
const appUrl = process.env.APP_BASE_URL;

const redirectResponseCodes = [301, 302, 303, 307, 308];

function isRedirectResponse(response: NextResponse) {
	return redirectResponseCodes.includes(response.status);
}

export async function middleware(request: NextRequest) {
	const { method, nextUrl } = request;
	const response = await auth0.middleware(request);

	if (isRedirectResponse(response)) {
		return response;
	}

	const session = await auth0.getSession(request);

	if (method === 'GET' && nextUrl.pathname === '/app') {
		if (!session?.user?.isOnboardingDone) {
			return NextResponse.redirect(`${appUrl}/app/onboarding`);
		}

		return NextResponse.redirect(`${appUrl}/app/daily`);
	}

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico, sitemap.xml, robots.txt (metadata files)
		 */
		'/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
	],
};
