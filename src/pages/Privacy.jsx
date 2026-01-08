import { Shield, Mail } from 'lucide-react'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-night-950 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-lime-500/10 mb-6">
            <Shield className="h-8 w-8 text-lime-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-400">Last updated: January 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-slate max-w-none space-y-8">
          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Information We Collect</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              We collect information you provide directly to us, such as when you create an account,
              make a purchase, or contact us for support. This includes:
            </p>
            <ul className="list-disc list-inside text-slate-400 space-y-2">
              <li>Name and contact information (email, phone, address)</li>
              <li>Payment information (processed securely through our payment provider)</li>
              <li>Vehicle information for fitment purposes</li>
              <li>Order history and preferences</li>
            </ul>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">How We Use Your Information</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-slate-400 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Provide customer support</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Improve our products and services</li>
              <li>Send promotional communications (with your consent)</li>
            </ul>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Information Sharing</h2>
            <p className="text-slate-400 leading-relaxed">
              We do not sell your personal information. We may share your information with service providers
              who assist us in operating our business, such as payment processors and shipping carriers.
              These providers are contractually obligated to protect your information.
            </p>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Data Security</h2>
            <p className="text-slate-400 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction. Payment
              information is encrypted and processed through secure, PCI-compliant payment processors.
            </p>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Your Rights</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-slate-400 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Contact Us</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              If you have questions about this Privacy Policy, please contact us:
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
