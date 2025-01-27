"use server";

import { backendApi } from "@/lib/http-clients/backend/client";
import type { components } from "@/lib/http-clients/backend/schema";
import { withAdminAccess } from "../utils/auth";

type OnboardingDto = components["schemas"]["OnboardingDto"];
type CreateOnboardingDto = components["schemas"]["CreateOnboardingDto"];
type PaginatedOnboardingDto = components["schemas"]["PaginatedOnboardingDto"];

async function getOnboardingsAction(params: { page?: number; limit?: number }) {
  const { data, error } = await backendApi.GET("/onboarding", {
    params: { query: params },
  });

  if (error) {
    throw new Error("Failed to fetch onboardings");
  }

  return data;
}

async function getOnboardingAction(id: string) {
  const { data, error } = await backendApi.GET("/onboarding/{id}", {
    params: { path: { id } },
  });

  if (error) {
    throw new Error("Failed to fetch onboarding");
  }

  return data;
}

async function createOnboardingAction(params: CreateOnboardingDto) {
  const { data, error } = await backendApi.POST("/onboarding", {
    body: params,
  });

  if (error) {
    console.log(error);
    throw new Error("Failed to create onboarding");
  }

  return data;
}

async function promoteToProductionAction(id: string) {
  const { data, error } = await backendApi.POST("/onboarding/{id}/promote", {
    params: { path: { id } },
  });

  if (error) {
    throw new Error("Failed to promote onboarding to production");
  }

  return data;
}

async function deleteOnboardingAction(id: string) {
  const { error } = await backendApi.DELETE("/onboarding/{id}", {
    params: { path: { id } },
  });

  if (error) {
    throw new Error("Failed to delete onboarding");
  }
}

async function updateArticlePositionsAction(
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

async function addArticleAction(
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

async function removeArticleAction(onboardingId: string, articleId: string) {
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

export const getOnboardings = withAdminAccess(getOnboardingsAction);
export const getOnboarding = withAdminAccess(getOnboardingAction);
export const createOnboarding = withAdminAccess(createOnboardingAction);
export const promoteToProduction = withAdminAccess(promoteToProductionAction);
export const deleteOnboarding = withAdminAccess(deleteOnboardingAction);
export const updateArticlePositions = withAdminAccess(
  updateArticlePositionsAction
);
export const addArticle = withAdminAccess(addArticleAction);
export const removeArticle = withAdminAccess(removeArticleAction);
