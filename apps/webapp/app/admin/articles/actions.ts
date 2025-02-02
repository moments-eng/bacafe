"use server";

import {
  ArticleStatsDto,
  QueryArticlesDto,
  CreateArticleDto,
} from "@/generated/http-clients/backend/api";
import { articlesApi } from "@/lib/http-clients/backend/client";
import { withAdminAccess } from "../utils/auth";
import Logger from "../../../logger/logger";

/**
 * Query articles with filters, sorting, and pagination
 * @param params QueryArticlesDto containing filter, sort, and pagination options
 * @returns Promise with paginated articles data
 */
async function queryArticlesAction(params: QueryArticlesDto) {
  try {
    Logger.getInstance().info("[Articles] Querying articles with params", {
      params,
    });
    const { data } = await articlesApi.queryArticles(params);
    return data;
  } catch (error) {
    Logger.getInstance().error("[Articles] Failed to fetch articles", {
      error,
    });
    throw new Error("Failed to fetch articles");
  }
}

/**
 * Get article statistics
 * @returns Promise with article statistics
 */
async function getArticleStatsAction(): Promise<ArticleStatsDto> {
  try {
    Logger.getInstance().info("[Articles] Fetching article statistics");
    const { data } = await articlesApi.getArticleStats();
    return data;
  } catch (error) {
    Logger.getInstance().error(
      "[Articles] Failed to fetch article statistics",
      { error }
    );
    throw new Error("Failed to fetch article statistics");
  }
}

/**
 * Delete an article by ID
 * @param id Article ID to delete
 */
async function deleteArticleAction(id: string) {
  try {
    Logger.getInstance().info("[Articles] Deleting article", { id });
    await articlesApi.deleteArticle(id);
  } catch (error) {
    Logger.getInstance().error("[Articles] Failed to delete article", {
      id,
      error,
    });
    throw new Error("Failed to delete article");
  }
}

/**
 * Create and scrape a new article
 * @param data Object containing url and provider (source) for the article
 * @returns Promise with the created article data
 */
async function scrapeArticleAction(data: { url: string; provider: string }) {
  try {
    Logger.getInstance().info("[Articles] Creating article from URL", {
      url: data.url,
      provider: data.provider,
    });
    const createArticleDto: CreateArticleDto = {
      url: data.url,
      source: data.provider,
      forceScrape: true,
    };

    const { data: article } = await articlesApi.createArticle(createArticleDto);
    return article;
  } catch (error) {
    Logger.getInstance().error("[Articles] Failed to create article from URL", {
      url: data.url,
      error,
    });
    throw new Error("Failed to scrape article");
  }
}

export const queryArticles = withAdminAccess(queryArticlesAction);
export const getArticleStats = withAdminAccess(getArticleStatsAction);
export const deleteArticle = withAdminAccess(deleteArticleAction);
export const scrapeArticle = withAdminAccess(scrapeArticleAction);
