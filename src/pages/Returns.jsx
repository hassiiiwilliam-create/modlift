import { RotateCcw, Mail, CheckCircle, XCircle } from 'lucide-react'

export default function Returns() {
  return (
    <div className="min-h-screen bg-night-950 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-lime-500/10 mb-6">
            <RotateCcw className="h-8 w-8 text-lime-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Returns & Refunds</h1>
          <p className="text-slate-400">Our hassle-free return policy</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-slate max-w-none space-y-8">
          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">30-Day Return Policy</h2>
            <p className="text-slate-400 leading-relaxed">
              We want you to be completely satisfied with your purchase. If you're not happy with your
              order, you may return eligible items within 30 days of delivery for a full refund or exchange.
            </p>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Eligible for Return</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-lime-500 mt-0.5 flex-shrink-0" />
                <p className="text-slate-400">Items in original, unused condition with all packaging</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-lime-500 mt-0.5 flex-shrink-0" />
                <p className="text-slate-400">Items returned within 30 days of delivery</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-lime-500 mt-0.5 flex-shrink-0" />
                <p className="text-slate-400">Items with original tags and accessories included</p>
              </div>
            </div>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Not Eligible for Return</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-coral-500 mt-0.5 flex-shrink-0" />
                <p className="text-slate-400">Installed or mounted products</p>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-coral-500 mt-0.5 flex-shrink-0" />
                <p className="text-slate-400">Items showing signs of use or damage</p>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-coral-500 mt-0.5 flex-shrink-0" />
                <p className="text-slate-400">Custom or special-order items</p>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-coral-500 mt-0.5 flex-shrink-0" />
                <p className="text-slate-400">Items missing original packaging or accessories</p>
              </div>
            </div>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">How to Start a Return</h2>
            <ol className="list-decimal list-inside text-slate-400 space-y-3">
              <li>Log into your account and go to your order history</li>
              <li>Select the order containing the item(s) you wish to return</li>
              <li>Click "Request Return" and follow the prompts</li>
              <li>Print the prepaid shipping label (if eligible)</li>
              <li>Pack items securely in original packaging</li>
              <li>Drop off at any authorized shipping location</li>
            </ol>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Refund Processing</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              Once we receive and inspect your return, we'll process your refund within 3-5 business days.
              The refund will be credited to your original payment method.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Please note that your bank or credit card company may take additional time to post the
              refund to your account.
            </p>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Damaged or Defective Items</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              If you receive a damaged or defective item, please contact us within 48 hours of delivery.
              We'll arrange for a replacement or full refund at no additional cost to you.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Please include photos of the damage when contacting our support team.
            </p>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Need Help?</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              Our customer support team is here to help with any return questions:
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
