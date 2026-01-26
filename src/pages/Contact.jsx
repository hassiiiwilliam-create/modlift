import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, MapPin, Clock, Send, MessageCircle, Headphones, ArrowRight, Zap } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { AppContext } from '../App'

export default function Contact() {
  const { user } = useContext(AppContext)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))

    toast.success('Message sent! We\'ll get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
    setSubmitting(false)
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-night-950 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-lime-500/10 mb-6">
            <MessageCircle className="h-8 w-8 text-lime-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Have a question about fitment, your order, or just want to talk trucks? Choose how you'd like to reach us.
          </p>
        </motion.div>

        {/* Contact Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 gap-6 mb-12"
        >
          {/* Live Chat Card */}
          <Link
            to="/support"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-lime-500/20 to-lime-600/10 border border-lime-500/30 p-8 hover:border-lime-500/50 transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-500 shadow-lg shadow-lime-500/30">
                  <Headphones className="h-7 w-7 text-night-950" />
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <Zap className="h-4 w-4 text-lime-400" />
                  <span className="text-xs font-medium text-lime-400 uppercase tracking-wide">Fastest Response</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-lime-400 transition-colors">
                Live Support Chat
              </h3>
              <p className="text-slate-400 mb-6">
                Chat directly with our team in real-time. Get instant answers to your questions about orders, fitment, or products.
              </p>
              <div className="flex items-center gap-2 text-lime-400 font-semibold">
                {user ? 'Start Chatting' : 'Sign in to Chat'}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
              {!user && (
                <p className="text-xs text-slate-500 mt-2">
                  Sign in required to access live chat
                </p>
              )}
            </div>
          </Link>

          {/* Email Card */}
          <div className="rounded-2xl bg-night-900/50 border border-night-800/50 p-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-night-800 border border-night-700/50">
                <Mail className="h-7 w-7 text-slate-400" />
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <Clock className="h-4 w-4 text-slate-500" />
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">24hr Response</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Send an Email
            </h3>
            <p className="text-slate-400 mb-6">
              Prefer email? Send us a detailed message and we'll get back to you within 24 hours. Great for complex questions.
            </p>
            <a
              href="mailto:support@modlift.us"
              className="inline-flex items-center gap-2 text-white font-semibold hover:text-lime-400 transition-colors"
            >
              support@modlift.us
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </motion.div>

        {/* Contact Info Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid sm:grid-cols-3 gap-4 mb-12"
        >
          <div className="flex items-center gap-3 p-4 rounded-xl bg-night-900/30 border border-night-800/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime-500/10">
              <Mail className="h-5 w-5 text-lime-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Email</p>
              <p className="text-sm text-white font-medium">support@modlift.us</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-night-900/30 border border-night-800/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime-500/10">
              <MapPin className="h-5 w-5 text-lime-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Location</p>
              <p className="text-sm text-white font-medium">College Station, TX</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-night-900/30 border border-night-800/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime-500/10">
              <Clock className="h-5 w-5 text-lime-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Hours</p>
              <p className="text-sm text-white font-medium">Mon-Fri, 9am-6pm CT</p>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-night-800">
                <Send className="h-5 w-5 text-slate-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Send us a message</h2>
                <p className="text-sm text-slate-500">We'll respond within 24 hours</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-night-800/50 border border-night-700/50 text-white placeholder:text-slate-500 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 focus:outline-none transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-night-800/50 border border-night-700/50 text-white placeholder:text-slate-500 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 focus:outline-none transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="subject" className="block text-sm font-medium text-slate-400 mb-2">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-night-800/50 border border-night-700/50 text-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 focus:outline-none transition-all"
              >
                <option value="">Select a topic</option>
                <option value="fitment">Fitment Question</option>
                <option value="order">Order Status</option>
                <option value="return">Returns & Refunds</option>
                <option value="warranty">Warranty Claim</option>
                <option value="product">Product Question</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-slate-400 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-night-800/50 border border-night-700/50 text-white placeholder:text-slate-500 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 focus:outline-none transition-all resize-none"
                placeholder="How can we help?"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-lime-500 text-night-950 font-bold transition-all hover:bg-lime-400 hover:shadow-lg hover:shadow-lime-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-night-950/30 border-t-night-950 rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
