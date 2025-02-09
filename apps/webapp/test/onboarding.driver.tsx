import { OnboardingArticlePositionDto } from "@/generated/http-clients/backend/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen } from "@testing-library/react";
import Onboarding from "../app/onboarding/page";
import { useOnboardingStore } from "../app/onboarding/store/onboarding-store";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
}));

const mockGetProductionOnboarding = jest.fn();
jest.mock("../app/onboarding/actions", () => ({
  getProductionOnboarding: () => mockGetProductionOnboarding(),
}));

export class OnboardingDriver {
  private articles: OnboardingArticlePositionDto[] = [];
  private queryClient: QueryClient;
  private currentIndex: number = 0;

  constructor() {
    this.queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  }

  get given() {
    return {
      articles: (articles: OnboardingArticlePositionDto[]) => {
        this.articles = articles;
        mockGetProductionOnboarding.mockResolvedValue({
          articles: articles,
        });
        return this;
      },
      render: async () => {
        await act(async () => {
          render(
            <QueryClientProvider client={this.queryClient}>
              <Onboarding />
            </QueryClientProvider>
          );
        });
        return this;
      },
    };
  }

  get when() {
    return {
      contentMatchingStep: async (likedArticleIndexes: number[]) => {
        const remainingArticles = this.articles.length - this.currentIndex;
        for (let i = 0; i < remainingArticles; i++) {
          await act(async () => {
            const likeButton = await screen.findByTestId("like-button");
            const dislikeButton = await screen.findByTestId("dislike-button");

            if (likedArticleIndexes.includes(this.currentIndex)) {
              fireEvent.click(likeButton);
            } else {
              fireEvent.click(dislikeButton);
            }

            this.currentIndex++;
          });
        }
        return this;
      },
    };
  }

  get then() {
    return {
      getLikedArticlesFromStore: () => {
        const store = useOnboardingStore.getState();
        return store.articlePreferences;
      },
    };
  }

  cleanup() {
    jest.clearAllMocks();
    this.queryClient.clear();
    this.currentIndex = 0;
    useOnboardingStore.getState().reset();
  }
}
