import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^lucide-react$":
      "<rootDir>/node_modules/lucide-react/dist/cjs/lucide-react.js",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(lucide-react|@radix-ui|@tanstack|@babel|@testing-library|next-auth)/)",
  ],
  clearMocks: true,
};

export default createJestConfig(config);
