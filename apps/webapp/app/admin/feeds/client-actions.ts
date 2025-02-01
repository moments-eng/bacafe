"use server";

import { QueryFeedsDto } from "@/generated/http-clients/backend/api";
import { feedsApi } from "@/lib/http-clients/backend/client";
import { withAdminAccess } from "../utils/auth";

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

export const getFeeds = withAdminAccess(getFeedsAction);
export const deleteFeed = withAdminAccess(deleteFeedAction);
export const triggerScrape = withAdminAccess(triggerScrapeAction);
export const updateFeedStatus = withAdminAccess(updateFeedStatusAction);
export const createBulkFeeds = withAdminAccess(createBulkFeedsAction);
