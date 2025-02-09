import { faker } from "@faker-js/faker";
import { OnboardingArticlePositionDto } from "@/generated/http-clients/backend/api";

export class OnboardingArticleFixtures {
  static valid(
    overrides: Partial<OnboardingArticlePositionDto> = {}
  ): OnboardingArticlePositionDto {
    return {
      position: faker.number.int({ min: 1, max: 100 }),
      article: {
        id: faker.string.uuid(),
        title: faker.lorem.sentence({ min: 3, max: 6 }),
        subtitle: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(3),
        description: faker.lorem.paragraph(),
        categories: [faker.word.noun(), faker.word.noun()],
        author: faker.person.fullName(),
        enrichment: {},
        url: faker.internet.url(),
        source: faker.company.name(),
        externalId: faker.string.uuid(),
        createdAt: faker.date.recent().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
        ...overrides.article,
      },
      ...overrides,
    };
  }
}
