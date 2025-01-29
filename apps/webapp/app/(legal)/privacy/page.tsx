import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | בול בפוני",
  description: "Privacy Policy for בול בפוני service",
};

export default function PrivacyPolicy() {
  return (
    <div className="prose mx-auto max-w-4xl p-8 dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p>Last updated: March 20, 2024</p>

      <p className="mb-6">
        Your privacy is important to us. This Privacy Policy explains how בול
        בפוני ("we," "us," or "our") collects, uses, and protects your personal
        information when you use our Service.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          1. Information We Collect
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Personal Information</h3>
            <p>
              When you create an account, we may collect information such as
              your name, email address, age, and gender. This information is
              used to personalize your content experience.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Usage Data</h3>
            <p>
              We collect data on how you interact with the Service, including
              the content you view, the time you spend on the Service, and your
              preferences.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Device Information</h3>
            <p>
              We may collect information about the device you use to access the
              Service, including the device type, operating system, and browser
              type.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          2. How We Use Your Information
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Personalization</h3>
            <p>
              We use your information to personalize your content digest and
              improve your overall experience.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Service Improvement</h3>
            <p>
              We analyze usage data to improve the Service and develop new
              features.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Communication</h3>
            <p>
              We may use your email address to send you updates, newsletters,
              and promotional materials. You can opt-out of these communications
              at any time.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          3. Data Sharing and Disclosure
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Third-Party Services</h3>
            <p>
              We may use third-party services to help us operate the Service,
              such as hosting providers and analytics services. These third
              parties are obligated to protect your information and use it only
              for the purposes we specify.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Legal Requirements</h3>
            <p>
              We may disclose your information if required by law or in response
              to a valid legal request.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your
          information from unauthorized access, alteration, or destruction.
          However, no method of transmission over the internet or electronic
          storage is completely secure, and we cannot guarantee absolute
          security.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Access and Correction</h3>
            <p>
              You have the right to access and correct your personal information
              at any time.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Data Deletion</h3>
            <p>
              You can request the deletion of your personal information by
              contacting us at{" "}
              <a
                className="text-primary hover:text-primary/80"
                href="mailto:boolbepony@gmail.com"
              >
                boolbepony@gmail.com
              </a>
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Opt-Out</h3>
            <p>
              You can opt-out of receiving promotional communications by
              following the unsubscribe link in the email or contacting us
              directly.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">6. Children's Privacy</h2>
        <p>
          The Service is not intended for children under the age of 13. We do
          not knowingly collect personal information from children under 13. If
          we become aware that we have collected such information, we will take
          steps to delete it.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">
          7. Changes to Privacy Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on our website.
          Your continued use of the Service after such changes constitutes your
          acceptance of the new Privacy Policy.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">8. Contact Information</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at{" "}
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
