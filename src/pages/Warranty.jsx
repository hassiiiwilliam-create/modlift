import { ShieldCheck, Mail, CheckCircle } from 'lucide-react'

export default function Warranty() {
  return (
    <div className="min-h-screen bg-night-950 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-lime-500/10 mb-6">
            <ShieldCheck className="h-8 w-8 text-lime-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Warranty Information</h1>
          <p className="text-slate-400">Quality guaranteed on every product</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-slate max-w-none space-y-8">
          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Our Warranty Promise</h2>
            <p className="text-slate-400 leading-relaxed">
              We stand behind every product we sell. All items purchased from ModLift are covered by
              manufacturer warranties, and we'll help you navigate the warranty process if any issues arise.
            </p>
          </section>

          {/* Warranty by Category */}
          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-6">Warranty Coverage by Product</h2>
            <div className="space-y-6">
              <div className="border-l-2 border-lime-500 pl-4">
                <h3 className="font-semibold text-white mb-2">Lift Kits</h3>
                <p className="text-slate-400 text-sm">
                  Most lift kits include a lifetime warranty on structural components against manufacturer
                  defects. Shocks and struts typically carry a 1-3 year warranty depending on the brand.
                </p>
              </div>
              <div className="border-l-2 border-lime-500 pl-4">
                <h3 className="font-semibold text-white mb-2">Wheels</h3>
                <p className="text-slate-400 text-sm">
                  Wheel warranties vary by manufacturer but typically include lifetime structural warranty
                  and 1-2 year finish warranty against defects (not road damage).
                </p>
              </div>
              <div className="border-l-2 border-lime-500 pl-4">
                <h3 className="font-semibold text-white mb-2">Tires</h3>
                <p className="text-slate-400 text-sm">
                  Tires include manufacturer treadwear warranties varying from 40,000 to 70,000 miles
                  depending on the model. Road hazard protection available on select products.
                </p>
              </div>
              <div className="border-l-2 border-lime-500 pl-4">
                <h3 className="font-semibold text-white mb-2">Accessories</h3>
                <p className="text-slate-400 text-sm">
                  Warranty coverage varies by product. Check individual product pages for specific warranty
                  information.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">What's Covered</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-lime-500 mt-0.5 flex-shrink-0" />
                <p className="text-slate-400">Manufacturing defects in materials or workmanship</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-lime-500 mt-0.5 flex-shrink-0" />
                <p className="text-slate-400">Structural failures under normal use</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-lime-500 mt-0.5 flex-shrink-0" />
                <p className="text-slate-400">Premature wear not caused by abuse or neglect</p>
              </div>
            </div>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">What's Not Covered</h2>
            <ul className="list-disc list-inside text-slate-400 space-y-2">
              <li>Damage from improper installation</li>
              <li>Normal wear and tear</li>
              <li>Damage from accidents, abuse, or neglect</li>
              <li>Damage from off-road use beyond product specifications</li>
              <li>Cosmetic damage that doesn't affect performance</li>
              <li>Products modified after purchase</li>
            </ul>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Filing a Warranty Claim</h2>
            <ol className="list-decimal list-inside text-slate-400 space-y-3">
              <li>Contact our support team with your order number and issue description</li>
              <li>Provide photos documenting the defect or issue</li>
              <li>Our team will review and coordinate with the manufacturer</li>
              <li>If approved, we'll arrange for repair, replacement, or credit</li>
            </ol>
            <p className="text-slate-400 leading-relaxed mt-4">
              Keep your original invoice as proof of purchase — you'll need it for warranty claims.
            </p>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Installation Requirements</h2>
            <p className="text-slate-400 leading-relaxed">
              Many warranties require professional installation. We recommend having all products
              installed by a certified technician and keeping installation records. Improper installation
              may void your warranty coverage.
            </p>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Contact Warranty Support</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              Have a warranty question or need to file a claim? We're here to help:
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
