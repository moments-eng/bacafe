"use server";

import { auth } from "@/auth";
import type { DigestContentDto } from "@/generated/http-clients/backend";
import { dailyDigestApi } from "@/lib/http-clients/backend/client";
import Logger from "@/logger/logger";

export async function getLatestDailyDigest(): Promise<DigestContentDto> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  try {
    const response = await dailyDigestApi.getLatestDailyDigest(session.user.id);
    return response.data;
  } catch (error) {
    Logger.getInstance().error("Failed to fetch daily digest", { error });
    throw new Error("Failed to fetch daily digest");
  }
}
