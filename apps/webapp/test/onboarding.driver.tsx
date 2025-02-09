import { OnboardingArticlePositionDto } from "@/generated/http-clients/backend/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import Onboarding from "../app/onboarding/page";
import {
  OnboardingStep,
  useOnboardingStore,
} from "../app/onboarding/store/onboarding-store";
import { SessionProvider } from "next-auth/react";

const mockGetProductionOnboarding = jest.fn();
jest.mock("../app/onboarding/actions", () => ({
  getProductionOnboarding: () => mockGetProductionOnboarding(),
}));

// Mock next/navigation
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
};

jest.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Get the mock function from next-auth
const nextAuth = jest.requireMock("next-auth/react");

interface DigestChannelInput {
  channel: "email" | "whatsapp";
  phoneNumber?: string;
}

export class OnboardingDriver {
  private articles: OnboardingArticlePositionDto[] = [];
  private queryClient: QueryClient;
  private currentIndex: number = 0;
  private session: any = null;

  constructor() {
    this.queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    mockGetProductionOnboarding.mockResolvedValue({ articles: [] });
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
      session: (session: any) => {
        this.session = session;
        nextAuth.setMockSession(session);
        return this;
      },
      onboardingStep: (step: OnboardingStep) => {
        useOnboardingStore.getState().setStep(step);
        return this;
      },
    };
  }

  async render() {
    await act(async () => {
      render(
        <SessionProvider session={this.session}>
          <QueryClientProvider client={this.queryClient}>
            <Onboarding />
          </QueryClientProvider>
        </SessionProvider>
      );
    });

    // Wait for loading state to finish
    await waitFor(() => {
      expect(screen.queryByText(/מעבד את המידע שלך/i)).not.toBeInTheDocument();
    });

    return this;
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
      chooseDigestChannel: async (channel: "email" | "whatsapp") => {
        await waitFor(() => {
          expect(screen.getByTestId("digest-channel-step")).toBeInTheDocument();
        });

        await act(async () => {
          const channelRadio = screen.getByRole("radio", { name: channel });
          fireEvent.click(channelRadio);
        });

        return this;
      },
      addWhatsAppNumber: async (phoneNumber: string) => {
        await act(async () => {
          const phoneInput = screen.getByPlaceholderText(
            /הזינו את מספר הטלפון שלכם/
          );
          fireEvent.change(phoneInput, {
            target: { value: phoneNumber },
          });
        });

        return this;
      },
      clickNext: async () => {
        await act(async () => {
          const nextButton = screen.getByRole("button", { name: /המשך/i });
          fireEvent.click(nextButton);
          await new Promise((resolve) => setTimeout(resolve, 0));
        });

        return this;
      },
    };
  }

  get get() {
    return {
      likedArticles: () => {
        const store = useOnboardingStore.getState();
        return store.articlePreferences;
      },
      currentStep: () => {
        const store = useOnboardingStore.getState();
        return store.step;
      },
      selectedDigestChannel: () => {
        const store = useOnboardingStore.getState();
        return {
          channel: store.digestChannel,
          phoneNumber: store.phoneNumber,
        };
      },
      routerCalls: () => {
        return {
          replace: mockRouter.replace.mock.calls,
          push: mockRouter.push.mock.calls,
        };
      },
    };
  }

  cleanup() {
    jest.clearAllMocks();
    mockRouter.push.mockReset();
    mockRouter.replace.mockReset();
    mockRouter.prefetch.mockReset();
    mockRouter.back.mockReset();
    mockRouter.forward.mockReset();
    this.queryClient.clear();
    this.currentIndex = 0;
    useOnboardingStore.getState().reset();
    this.session = null;
  }
}
