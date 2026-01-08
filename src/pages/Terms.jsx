import { FileText, Mail } from 'lucide-react'

export default function Terms() {
  return (
    <div className="min-h-screen bg-night-950 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-lime-500/10 mb-6">
            <FileText className="h-8 w-8 text-lime-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-slate-400">Last updated: January 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-slate max-w-none space-y-8">
          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Agreement to Terms</h2>
            <p className="text-slate-400 leading-relaxed">
              By accessing or using ModLift's website and services, you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Products and Services</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              ModLift sells aftermarket automotive parts including lift kits, wheels, tires, and accessories.
              All products are subject to availability. We reserve the right to discontinue any product
              at any time.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Product images are for illustration purposes. Actual products may vary slightly in appearance.
              We strive to display accurate colors, but monitor settings may affect how colors appear.
            </p>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Pricing and Payment</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              All prices are displayed in US Dollars and are subject to change without notice. We accept
              major credit cards and other payment methods as displayed at checkout.
            </p>
            <p className="text-slate-400 leading-relaxed">
              You agree to provide accurate and complete payment information. By submitting an order,
              you authorize us to charge your payment method for the total amount of your order.
            </p>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Fitment Responsibility</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              While we provide fitment information to help you select compatible parts, it is ultimately
              your responsibility to verify that products are suitable for your vehicle. Professional
              installation is recommended for all products.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Modifying your vehicle may affect its handling, warranty, or compliance with local regulations.
              Check your local laws before installing aftermarket parts.
            </p>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">User Accounts</h2>
            <p className="text-slate-400 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials and for
              all activities under your account. Notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Limitation of Liability</h2>
            <p className="text-slate-400 leading-relaxed">
              To the maximum extent permitted by law, ModLift shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising from your use of our
              products or services. Our total liability shall not exceed the amount you paid for the
              product in question.
            </p>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Governing Law</h2>
            <p className="text-slate-400 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the State
              of Texas, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Contact Us</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              If you have questions about these Terms of Service, please contact us:
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
