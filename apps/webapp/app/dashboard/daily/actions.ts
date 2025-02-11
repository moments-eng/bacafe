"use server";

import { auth } from "@/auth";
import { digestsApi } from "@/lib/http-clients/backend/client";
import { Section } from "@/types/daily-digest";
import { unauthorized } from "next/navigation";

export async function fetchDigestIds(): Promise<string[]> {
  const session = await auth();
  if (!session?.user?.email) {
    return unauthorized();
  }

  const dataBackendUrl = process.env.DATA_BACKEND_URL;
  if (!dataBackendUrl) {
    throw new Error("DATA_BACKEND_URL is not configured");
  }

  const response = await fetch(
    `${dataBackendUrl}/api/daily-digest/${session.user.id}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch digest IDs");
  }

  return response.json();
}

export async function fetchDigestDetails(
  ids: string[]
): Promise<{ items: Section[]; total: number }> {
  const session = await auth();
  if (!session?.user?.email) {
    return unauthorized();
  }

  try {
    const { data } = await digestsApi.queryDigests({
      ids,
      limit: 3,
      page: 1,
    });

    return {
      items: data.items as Section[],
      total: data.total ?? 0,
    };
  } catch (error) {
    console.error("Failed to fetch digest details:", error);
    throw new Error("Failed to fetch digest details");
  }
}
