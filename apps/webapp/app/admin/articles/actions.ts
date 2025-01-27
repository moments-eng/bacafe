"use server";

import { backendApi } from "@/lib/http-clients/backend/client";
import type { components } from "@/lib/http-clients/backend/schema";
import { withAdminAccess } from "../utils/auth";

type QueryArticlesDto = components["schemas"]["QueryArticlesDto"];

type ArticleStatsDto = components["schemas"]["ArticleStatsDto"];

async function getArticlesAction(params: QueryArticlesDto) {
  const { data, error } = await backendApi.POST("/articles/query", {
    body: params,
  });

  if (error) {
    throw new Error("Failed to fetch articles");
  }

  return data;
}

async function getArticleStatsAction(): Promise<ArticleStatsDto> {
  const { data, error } = await backendApi.GET("/articles/stats");

  if (error) {
    throw new Error("Failed to fetch article statistics");
  }

  return data;
}

async function deleteArticleAction(id: string) {
  const { error } = await backendApi.DELETE("/articles/{id}", {
    params: { path: { id } },
  });

  if (error) {
    throw new Error("Failed to delete article");
  }
}

export const getArticles = withAdminAccess(getArticlesAction);
export const getArticleStats = withAdminAccess(getArticleStatsAction);
export const deleteArticle = withAdminAccess(deleteArticleAction);
