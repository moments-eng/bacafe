import createClient from 'openapi-fetch';
import type { paths } from './schema';

export const backendApi = createClient<paths>({
	baseUrl: process.env.BACKNED_API_URL,
});
