'use server';

import { backendApi } from '@/lib/http-clients/backend/client';
import type { components } from '@/lib/http-clients/backend/schema';

type QueryArticlesDto = components['schemas']['QueryArticlesDto'];

type ArticleStatsDto = components['schemas']['ArticleStatsDto'];

export async function getArticles(params: QueryArticlesDto) {
	const { data, error } = await backendApi.POST('/articles/query', {
		body: params,
	});

	if (error) {
		throw new Error('Failed to fetch articles');
	}

	return data;
}

export async function getArticleStats(): Promise<ArticleStatsDto> {
	const { data, error } = await backendApi.GET('/articles/stats');

	if (error) {
		throw new Error('Failed to fetch article statistics');
	}

	return data;
}

export async function deleteArticle(id: string) {
	const { error } = await backendApi.DELETE('/articles/{id}', {
		params: { path: { id } },
	});

	if (error) {
		throw new Error('Failed to delete article');
	}
}
