import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	output: 'standalone',
	eslint: {
		ignoreDuringBuilds: true,
	},
	experimental: {
		authInterrupts: true,
	},
};

export default nextConfig;
