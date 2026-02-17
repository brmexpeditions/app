import { LegalLayout } from './LegalLayout';

interface CookiePolicyProps {
    onBack: () => void;
}

export function CookiePolicy({ onBack }: CookiePolicyProps) {
    return (
        <LegalLayout title="Cookie Policy" onBack={onBack}>
            <div className="space-y-8 text-gray-300">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">1. What Are Cookies</h2>
                    <p>
                        Cookies are small text files that are placed on your computer or mobile device by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Cookies</h2>
                    <p className="mb-4">
                        We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly.</li>
                        <li><strong>Analytics Cookies:</strong> These help us understand how users interact with our website.</li>
                        <li><strong>Functionality Cookies:</strong> Let us remember choices you make to provide better features.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">3. Disabling Cookies</h2>
                    <p>
                        You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Therefore, it is recommended that you do not disable cookies.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">4. Third Party Cookies</h2>
                    <p>
                        In some special cases, we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li><strong>Google Analytics:</strong> One of the most widespread and trusted analytics solutions on the web for helping us to understand how you use the site and ways that we can improve your experience.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">5. More Information</h2>
                    <p>
                        Hopefully, that has clarified things for you. If there is something that you aren't sure whether you need or not, it's usually safer to leave cookies enabled in case it does interact with one of the features you use on our site. If you are still looking for more information, you can contact us through email: support@fleetguard.in.
                    </p>
                </section>
            </div>
        </LegalLayout>
    );
}
