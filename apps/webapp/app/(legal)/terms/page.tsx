import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | בול בפוני",
  description: "Terms of Use for בול בפוני service",
};

export default function TermsOfService() {
  return (
    <div className="prose mx-auto max-w-4xl p-8 dark:prose-invert">
      <h1>Terms of Use</h1>
      <p>Last updated: March 20, 2024</p>

      <p>
        Welcome to בול בפוני! These Terms of Use ("Terms") govern your use of
        the בול בפוני website, mobile application, and services (collectively,
        the "Service").
      </p>

      <h2>1. Service Description</h2>
      <p>
        בול בפוני provides a personalized content digest service that aggregates
        and delivers content based on your preferences and interests.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">2. Acceptance of Terms</h2>
        <p>
          By using the Service, you confirm that you are at least 18 years old
          or have the consent of a parent or guardian. You agree to comply with
          these Terms and all applicable laws and regulations.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Account Creation</h3>
            <p>
              You may need to create an account to access certain features of
              the Service. You are responsible for maintaining the
              confidentiality of your account information and for all activities
              that occur under your account.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Content Usage</h3>
            <p>
              You agree to use the Service only for lawful purposes and in a
              manner that does not infringe the rights of others.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Prohibited Activities</h3>
            <p>
              You may not engage in any activity that disrupts or interferes
              with the Service, including but not limited to hacking, spamming,
              or distributing malware.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">4. Intellectual Property</h2>
        <p>
          All content and materials available through the Service, including but
          not limited to text, graphics, website name, code, images, logos, and
          software, is the property of בול בפוני or its licensors and is
          protected by copyright, trademark, and other intellectual property
          laws. You may not use any of this content for commercial purposes
          without explicit written consent from בול בפוני.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">5. Account Termination</h2>
        <p>
          בול בפוני reserves the right to terminate or suspend your access to
          the Service at any time, without notice, for conduct that we believe
          violates these Terms or is harmful to other users of the Service, us,
          or third parties, or for any other reason.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          6. Limitation of Liability
        </h2>
        <p>
          בול בפוני is not liable for any indirect, incidental, or consequential
          damages arising out of your use of the Service. Our total liability to
          you for any claims arising out of or related to the Service is limited
          to the amount you have paid us in the past six months.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">8. Changes to Terms</h2>
        <p>
          בול בפוני may update these Terms from time to time. We will notify you
          of any changes by posting the new Terms on this page. Your continued
          use of the Service after such modifications will constitute your
          acknowledgment and agreement to the modified Terms.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">9. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at{" "}
          <a
            className="text-primary hover:text-primary/80"
            href="mailto:boolbepony@gmail.com"
          >
            boolbepony@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
}
