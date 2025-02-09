import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  redirect: jest.fn(),
}));

let mockSession: any = null;

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn().mockImplementation(() => ({
    data: mockSession,
    status: mockSession ? "authenticated" : "unauthenticated",
  })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  getSession: jest.fn().mockImplementation(() => Promise.resolve(mockSession)),
  setMockSession: (session: any) => {
    mockSession = session;
  },
}));

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;
