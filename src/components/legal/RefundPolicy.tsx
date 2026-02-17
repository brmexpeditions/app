import { LegalLayout } from './LegalLayout';

interface RefundPolicyProps {
    onBack: () => void;
}

export function RefundPolicy({ onBack }: RefundPolicyProps) {
    return (
        <LegalLayout title="Refund Policy" onBack={onBack}>
            <div className="space-y-8 text-gray-300">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">1. Overview</h2>
                    <p className="mb-4">
                        At Fleet Guard 360, we strive to ensure our customers are satisfied with our services.
                        This Refund Policy outlines the terms and conditions for refunds for our subscription services.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">2. Free Trial</h2>
                    <p>
                        We offer a free tier for up to 5 vehicles that is free forever. No credit card is required for the free tier. We encourage you to use this free tier to evaluate our services before upgrading to a paid plan.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">3. Monthly Subscriptions</h2>
                    <p>
                        Our paid plans are billed on a monthly or annual basis. You may cancel your subscription at any time. If you cancel your subscription, the cancellation will take effect at the end of the current billing cycle. We do not offer refunds for partial months of service.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">4. Annual Subscriptions</h2>
                    <p>
                        If you have subscribed to an annual plan and wish to cancel, you may be eligible for a pro-rated refund for the unused months of your subscription, minus a cancellation fee equal to one month of service at the monthly rate. Refund requests for annual subscriptions must be made within 30 days of the initial purchase or renewal.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">5. Refund Process</h2>
                    <p>
                        To request a refund, please contact our support team at support@fleetguard.in with your account details and the reason for the request. We will review your request and process eligible refunds within 7-10 business days. Refunds will be issued to the original payment method used for the purchase.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">6. Changes to this Policy</h2>
                    <p>
                        We reserve the right to modify this Refund Policy at any time. Changes and clarifications will take effect immediately upon their posting on the website.
                    </p>
                </section>
            </div>
        </LegalLayout>
    );
}
