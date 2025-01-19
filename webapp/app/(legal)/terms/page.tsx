import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Terms of Use | Bacafe',
	description: 'Terms of Use for Bacafe service',
};

export default function TermsPage() {
	return (
		<article className="prose prose-sm prose-slate dark:prose-invert max-w-none">
			<h1 className="text-2xl font-bold mb-6">Terms of Use</h1>
			<p className="text-sm text-muted-foreground mb-4">
				Last Updated: Jan 19, 2025
			</p>

			<p className="mb-6">
				Welcome to Bacafe! These Terms of Use ("Terms") govern your use of the
				Bacafe website, mobile application, and services (collectively, the
				"Service"). By accessing or using the Service, you agree to be bound by
				these Terms. If you do not agree to these Terms, please do not use the
				Service.
			</p>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
				<p>
					By using the Service, you confirm that you are at least 18 years old
					or have the consent of a parent or guardian. You agree to comply with
					these Terms and all applicable laws and regulations.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-3">2. Service Description</h2>
				<p>
					Bacafe provides a personalized content digest service that aggregates
					and delivers content based on your preferences. The Service is
					designed to offer a new way to consume content, free from ads and
					clutter.
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
					All content provided through the Service, including text, graphics,
					logos, and software, is the property of Bacafe or its licensors and is
					protected by intellectual property laws. You may not reproduce,
					distribute, or create derivative works from this content without prior
					written consent from Bacafe.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-3">5. Termination</h2>
				<p>
					Bacafe reserves the right to terminate or suspend your access to the
					Service at any time, without notice, for any reason, including but not
					limited to a violation of these Terms.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-3">
					6. Limitation of Liability
				</h2>
				<p>
					Bacafe is not liable for any indirect, incidental, or consequential
					damages arising out of your use of the Service. Our total liability to
					you for any claims arising out of or related to the Service is limited
					to the amount you have paid us in the past six months.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-3">7. Changes to Terms</h2>
				<p>
					Bacafe may update these Terms from time to time. We will notify you of
					any changes by posting the new Terms on our website. Your continued
					use of the Service after such changes constitutes your acceptance of
					the new Terms.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-3">8. Governing Law</h2>
				<p>
					These Terms are governed by the laws of Israel. Any disputes arising
					out of or related to these Terms or the Service will be resolved
					exclusively in the courts of Israel.
				</p>
			</section>

			<section className="mb-6">
				<h2 className="text-xl font-semibold mb-3">9. Contact Information</h2>
				<p>
					If you have any questions about these Terms, please contact us at{' '}
					<a
						href="mailto:bacafe-news@gmail.com"
						className="text-primary hover:underline"
					>
						bacafe-news@gmail.com
					</a>
				</p>
			</section>
		</article>
	);
}
