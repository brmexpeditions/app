import { LegalLayout } from './LegalLayout';

interface PrivacyPolicyProps {
    onBack: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
    return (
        <LegalLayout title="Privacy Policy" onBack={onBack}>
            <div className="space-y-8 text-gray-300">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                    <p>

                        Welcome to Fleet Guard 360 ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regard to your personal information, please contact us at privacy@fleetguard.in.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
                    <p className="mb-4">
                        At Fleet Guard 360, we take your privacy seriously. This Privacy Policy explains how we collect,
                        use, disclose, and safeguard your information when you visit our website or use our fleet management services.
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Names and Contact Data (email address, phone number).</li>
                        <li>Vehicle Information (registration numbers, model details).</li>
                        <li>Credentials (passwords, hints, and similar security information).</li>
                        <li>Payment Data (processed securely by our payment partners).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                    <p className="mb-4">
                        We use personal information collected via our website for a variety of business purposes described below:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>To facilitate account creation and logon process.</li>
                        <li>To send you administrative information.</li>
                        <li>To fulfill and manage your orders and subscriptions.</li>
                        <li>To send you marketing and promotional communications.</li>
                        <li>To deliver targeted advertising to you.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">4. Sharing Your Information</h2>
                    <p>
                        We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may process or share your data that we hold based on the following legal basis: Consent, Legitimate Interests, Performance of a Contract, and Legal Obligations.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">5. Security of Your Information</h2>
                    <p>
                        We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed to be completely secure.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">6. Contact Us</h2>
                    <p>
                        If you have questions or comments about this policy, you may email us at privacy@fleetguard.in or by post to:
                    </p>
                    <p>
                        If you have questions or comments about this Privacy Policy, please contact us at:<br />
                        <strong>Fleet Guard 360</strong><br />
                        Email: privacy@fleetguard360.com<br />
                        Address: 123 Fleet Street, Tech City, India
                    </p>            </section>
            </div>
        </LegalLayout>
    );
}

