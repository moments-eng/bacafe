import NextAuth from 'next-auth';
import authConfig from './auth.config';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export const { auth } = NextAuth(authConfig);

export function middleware(req: NextApiRequest, res: NextApiResponse) {
	const url = new URL(req.url || '');
	if (req.method === 'GET' && url.pathname === '/health') {
		return NextResponse.json({ message: 'OK' });
	}
	return auth(req, res);
}

export const config = {
	matcher: [
		'/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
	],
};
