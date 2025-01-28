"use server";

import { CreateOnboardingDto } from "@/generated/http-clients/backend";
import { onboardingApi } from "@/lib/http-clients/backend/client";
import { withAdminAccess } from "../utils/auth";

async function getOnboardingsAction(params: { page?: number; limit?: number }) {
  try {
    const { data } = await onboardingApi.listOnboardings(
      params.limit,
      params.page
    );
    return data;
  } catch (error) {
    throw new Error("Failed to fetch onboardings");
  }
}

async function getOnboardingAction(id: string) {
  try {
    const { data } = await onboardingApi.getOnboardingById(id);
    return data;
  } catch (error) {
    throw new Error("Failed to fetch onboarding");
  }
}

async function createOnboardingAction(params: CreateOnboardingDto) {
  try {
    const { data } = await onboardingApi.createOnboarding(params);
    return data;
  } catch (error) {
    throw new Error("Failed to create onboarding");
  }
}

async function promoteToProductionAction(id: string) {
  try {
    const { data } = await onboardingApi.promoteOnboardingToProduction(id);
    return data;
  } catch (error) {
    throw new Error("Failed to promote onboarding to production");
  }
}

async function deleteOnboardingAction(id: string) {
  try {
    const { data } = await onboardingApi.deleteOnboarding(id);
    return data;
  } catch (error) {
    throw new Error("Failed to delete onboarding");
  }
}

async function updateArticlePositionsAction(
  onboardingId: string,
  positions: Array<{ articleId: string; position: number }>
) {
  try {
    const { data } = await onboardingApi.updateOnboardingArticlePositions(
      onboardingId,
      { positions }
    );
    return data;
  } catch (error) {
    throw new Error("Failed to update article positions");
  }
}

async function addArticleAction(
  onboardingId: string,
  params: { articleId: string; position: number }
) {
  try {
    const { data } = await onboardingApi.addArticleToOnboarding(
      onboardingId,
      params
    );
    return data;
  } catch (error) {
    throw new Error("Failed to add article to onboarding");
  }
}

async function removeArticleAction(onboardingId: string, articleId: string) {
  try {
    const { data } = await onboardingApi.removeArticleFromOnboarding(
      onboardingId,
      articleId
    );
    return data;
  } catch (error) {
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
