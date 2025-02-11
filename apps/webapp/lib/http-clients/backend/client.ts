import {
  ArticlesApi,
  Configuration,
  FeedsApi,
  OnboardingApi,
  DigestsApi,
  UsersApi,
} from "@/generated/http-clients/backend";

const config = new Configuration({
  basePath: process.env.BACKEND_API_URL ?? "",
});

const articlesApi = new ArticlesApi(config);
const feedsApi = new FeedsApi(config);
const onboardingApi = new OnboardingApi(config);
const digestsApi = new DigestsApi(config);
const usersApi = new UsersApi(config);

export { articlesApi, digestsApi, feedsApi, onboardingApi, usersApi };

