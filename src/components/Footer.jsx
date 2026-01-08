import { Link } from 'react-router-dom'
import {
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
} from 'lucide-react'
import ModLiftLogo from './ModLiftLogo'

const footerLinks = {
  shop: [
    { label: 'All Products', href: '/shop' },
    { label: 'Lift Kits', href: '/shop?category=lift_kits' },
    { label: 'Wheels', href: '/shop?category=wheels' },
    { label: 'Tires', href: '/shop?category=tires' },
    { label: 'Accessories', href: '/shop?category=accessories' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Our Story', href: '/about#story' },
  ],
  support: [
    { label: 'Shipping Policy', href: '/shipping' },
    { label: 'Returns & Refunds', href: '/returns' },
    { label: 'Warranty', href: '/warranty' },
    { label: 'Financing', href: '/financing' },
    { label: 'FAQ', href: '/faq' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
}

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/modlift', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com/modlift', label: 'Facebook' },
  { icon: Youtube, href: 'https://youtube.com/modlift', label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-night-800/50 bg-night-950">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime-500/50 to-transparent" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="col-span-2 space-y-6">
            <Link to="/" className="inline-block">
              <ModLiftLogo size="default" />
            </Link>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              Premium parts for trucks and SUVs. Lift kits, wheels, tires, and accessories — all guaranteed to fit.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:support@modlift.us"
                className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 text-lime-500" />
                support@modlift.us
              </a>
              <div className="flex items-center gap-3 text-slate-400">
                <MapPin className="h-4 w-4 text-lime-500" />
                College Station, TX
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-night-800/50 text-slate-400 border border-night-700/50 transition-all hover:bg-lime-500/10 hover:text-lime-400 hover:border-lime-500/30"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white">
              Shop
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-night-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-1">Stay in the loop</h4>
              <p className="text-slate-400 text-sm">Get updates on new products and exclusive deals.</p>
            </div>
            <form className="flex w-full md:w-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-4 py-3 rounded-lg bg-night-800/50 border border-night-700/50 text-white placeholder:text-slate-500 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-lime-500 text-night-950 font-bold transition-all hover:bg-lime-400 hover:shadow-lg hover:shadow-lime-500/30"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-night-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} ModLift. All rights reserved.
            </p>

            {/* Legal Links */}
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link to="/returns" className="hover:text-white transition-colors">
                Returns
              </Link>
              <Link to="/shipping" className="hover:text-white transition-colors">
                Shipping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
