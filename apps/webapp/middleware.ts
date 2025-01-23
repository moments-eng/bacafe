import type { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import authConfig from './auth.config';

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
	const url = new URL(req.url || '');
	if (req.method === 'GET' && url.pathname === '/health') {
		return NextResponse.json({ message: 'OK' });
	}
});

export const config = {
	matcher: [
		'/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
	],
};
