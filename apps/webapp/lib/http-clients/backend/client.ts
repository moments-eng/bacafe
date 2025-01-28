import {
  ArticlesApi,
  Configuration,
  DailyDigestApi,
  FeedsApi,
  OnboardingApi,
} from "@/generated/http-clients/backend";

const config = new Configuration({
  basePath: process.env.BACKNED_API_URL ?? "",
});

const articlesApi = new ArticlesApi(config);
const feedsApi = new FeedsApi(config);
const onboardingApi = new OnboardingApi(config);
const dailyDigestApi = new DailyDigestApi(config);

export { articlesApi, dailyDigestApi, feedsApi, onboardingApi };

