'use server';

import { auth } from '@/auth';
import { backendApi } from '@/lib/http-clients/backend/client';
import type { components } from '@/lib/http-clients/backend/schema';
import { revalidatePath } from 'next/cache';

type CreateFeedDto = components['schemas']['CreateFeedDto'];
type UpdateFeedStatusDto = components['schemas']['UpdateFeedStatusDto'];

async function checkAdminAccess() {
	const session = await auth();
	if (!session?.user?.email) {
		throw new Error('Unauthorized - Not logged in');
	}

	if (session.user.role !== 'admin') {
		throw new Error('Unauthorized - Admin access required');
	}
}

export async function getFeeds() {
	await checkAdminAccess();
	const { data, error } = await backendApi.GET('/feeds');
	if (error) throw error;
	return data;
}

export async function createFeed(formData: FormData) {
	await checkAdminAccess();

	const payload: CreateFeedDto = {
		provider: formData.get('provider') as string,
		url: formData.get('url') as string,
		categories: (formData.get('categories') as string)
			.split(',')
			.map((s) => s.trim()),
	};

	try {
		const { data, error } = await backendApi.POST('/feeds', { body: payload });
		if (error) throw error;
		revalidatePath('/admin/feeds');
		return { success: true, data };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to create feed',
		};
	}
}

export async function toggleFeedStatus(id: string, isActive: boolean) {
	await checkAdminAccess();

	try {
		const { error } = await backendApi.PATCH('/feeds/{id}/status', {
			params: { path: { id } },
			body: { isActive } as UpdateFeedStatusDto,
		});
		if (error) throw error;
		revalidatePath('/admin/feeds');
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to update status',
		};
	}
}

export async function deleteFeed(id: string) {
	await checkAdminAccess();

	try {
		const { error } = await backendApi.DELETE('/feeds/{id}', {
			params: { path: { id } },
		});
		if (error) throw error;
		revalidatePath('/admin/feeds');
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to delete feed',
		};
	}
}
