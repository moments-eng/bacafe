"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db/mongoose";
import { backendApi } from "@/lib/http-clients/backend/client";
import type { components } from "@/lib/http-clients/backend/schema";
import { userService } from "@/lib/services/user-service";
import { revalidatePath } from "next/cache";
import { withAdminAccess } from "../utils/auth";

type CreateFeedDto = components["schemas"]["CreateFeedDto"];
type UpdateFeedStatusDto = components["schemas"]["UpdateFeedStatusDto"];

async function getFeedsAction() {
  await connectDB();
  const { data, error } = await backendApi.GET("/feeds");
  if (error) throw error;
  return data;
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
    const { data, error } = await backendApi.POST("/feeds", {
      body: payload,
    });
    if (error) throw error;
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
    const { error } = await backendApi.PATCH("/feeds/{id}/status", {
      params: { path: { id } },
      body: { isActive } as UpdateFeedStatusDto,
    });
    if (error) throw error;
    revalidatePath("/admin/feeds");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update status",
    };
  }
}

async function deleteFeedAction(id: string) {
  try {
    const { error } = await backendApi.DELETE("/feeds/{id}", {
      params: { path: { id } },
    });
    if (error) throw error;
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
    const { error } = await backendApi.POST("/feeds/{id}/scrape", {
      params: { path: { id } },
    });
    if (error) throw error;
    revalidatePath("/admin/feeds");
    return { success: true };
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
    const { error } = await backendApi.PATCH("/feeds/{id}/status", {
      params: { path: { id } },
      body: payload,
    });
    if (error) throw error;
    revalidatePath("/admin/feeds");
    return { success: true };
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
