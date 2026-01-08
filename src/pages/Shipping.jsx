import { Truck, Package, Clock, MapPin, Mail } from 'lucide-react'

export default function Shipping() {
  return (
    <div className="min-h-screen bg-night-950 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-lime-500/10 mb-6">
            <Truck className="h-8 w-8 text-lime-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Shipping Policy</h1>
          <p className="text-slate-400">Fast, reliable delivery across the USA</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-slate max-w-none space-y-8">
          {/* Shipping Options */}
          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-6">Shipping Options</h2>
            <div className="grid gap-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-night-800/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime-500/10 flex-shrink-0">
                  <Package className="h-5 w-5 text-lime-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Standard Shipping</h3>
                  <p className="text-slate-400 text-sm mt-1">5-7 business days</p>
                  <p className="text-lime-400 text-sm mt-1">FREE on orders over $99</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-night-800/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime-500/10 flex-shrink-0">
                  <Clock className="h-5 w-5 text-lime-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Expedited Shipping</h3>
                  <p className="text-slate-400 text-sm mt-1">2-3 business days</p>
                  <p className="text-slate-400 text-sm mt-1">Calculated at checkout</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-night-800/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime-500/10 flex-shrink-0">
                  <Truck className="h-5 w-5 text-lime-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Freight Shipping</h3>
                  <p className="text-slate-400 text-sm mt-1">For large items (lift kits, tire sets)</p>
                  <p className="text-slate-400 text-sm mt-1">Delivery time varies by location</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Processing Time</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              Most orders are processed and shipped within 1-2 business days. During peak seasons or
              promotional periods, processing may take slightly longer.
            </p>
            <p className="text-slate-400 leading-relaxed">
              You'll receive a shipping confirmation email with tracking information once your order ships.
            </p>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-5 w-5 text-lime-500" />
              <h2 className="text-xl font-semibold text-white">Shipping Locations</h2>
            </div>
            <p className="text-slate-400 leading-relaxed mb-4">
              We currently ship to all 50 US states. Some remote areas may have extended delivery times.
            </p>
            <p className="text-slate-400 leading-relaxed">
              For international shipping inquiries, please contact our support team.
            </p>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Tracking Your Order</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              Once your order ships, you'll receive an email with your tracking number. You can also
              track your order by logging into your account and viewing your order history.
            </p>
            <p className="text-slate-400 leading-relaxed">
              If you haven't received tracking information within 3 business days, please contact us.
            </p>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Oversized & Freight Items</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              Large items like complete lift kits and tire packages may ship via freight carrier.
              These shipments require:
            </p>
            <ul className="list-disc list-inside text-slate-400 space-y-2">
              <li>Someone present to receive and sign for delivery</li>
              <li>Inspection of items before signing for delivery</li>
              <li>Note any damage on the delivery receipt before signing</li>
            </ul>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Delivery Issues</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              If your package arrives damaged, please take photos and contact us within 48 hours.
              We'll work with the carrier to resolve the issue quickly.
            </p>
            <p className="text-slate-400 leading-relaxed">
              For missing packages, please wait until the expected delivery date passes, then contact us.
            </p>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Questions?</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              Have questions about shipping? Contact our team:
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
