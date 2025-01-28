"use server";

import {
  ArticleStatsDto,
  QueryArticlesDto,
} from "@/generated/http-clients/backend/api";
import { articlesApi } from "@/lib/http-clients/backend/client";
import { withAdminAccess } from "../utils/auth";

async function queryArticlesAction(params: QueryArticlesDto) {
  try {
    const { data } = await articlesApi.queryArticles(params);
    return data;
  } catch (error) {
    throw new Error("Failed to fetch articles");
  }
}

async function getArticleStatsAction(): Promise<ArticleStatsDto> {
  try {
    const { data } = await articlesApi.getArticleStats();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch article statistics");
  }
}

async function deleteArticleAction(id: string) {
  try {
    await articlesApi.deleteArticle(id);
  } catch (error) {
    throw new Error("Failed to delete article");
  }
}

export const queryArticles = withAdminAccess(queryArticlesAction);
export const getArticleStats = withAdminAccess(getArticleStatsAction);
export const deleteArticle = withAdminAccess(deleteArticleAction);
