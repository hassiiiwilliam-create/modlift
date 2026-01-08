import { Users, Target, Heart, Mail, MapPin } from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen bg-night-950 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-lime-500/10 mb-6">
            <Users className="h-8 w-8 text-lime-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">About ModLift</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Premium truck and SUV parts from enthusiasts who understand the build
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-slate max-w-none space-y-8">
          {/* Story Section */}
          <section id="story" className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Our Story</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              ModLift was founded in College Station, Texas by a team of truck enthusiasts who were
              frustrated with the complexity of finding the right parts. We've spent countless hours
              researching fitment, comparing brands, and testing products so you don't have to.
            </p>
            <p className="text-slate-400 leading-relaxed">
              What started as a passion project has grown into a curated marketplace where every product
              is vetted for quality and compatibility. We only sell parts we'd put on our own builds.
            </p>
          </section>

          {/* Values */}
          <section className="grid md:grid-cols-3 gap-6">
            <div className="bg-night-900/50 rounded-2xl border border-night-800/50 p-6 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-lime-500/10 mb-4">
                <Target className="h-6 w-6 text-lime-500" />
              </div>
              <h3 className="font-semibold text-white mb-2">Fitment First</h3>
              <p className="text-slate-400 text-sm">
                Every product is verified to fit your specific vehicle. No guesswork required.
              </p>
            </div>
            <div className="bg-night-900/50 rounded-2xl border border-night-800/50 p-6 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-lime-500/10 mb-4">
                <Heart className="h-6 w-6 text-lime-500" />
              </div>
              <h3 className="font-semibold text-white mb-2">Quality Obsessed</h3>
              <p className="text-slate-400 text-sm">
                We partner only with trusted brands that meet our high standards.
              </p>
            </div>
            <div className="bg-night-900/50 rounded-2xl border border-night-800/50 p-6 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-lime-500/10 mb-4">
                <Users className="h-6 w-6 text-lime-500" />
              </div>
              <h3 className="font-semibold text-white mb-2">Community Driven</h3>
              <p className="text-slate-400 text-sm">
                Built by enthusiasts, for enthusiasts. We're here to help you build your dream ride.
              </p>
            </div>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Why Choose ModLift?</h2>
            <ul className="space-y-4 text-slate-400">
              <li className="flex items-start gap-3">
                <span className="text-lime-500 font-bold">01.</span>
                <div>
                  <strong className="text-white">Curated Selection</strong> — We don't carry everything,
                  just the best. Every product is handpicked for quality and value.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-lime-500 font-bold">02.</span>
                <div>
                  <strong className="text-white">Guaranteed Fitment</strong> — Our intelligent fitment
                  system ensures every part works with your vehicle.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-lime-500 font-bold">03.</span>
                <div>
                  <strong className="text-white">Expert Support</strong> — Real truck people who can
                  answer your questions and help plan your build.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-lime-500 font-bold">04.</span>
                <div>
                  <strong className="text-white">Fast Shipping</strong> — Most orders ship within
                  1-2 business days, with free shipping over $99.
                </div>
              </li>
            </ul>
          </section>

          <section className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Get in Touch</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              Have questions, feedback, or just want to talk trucks? We'd love to hear from you.
            </p>
            <div className="space-y-4">
              <a
                href="mailto:support@modlift.us"
                className="flex items-center gap-3 text-slate-400 hover:text-lime-400 transition-colors"
              >
                <Mail className="h-5 w-5 text-lime-500" />
                support@modlift.us
              </a>
              <div className="flex items-center gap-3 text-slate-400">
                <MapPin className="h-5 w-5 text-lime-500" />
                College Station, TX
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
