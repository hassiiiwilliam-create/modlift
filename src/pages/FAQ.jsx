import { useState } from 'react'
import { HelpCircle, ChevronDown, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    category: 'Orders & Shipping',
    questions: [
      {
        q: 'How long does shipping take?',
        a: 'Standard shipping takes 5-7 business days. Expedited shipping (2-3 days) is available at checkout. Most orders ship within 1-2 business days of being placed.'
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes! We offer free standard shipping on all orders over $99 within the continental US.'
      },
      {
        q: 'How do I track my order?',
        a: 'Once your order ships, you\'ll receive an email with tracking information. You can also view your order status by logging into your account.'
      },
      {
        q: 'Can I change or cancel my order?',
        a: 'Orders can be modified or cancelled within 1 hour of placement. After that, please contact us and we\'ll do our best to accommodate your request.'
      }
    ]
  },
  {
    category: 'Fitment & Compatibility',
    questions: [
      {
        q: 'How do I know if a part fits my vehicle?',
        a: 'Use our vehicle selector to add your truck to your garage. Products will show a "Fits Your Vehicle" badge when compatible. You can also check the fitment details on each product page.'
      },
      {
        q: 'What if I order the wrong part?',
        a: 'No worries! Unused parts in original packaging can be returned within 30 days for a full refund or exchange. See our returns policy for details.'
      },
      {
        q: 'Do you offer fitment guarantee?',
        a: 'Yes! If you use our fitment tool and receive a part that doesn\'t fit your vehicle, we\'ll cover return shipping and send the correct part at no additional cost.'
      }
    ]
  },
  {
    category: 'Returns & Warranty',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns within 30 days of delivery for unused items in original packaging. Installed or used items are not eligible for return, but may be covered under warranty.'
      },
      {
        q: 'How do I start a return?',
        a: 'Log into your account, go to your order history, and click "Request Return" on the order you want to return. Follow the prompts to print your shipping label.'
      },
      {
        q: 'What warranties do you offer?',
        a: 'All products include manufacturer warranties. Coverage varies by product — lift kits typically have lifetime structural warranties, while wheels and tires vary by brand.'
      }
    ]
  },
  {
    category: 'Payment & Financing',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards (Visa, Mastercard, Amex, Discover), PayPal, and financing options like Shop Pay and Klarna.'
      },
      {
        q: 'Do you offer financing?',
        a: 'Yes! We offer 0% APR financing for 6-12 months on qualifying orders over $500. Pay-in-4 options are also available for smaller purchases.'
      },
      {
        q: 'Is my payment information secure?',
        a: 'Absolutely. All transactions are encrypted and processed through PCI-compliant payment processors. We never store your full credit card information.'
      }
    ]
  }
]

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-night-800/50 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="font-medium text-white pr-4">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="h-5 w-5 text-slate-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-slate-400 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  return (
    <div className="min-h-screen bg-night-950 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-lime-500/10 mb-6">
            <HelpCircle className="h-8 w-8 text-lime-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Find answers to common questions about orders, fitment, returns, and more
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqs.map((section) => (
            <div
              key={section.category}
              className="bg-night-900/50 rounded-2xl border border-night-800/50 p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4">{section.category}</h2>
              <div>
                {section.questions.map((item, index) => (
                  <FAQItem key={index} question={item.q} answer={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-12 text-center bg-night-900/50 rounded-2xl border border-night-800/50 p-8">
          <h2 className="text-xl font-semibold text-white mb-4">Still have questions?</h2>
          <p className="text-slate-400 mb-6">
            Our support team is here to help with any questions not covered above.
          </p>
          <a
            href="mailto:support@modlift.us"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-lime-500 text-night-950 font-bold transition-all hover:bg-lime-400 hover:shadow-lg hover:shadow-lime-500/30"
          >
            <Mail className="h-4 w-4" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}
