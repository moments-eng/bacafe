"use server";

import {
  CreateFeedDto,
  QueryFeedsDto
} from "@/generated/http-clients/backend/api";
import { feedsApi } from "@/lib/http-clients/backend/client";
import { revalidatePath } from "next/cache";
import { withAdminAccess } from "../utils/auth";


async function createFeedAction(formData: FormData) {
  const payload: CreateFeedDto = {
    provider: formData.get("provider") as string,
    url: formData.get("url") as string,
    categories: (formData.get("categories") as string)
      .split(",")
      .map((s) => s.trim()),
  };

  try {
    const { data } = await feedsApi.createFeed(payload);
    revalidatePath("/admin/feeds");
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create feed",
    };
  }
}

async function toggleFeedStatusAction(id: string, isActive: boolean) {
  try {
    const { data } = await feedsApi.updateFeedStatus(id, { isActive });
    revalidatePath("/admin/feeds");
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update status",
    };
  }
}




async function getFeedsAction(query: QueryFeedsDto) {
  const { data } = await feedsApi.queryFeeds(query);
  return data;
}

async function createBulkFeedsAction(params: {
  provider: string;
  urls: string;
  categories?: string[];
}) {
  const { data } = await feedsApi.createBulkFeeds({
    provider: params.provider,
    urls: params.urls,
    categories: params.categories,
  });
  return data;
}

async function updateFeedStatusAction(
  id: string,
  params: { isActive: boolean; scrapingInterval?: number }
) {
  const { data } = await feedsApi.updateFeedStatus(id, params);
  return data;
}

async function deleteFeedAction(id: string) {
  await feedsApi.deleteFeed(id);
}

async function triggerScrapeAction(id: string) {
  await feedsApi.scrapeFeedNow(id);
}


export const createFeed = withAdminAccess(createFeedAction);
export const toggleFeedStatus = withAdminAccess(toggleFeedStatusAction);
export const getFeeds = withAdminAccess(getFeedsAction);
export const deleteFeed = withAdminAccess(deleteFeedAction);
export const triggerScrape = withAdminAccess(triggerScrapeAction);
export const updateFeedStatus = withAdminAccess(updateFeedStatusAction);
export const createBulkFeeds = withAdminAccess(createBulkFeedsAction);
