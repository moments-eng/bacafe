import { OnboardingArticleFixtures } from "@/test/fixtures/onboarding-article.fixtures";
import { OnboardingDriver } from "@/test/onboarding.driver";
import { OnboardingStep } from "../store/onboarding-store";
import { hebrewContent } from "@/locales/he";
import { screen, waitFor } from "@testing-library/react";

const mockGetProductionOnboarding = jest.fn();

jest.mock("../actions", () => ({
  getProductionOnboarding: () => mockGetProductionOnboarding(),
}));

describe("<ContentMatchingStep />", () => {
  let driver: OnboardingDriver;

  beforeEach(() => {
    driver = new OnboardingDriver();
    driver.given.onboardingStep(OnboardingStep.ContentMatching);
    jest.useFakeTimers();
    mockGetProductionOnboarding.mockClear();
  });

  afterEach(() => {
    driver.cleanup();
    jest.useRealTimers();
  });

  it("should like selected articles and store them in preferences", async () => {
    const articles = Array.from({ length: 4 }, (_, index) =>
      OnboardingArticleFixtures.valid({ position: index })
    );
    const likedArticleIndexes = [0, 1];

    await driver.given.articles(articles).render();

    await waitFor(() => {
      expect(
        screen.queryByText(hebrewContent.onboarding.loading.title)
      ).not.toBeInTheDocument();
    });

    await driver.when.contentMatchingStep(likedArticleIndexes);

    const likedArticles = driver.get.likedArticles();
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


  it("should show no articles message when articles array is empty", async () => {
    await driver.given.articles([]).render();

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

    await driver.given.articles(articles).render();

    await waitFor(() => {
      expect(
        screen.queryByText(hebrewContent.onboarding.loading.title)
      ).not.toBeInTheDocument();
    });

    await driver.when.contentMatchingStep([0]);

    expect(driver.get.currentStep()).toBe(OnboardingStep.PersonalDetails);
  });

  it("should store all articles when liking all of them", async () => {
    const articles = Array.from({ length: 3 }, (_, index) =>
      OnboardingArticleFixtures.valid({ position: index })
    );
    const allIndexes = [0, 1, 2];

    await driver.given.articles(articles).render();

    await waitFor(() => {
      expect(
        screen.queryByText(hebrewContent.onboarding.loading.title)
      ).not.toBeInTheDocument();
    });

    await driver.when.contentMatchingStep(allIndexes);

    const likedArticles = driver.get.likedArticles();
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

    expect(driver.get.currentStep()).toBe(OnboardingStep.PersonalDetails);
  });
});
