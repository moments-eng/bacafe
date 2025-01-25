"use server";

import { backendApi } from "@/lib/http-clients/backend/client";
import type { components } from "@/lib/http-clients/backend/schema";

type OnboardingDto = components["schemas"]["OnboardingDto"];
type CreateOnboardingDto = components["schemas"]["CreateOnboardingDto"];
type PaginatedOnboardingDto = components["schemas"]["PaginatedOnboardingDto"];

export async function getOnboardings(params: {
  page?: number;
  limit?: number;
}) {
  const { data, error } = await backendApi.GET("/onboarding", {
    params: { query: params },
  });

  if (error) {
    throw new Error("Failed to fetch onboardings");
  }

  return data;
}

export async function getOnboarding(id: string) {
  const { data, error } = await backendApi.GET("/onboarding/{id}", {
    params: { path: { id } },
  });

  if (error) {
    throw new Error("Failed to fetch onboarding");
  }

  return data;
}

export async function createOnboarding(params: CreateOnboardingDto) {
  const { data, error } = await backendApi.POST("/onboarding", {
    body: params,
  });

  if (error) {
    console.log(error);
    throw new Error("Failed to create onboarding");
  }

  return data;
}

export async function promoteToProduction(id: string) {
  const { data, error } = await backendApi.POST("/onboarding/{id}/promote", {
    params: { path: { id } },
  });

  if (error) {
    throw new Error("Failed to promote onboarding to production");
  }

  return data;
}

export async function deleteOnboarding(id: string) {
  const { error } = await backendApi.DELETE("/onboarding/{id}", {
    params: { path: { id } },
  });

  if (error) {
    throw new Error("Failed to delete onboarding");
  }
}

export async function updateArticlePositions(
  onboardingId: string,
  positions: Array<{ articleId: string; position: number }>
) {
  const { data, error } = await backendApi.PATCH(
    "/onboarding/{id}/articles/positions",
    {
      params: { path: { id: onboardingId } },
      body: { positions },
    }
  );

  if (error) {
    throw new Error("Failed to update article positions");
  }

  return data;
}

export async function addArticle(
  onboardingId: string,
  params: { articleId: string; position: number }
) {
  const { data, error } = await backendApi.PATCH("/onboarding/{id}/articles", {
    params: { path: { id: onboardingId } },
    body: params,
  });

  if (error) {
    throw new Error("Failed to add article to onboarding");
  }

  return data;
}

export async function removeArticle(onboardingId: string, articleId: string) {
  const { error } = await backendApi.DELETE(
    "/onboarding/{id}/articles/{articleId}",
    {
      params: { path: { id: onboardingId, articleId } },
    }
  );

  if (error) {
    throw new Error("Failed to remove article from onboarding");
  }
}
