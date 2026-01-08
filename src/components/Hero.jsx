import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wrench, Zap, Shield, ArrowRight, Play } from 'lucide-react'

const stats = [
  { value: '10K+', label: 'Parts in Stock' },
  { value: '500+', label: 'Vehicle Fits' },
  { value: '99%', label: 'Satisfaction' },
]

const features = [
  { icon: Wrench, label: 'Custom Builds' },
  { icon: Zap, label: 'Fast Shipping' },
  { icon: Shield, label: 'Guaranteed Fit' },
]

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0">
        {/* Main Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-steel-950 via-steel-950/95 to-steel-950/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-steel-950 via-transparent to-steel-950/50" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(249, 115, 22, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(249, 115, 22, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Accent Glow */}
        <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-flame-500/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 -left-1/4 w-[400px] h-[400px] bg-volt-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-flame-500/10 border border-flame-500/30 text-flame-400 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-flame-500 animate-pulse" />
                Premium Performance Parts
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight">
                <span className="text-white">Engineered to</span>
                <br />
                <span className="text-gradient">Dominate.</span>
              </h1>
              <p className="text-xl text-steel-400 max-w-lg leading-relaxed">
                Custom wheels, lift kits, and performance parts with
                <span className="text-white font-medium"> guaranteed fitment</span>.
                No guesswork. Just pure performance.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/build"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-flame-500 to-flame-600 text-white font-semibold shadow-xl shadow-flame-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-flame-500/40 hover:scale-[1.02]"
              >
                <Wrench className="h-5 w-5" />
                Build Your Setup
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-steel-800/80 backdrop-blur-sm border border-steel-700/50 text-white font-semibold transition-all duration-300 hover:bg-steel-700/80 hover:border-steel-600"
              >
                Browse Catalog
              </Link>
            </motion.div>

            {/* Features Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-6 pt-4"
            >
              {features.map((feature, index) => (
                <div
                  key={feature.label}
                  className="flex items-center gap-3 text-steel-400"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-steel-800/50 border border-steel-700/50">
                    <feature.icon className="h-5 w-5 text-flame-500" />
                  </div>
                  <span className="font-medium">{feature.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Stats & Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Stats Cards */}
            <div className="absolute -left-8 top-1/4 z-20">
              <div className="bg-steel-900/90 backdrop-blur-xl border border-steel-800/50 rounded-2xl p-6 shadow-2xl">
                <div className="space-y-4">
                  {stats.map((stat, index) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-3xl font-bold text-gradient">{stat.value}</div>
                      <div className="text-xs text-steel-500 uppercase tracking-wider">{stat.label}</div>
                      {index < stats.length - 1 && (
                        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-steel-700 to-transparent" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Featured Vehicle Image Area */}
            <div className="relative ml-16">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-steel-800/50 to-steel-900/50 border border-steel-800/50 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0 bg-carbon-fiber opacity-50" />
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-flame-500 via-flame-400 to-volt-500" />

                {/* Inner Content */}
                <div className="absolute inset-8 rounded-2xl border border-steel-700/30 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-flame-500/10 border border-flame-500/30 flex items-center justify-center">
                      <Play className="h-8 w-8 text-flame-500 ml-1" />
                    </div>
                    <p className="text-steel-500 text-sm">View Featured Builds</p>
                  </div>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-flame-500/50 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-flame-500/50 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-flame-500/50 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-flame-500/50 rounded-br-lg" />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 bg-volt-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-volt-500/30">
                NEW ARRIVALS
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-steel-950 to-transparent" />

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-steel-500">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border-2 border-steel-700 flex items-start justify-center p-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-flame-500" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
