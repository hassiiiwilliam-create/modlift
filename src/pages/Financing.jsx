import { CreditCard, Mail, CheckCircle, DollarSign, Clock, Percent } from 'lucide-react'

export default function Financing() {
  return (
    <div className="min-h-screen bg-night-950 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-lime-500/10 mb-6">
            <CreditCard className="h-8 w-8 text-lime-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Financing Options</h1>
          <p className="text-slate-400">Flexible payment plans for your build</p>
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-lime-500/20 to-lime-600/10 rounded-2xl border border-lime-500/30 p-8 mb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Buy Now, Pay Later</h2>
          <p className="text-slate-300">
            Get the parts you need today with affordable monthly payments
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-slate max-w-none space-y-8">
          {/* Financing Options */}
          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-6">Payment Options</h2>
            <div className="grid gap-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-night-800/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime-500/10 flex-shrink-0">
                  <Percent className="h-5 w-5 text-lime-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">0% APR Financing</h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Pay over 6-12 months with no interest on qualifying orders
                  </p>
                  <p className="text-lime-400 text-sm mt-1">For orders $500+</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-night-800/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime-500/10 flex-shrink-0">
                  <Clock className="h-5 w-5 text-lime-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Pay in 4</h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Split your purchase into 4 interest-free payments
                  </p>
                  <p className="text-slate-400 text-sm mt-1">Powered by Shop Pay or Klarna</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-night-800/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime-500/10 flex-shrink-0">
                  <DollarSign className="h-5 w-5 text-lime-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Extended Financing</h3>
                  <p className="text-slate-400 text-sm mt-1">
                    12-24 month payment plans for larger purchases
                  </p>
                  <p className="text-slate-400 text-sm mt-1">Subject to credit approval</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">How It Works</h2>
            <ol className="list-decimal list-inside text-slate-400 space-y-3">
              <li>Add items to your cart and proceed to checkout</li>
              <li>Select your preferred financing option at payment</li>
              <li>Complete a quick application (soft credit check - won't affect your score)</li>
              <li>Get approved instantly and complete your purchase</li>
              <li>Pay over time according to your selected plan</li>
            </ol>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Benefits</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-lime-500 mt-0.5 flex-shrink-0" />
                <p className="text-slate-400">No hard credit check to see your options</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-lime-500 mt-0.5 flex-shrink-0" />
                <p className="text-slate-400">Instant approval decisions</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-lime-500 mt-0.5 flex-shrink-0" />
                <p className="text-slate-400">No hidden fees or prepayment penalties</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-lime-500 mt-0.5 flex-shrink-0" />
                <p className="text-slate-400">Build credit with on-time payments</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-lime-500 mt-0.5 flex-shrink-0" />
                <p className="text-slate-400">Get your parts shipped immediately</p>
              </div>
            </div>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Eligibility</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              To qualify for financing, you must:
            </p>
            <ul className="list-disc list-inside text-slate-400 space-y-2">
              <li>Be at least 18 years old</li>
              <li>Have a valid US address</li>
              <li>Have a valid email and phone number</li>
              <li>Meet our financing partner's credit requirements</li>
            </ul>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Example Payment</h2>
            <div className="bg-night-800/50 rounded-xl p-6">
              <p className="text-slate-400 mb-4">
                For a $1,200 lift kit purchase with 0% APR for 12 months:
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-lime-400">$100</span>
                <span className="text-slate-400">/month for 12 months</span>
              </div>
              <p className="text-xs text-slate-500 mt-4">
                *Example for illustration purposes. Actual terms depend on credit approval.
                Subject to financing partner's terms and conditions.
              </p>
            </div>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Questions?</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              Have questions about financing options? We're happy to help:
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
