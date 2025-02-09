import { OnboardingDriver } from "@/test/onboarding.driver";
import { OnboardingStep } from "../store/onboarding-store";
import { waitFor } from "@testing-library/react";

const mockRouter = jest.requireMock("next/navigation").useRouter();

describe("<DigestChannelStep />", () => {
  let driver: OnboardingDriver;

  beforeEach(() => {
    driver = new OnboardingDriver();
    driver.given.session(null);
    driver.given.onboardingStep(OnboardingStep.DigestChannel);
    mockRouter.replace.mockReset();
  });

  afterEach(() => {
    driver.cleanup();
  });

  it("should update store with selected channel and phone number when not authenticated", async () => {
    await driver.render();

    await driver.when.chooseDigestChannel("whatsapp");
    await driver.when.addWhatsAppNumber("0501234567");
    await driver.when.clickNext();

    expect(driver.get.selectedDigestChannel()).toEqual({
      channel: "whatsapp",
      phoneNumber: "0501234567",
    });
    expect(driver.get.currentStep()).toBe(OnboardingStep.Login);
  });

  it("should redirect to success when submitting while authenticated", async () => {
    const session = {
      user: { email: "test@example.com", isOnboardingDone: false },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    await driver.given.session(session).render();

    await driver.when.chooseDigestChannel("whatsapp");
    await driver.when.addWhatsAppNumber("0501234567");
    await driver.when.clickNext();

    await waitFor(
      () => {
        expect(driver.get.routerCalls().replace[0]).toEqual([
          "/onboarding/success",
        ]);
      },
      { timeout: 2000 }
    );
  });
});
