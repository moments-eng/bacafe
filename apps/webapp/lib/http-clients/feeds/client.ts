import createClient from 'openapi-fetch';
import type { paths } from './schema';

export const feedsApi = createClient<paths>({
	baseUrl: process.env.BACKNED_API_URL,
});
