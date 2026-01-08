import { Cookie, Mail } from 'lucide-react'

export default function Cookies() {
  return (
    <div className="min-h-screen bg-night-950 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-lime-500/10 mb-6">
            <Cookie className="h-8 w-8 text-lime-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Cookie Policy</h1>
          <p className="text-slate-400">Last updated: January 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-slate max-w-none space-y-8">
          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">What Are Cookies?</h2>
            <p className="text-slate-400 leading-relaxed">
              Cookies are small text files stored on your device when you visit our website. They help
              us provide you with a better experience by remembering your preferences, keeping you
              logged in, and understanding how you use our site.
            </p>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">How We Use Cookies</h2>
            <div className="space-y-4">
              <div className="border-l-2 border-lime-500 pl-4">
                <h3 className="font-semibold text-white mb-2">Essential Cookies</h3>
                <p className="text-slate-400 text-sm">
                  Required for the website to function properly. These enable core features like
                  shopping cart, checkout, and account login.
                </p>
              </div>
              <div className="border-l-2 border-lime-500 pl-4">
                <h3 className="font-semibold text-white mb-2">Functional Cookies</h3>
                <p className="text-slate-400 text-sm">
                  Remember your preferences such as your selected vehicle, language settings, and
                  recently viewed products.
                </p>
              </div>
              <div className="border-l-2 border-lime-500 pl-4">
                <h3 className="font-semibold text-white mb-2">Analytics Cookies</h3>
                <p className="text-slate-400 text-sm">
                  Help us understand how visitors interact with our website, which pages are most
                  popular, and how we can improve your experience.
                </p>
              </div>
              <div className="border-l-2 border-lime-500 pl-4">
                <h3 className="font-semibold text-white mb-2">Marketing Cookies</h3>
                <p className="text-slate-400 text-sm">
                  Used to deliver relevant advertisements and track the effectiveness of our marketing
                  campaigns.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Third-Party Cookies</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              We use services from trusted third parties that may set their own cookies:
            </p>
            <ul className="list-disc list-inside text-slate-400 space-y-2">
              <li>Google Analytics — website analytics and performance</li>
              <li>Stripe — secure payment processing</li>
              <li>Social media platforms — sharing and login features</li>
            </ul>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Managing Cookies</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              You can control cookies through your browser settings. Most browsers allow you to:
            </p>
            <ul className="list-disc list-inside text-slate-400 space-y-2">
              <li>View cookies stored on your device</li>
              <li>Delete all or specific cookies</li>
              <li>Block cookies from specific websites</li>
              <li>Block all cookies (may affect site functionality)</li>
            </ul>
            <p className="text-slate-400 leading-relaxed mt-4">
              Note: Disabling essential cookies may prevent you from using certain features like
              the shopping cart and checkout.
            </p>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Your Choices</h2>
            <p className="text-slate-400 leading-relaxed">
              By continuing to use our website, you consent to our use of cookies as described in
              this policy. You can withdraw your consent at any time by clearing cookies from your
              browser or using your browser's privacy settings.
            </p>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Contact Us</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              If you have questions about our use of cookies, please contact us:
            </p>
            <a
              href="mailto:support@modlift.us"
              className="inline-flex items-center gap-2 text-lime-400 hover:text-lime-300 transition-colors"
            >
              <Mail className="h-4 w-4" />
              support@modlift.us
            </a>
          </section>
        </div>
      </div>
    </div>
  )
}
