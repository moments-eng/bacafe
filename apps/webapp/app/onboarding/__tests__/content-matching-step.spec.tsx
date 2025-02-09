import { OnboardingArticleFixtures } from "@/test/fixtures/onboarding-article.fixtures";
import { OnboardingDriver } from "@/test/onboarding.driver";
import { OnboardingStep, useOnboardingStore } from "../store/onboarding-store";
import { hebrewContent } from "@/locales/he";
import { screen, waitFor } from "@testing-library/react";

const mockGetProductionOnboarding = jest.fn();

jest.mock("../actions", () => ({
  getProductionOnboarding: () => mockGetProductionOnboarding(),
}));

describe("<ContentMatchingStep />", () => {
  let driven: OnboardingDriver;

  beforeEach(() => {
    driven = new OnboardingDriver();
    jest.useFakeTimers();
    mockGetProductionOnboarding.mockClear();
  });

  afterEach(() => {
    driven.cleanup();
    jest.useRealTimers();
  });

  it("should like selected articles and store them in preferences", async () => {
    const articles = Array.from({ length: 4 }, (_, index) =>
      OnboardingArticleFixtures.valid({ position: index })
    );
    const likedArticleIndexes = [0, 1];

    await driven.given.articles(articles).given.render();

    await waitFor(() => {
      expect(
        screen.queryByText(hebrewContent.onboarding.loading.title)
      ).not.toBeInTheDocument();
    });

    await driven.when.contentMatchingStep(likedArticleIndexes);

    const likedArticles = driven.then.getLikedArticlesFromStore();
    expect(likedArticles).toHaveLength(2);

    const expectedLikedArticles = likedArticleIndexes.map((index) => ({
      title: articles[index].article.title,
      subtitle: articles[index].article.subtitle,
      content: articles[index].article.content,
      description: articles[index].article.description,
      categories: articles[index].article.categories,
      author: articles[index].article.author,
      enrichment: articles[index].article.enrichment,
    }));

    expect(likedArticles).toEqual(
      expect.arrayContaining(expectedLikedArticles)
    );
  });

  it("should show loading state initially", async () => {
    mockGetProductionOnboarding.mockImplementation(() => new Promise(() => {}));

    await driven.given.render();

    expect(
      screen.getByText(hebrewContent.onboarding.loading.title)
    ).toBeInTheDocument();
  });

  it("should show no articles message when articles array is empty", async () => {
    await driven.given.articles([]).given.render();

    await waitFor(() => {
      expect(
        screen.queryByText(hebrewContent.onboarding.loading.title)
      ).not.toBeInTheDocument();
    });

    expect(
      screen.getByText(hebrewContent.onboarding.noArticles)
    ).toBeInTheDocument();
  });

  it("should proceed to personal details after swiping all articles", async () => {
    const articles = Array.from({ length: 2 }, (_, index) =>
      OnboardingArticleFixtures.valid({ position: index })
    );

    await driven.given.articles(articles).given.render();

    await waitFor(() => {
      expect(
        screen.queryByText(hebrewContent.onboarding.loading.title)
      ).not.toBeInTheDocument();
    });

    await driven.when.contentMatchingStep([0]);

    const store = useOnboardingStore.getState();
    expect(store.step).toBe(OnboardingStep.PersonalDetails);
  });

  it("should store all articles when liking all of them", async () => {
    const articles = Array.from({ length: 3 }, (_, index) =>
      OnboardingArticleFixtures.valid({ position: index })
    );
    const allIndexes = [0, 1, 2];

    await driven.given.articles(articles).given.render();

    await waitFor(() => {
      expect(
        screen.queryByText(hebrewContent.onboarding.loading.title)
      ).not.toBeInTheDocument();
    });

    await driven.when.contentMatchingStep(allIndexes);

    const likedArticles = driven.then.getLikedArticlesFromStore();
    expect(likedArticles).toHaveLength(3);

    const expectedLikedArticles = allIndexes.map((index) => ({
      title: articles[index].article.title,
      subtitle: articles[index].article.subtitle,
      content: articles[index].article.content,
      description: articles[index].article.description,
      categories: articles[index].article.categories,
      author: articles[index].article.author,
      enrichment: articles[index].article.enrichment,
    }));

    expect(likedArticles).toEqual(
      expect.arrayContaining(expectedLikedArticles)
    );

    await waitFor(() => {
      const store = useOnboardingStore.getState();
      expect(store.step).toBe(OnboardingStep.PersonalDetails);
    });
  });
});
