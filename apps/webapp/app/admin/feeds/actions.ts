"use server";

import {
  CreateFeedDto,
  UpdateFeedStatusDto,
} from "@/generated/http-clients/backend/api";
import { feedsApi } from "@/lib/http-clients/backend/client";
import { revalidatePath } from "next/cache";
import { withAdminAccess } from "../utils/auth";

async function getFeedsAction() {
  try {
    const { data } = await feedsApi.findAllFeeds();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch feeds");
  }
}

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

async function deleteFeedAction(id: string) {
  try {
    await feedsApi.deleteFeed(id);
    revalidatePath("/admin/feeds");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete feed",
    };
  }
}

async function triggerScrapeAction(id: string) {
  try {
    const { data } = await feedsApi.scrapeFeedNow(id);
    revalidatePath("/admin/feeds");
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to trigger scrape",
    };
  }
}

async function updateFeedStatusAction(
  id: string,
  payload: UpdateFeedStatusDto
) {
  try {
    const { data } = await feedsApi.updateFeed(id, payload);
    revalidatePath("/admin/feeds");
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update status",
    };
  }
}

export const getFeeds = withAdminAccess(getFeedsAction);
export const createFeed = withAdminAccess(createFeedAction);
export const toggleFeedStatus = withAdminAccess(toggleFeedStatusAction);
export const deleteFeed = withAdminAccess(deleteFeedAction);
export const triggerScrape = withAdminAccess(triggerScrapeAction);
export const updateFeedStatus = withAdminAccess(updateFeedStatusAction);
