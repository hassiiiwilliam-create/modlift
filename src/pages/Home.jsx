import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Truck,
  CircleDot,
  Disc3,
  Wrench,
  ShieldCheck,
  Zap,
  Star,
  ArrowRight,
  Search,
  Package,
  Users,
  Award,
  ChevronDown,
  Image,
  CheckCircle2,
  X,
  Clock,
  Headphones,
} from 'lucide-react'
import { useVehicle } from '../components/filters/VehicleContext.jsx'
import { fetchYears, fetchMakes, fetchModels } from '../services/wheelsizeService.js'
import { fetchGalleryItems } from '../services/galleryService.js'
import VehicleSelect from '../components/ui/VehicleSelect.jsx'

// Popular makes to show at the top
const POPULAR_MAKES = ['Ford', 'RAM', 'Chevrolet', 'Toyota', 'GMC', 'Jeep', 'Nissan', 'Honda']

// Category cards for quick navigation
const CATEGORIES = [
  {
    id: 'lift_kits',
    title: 'Lift Kits',
    description: 'Level, lift, or go all out',
    icon: Wrench,
  },
  {
    id: 'wheels',
    title: 'Wheels',
    description: 'Premium aftermarket wheels',
    icon: Disc3,
  },
  {
    id: 'tires',
    title: 'Tires',
    description: 'All-terrain to mud-terrain',
    icon: CircleDot,
  },
  {
    id: 'accessories',
    title: 'Accessories',
    description: 'Bumpers, lights, and more',
    icon: Truck,
  },
]

const features = [
  {
    icon: ShieldCheck,
    title: 'Guaranteed Fit',
    description: "If it doesn't fit, we make it right. 100% fitment guarantee.",
  },
  {
    icon: Zap,
    title: 'Fast Shipping',
    description: 'Most orders ship within 24 hours. Free over $500.',
  },
  {
    icon: Wrench,
    title: 'Expert Support',
    description: 'Real enthusiasts ready to help with your build.',
  },
]

const testimonials = [
  {
    name: 'Jake M.',
    vehicle: '2022 Ford F-150',
    quote: 'The fitment was perfect. No more guessing games with wheel offset.',
    rating: 5,
    location: 'Texas',
    verified: true,
  },
  {
    name: 'Sarah K.',
    vehicle: '2021 Toyota Tacoma',
    quote: 'Best build experience ever. Found exactly what I needed in minutes.',
    rating: 5,
    location: 'California',
    verified: true,
  },
  {
    name: 'Mike R.',
    vehicle: '2023 Chevy Silverado',
    quote: 'Fast shipping and the install was straightforward. Highly recommend.',
    rating: 5,
    location: 'Florida',
    verified: true,
  },
  {
    name: 'Brandon T.',
    vehicle: '2020 RAM 1500',
    quote: 'Customer service helped me pick the right lift for my needs. 6" looks perfect.',
    rating: 5,
    location: 'Arizona',
    verified: true,
  },
  {
    name: 'Chris L.',
    vehicle: '2024 GMC Sierra',
    quote: 'Third order from ModLift. Always impressed with quality and speed.',
    rating: 5,
    location: 'Colorado',
    verified: true,
  },
  {
    name: 'Marcus J.',
    vehicle: '2022 Jeep Gladiator',
    quote: 'The 35s fit perfectly with the recommended lift. No rubbing at all.',
    rating: 5,
    location: 'Utah',
    verified: true,
  },
]

// Social proof stats
const stats = [
  { label: 'Trucks Built', value: '12,500+', icon: Truck },
  { label: 'Orders Shipped', value: '45,000+', icon: Package },
  { label: 'Happy Customers', value: '98%', icon: Users },
  { label: 'Years in Business', value: '8+', icon: Award },
]

// FAQ items
const faqs = [
  {
    question: 'How do I know if parts will fit my truck?',
    answer: 'Our vehicle selector automatically filters products to show only compatible parts for your specific year, make, model, and trim. Every listing includes detailed fitment info, and our 100% Fitment Guarantee means if it doesn\'t fit, we make it right.',
  },
  {
    question: 'What\'s included with lift kit installations?',
    answer: 'All our lift kits include complete hardware, detailed instructions, and access to our installation support team. Most kits can be installed in a home garage with basic tools. We also have a network of preferred installers if you want professional help.',
  },
  {
    question: 'How fast do orders ship?',
    answer: 'Most in-stock orders ship within 24 hours. Standard shipping is 3-5 business days, and we offer expedited options. Orders over $500 ship free within the continental US.',
  },
  {
    question: 'Can I return parts if they don\'t work out?',
    answer: 'Yes! We offer 30-day returns on unused parts in original packaging. If a part doesn\'t fit your vehicle as specified, we\'ll cover return shipping and get you the right part.',
  },
]

// Why ModLift comparison
const whyModLift = [
  { feature: 'Vehicle-specific fitment guarantee', modlift: true, others: false },
  { feature: 'Free shipping over $500', modlift: true, others: false },
  { feature: 'Same-day shipping on most orders', modlift: true, others: false },
  { feature: 'Real enthusiast support team', modlift: true, others: false },
  { feature: 'Customer build gallery', modlift: true, others: false },
  { feature: '30-day hassle-free returns', modlift: true, others: true },
]

// FAQ Accordion Item
function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border-b border-night-800/50 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="text-base font-medium text-white pr-4">{question}</span>
        <ChevronDown
          className={`h-5 w-5 text-lime-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
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
            <p className="pb-5 text-sm text-slate-400 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Sort function to put popular makes first
const sortMakesWithPopularFirst = (makes) => {
  return [...makes].sort((a, b) => {
    const aVal = typeof a === 'object' ? a.value || a.name || a : a
    const bVal = typeof b === 'object' ? b.value || b.name || b : b
    const aPopular = POPULAR_MAKES.findIndex((m) => m.toLowerCase() === String(aVal).toLowerCase())
    const bPopular = POPULAR_MAKES.findIndex((m) => m.toLowerCase() === String(bVal).toLowerCase())
    const aIsPopular = aPopular !== -1
    const bIsPopular = bPopular !== -1
    if (aIsPopular && !bIsPopular) return -1
    if (!aIsPopular && bIsPopular) return 1
    if (aIsPopular && bIsPopular) return aPopular - bPopular
    return String(aVal).localeCompare(String(bVal))
  })
}

export default function Home() {
  const navigate = useNavigate()
  const { updateSelection } = useVehicle()

  // Vehicle selector state
  const [years, setYears] = useState([])
  const [makes, setMakes] = useState([])
  const [models, setModels] = useState([])
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMake, setSelectedMake] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [loading, setLoading] = useState({ years: true, makes: false, models: false })

  // Featured builds state
  const [featuredBuilds, setFeaturedBuilds] = useState([])
  const [buildsLoading, setBuildsLoading] = useState(true)

  // Promo banner state
  const [showPromoBanner, setShowPromoBanner] = useState(true)

  // FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState(null)

  // Load featured builds on mount
  useEffect(() => {
    const loadFeaturedBuilds = async () => {
      setBuildsLoading(true)
      try {
        const data = await fetchGalleryItems({ featured_only: true })
        setFeaturedBuilds(data.slice(0, 4))
      } catch (err) {
        console.error('Failed to load featured builds:', err)
      } finally {
        setBuildsLoading(false)
      }
    }
    loadFeaturedBuilds()
  }, [])

  // Load years on mount
  useEffect(() => {
    const loadYears = async () => {
      setLoading((prev) => ({ ...prev, years: true }))
      try {
        const data = await fetchYears()
        // Sort years descending and take recent ones
        const sortedYears = data
          .map((y) => (typeof y === 'object' ? y.slug || y.name : y))
          .sort((a, b) => Number(b) - Number(a))
          .slice(0, 20)
        setYears(sortedYears)
      } catch (err) {
        console.error('Failed to load years:', err)
      } finally {
        setLoading((prev) => ({ ...prev, years: false }))
      }
    }
    loadYears()
  }, [])

  // Load makes when year changes
  useEffect(() => {
    if (!selectedYear) {
      setMakes([])
      setSelectedMake('')
      return
    }

    const loadMakes = async () => {
      setLoading((prev) => ({ ...prev, makes: true }))
      try {
        const data = await fetchMakes(selectedYear)
        const makesList = data.map((m) => (typeof m === 'object' ? m.slug || m.name : m))
        // Sort with popular makes first
        setMakes(sortMakesWithPopularFirst(makesList))
      } catch (err) {
        console.error('Failed to load makes:', err)
      } finally {
        setLoading((prev) => ({ ...prev, makes: false }))
      }
    }
    loadMakes()
  }, [selectedYear])

  // Load models when make changes
  useEffect(() => {
    if (!selectedYear || !selectedMake) {
      setModels([])
      setSelectedModel('')
      return
    }

    const loadModels = async () => {
      setLoading((prev) => ({ ...prev, models: true }))
      try {
        const data = await fetchModels(selectedYear, selectedMake)
        const modelsList = data.map((m) => (typeof m === 'object' ? m.slug || m.name : m))
        setModels(modelsList)
      } catch (err) {
        console.error('Failed to load models:', err)
      } finally {
        setLoading((prev) => ({ ...prev, models: false }))
      }
    }
    loadModels()
  }, [selectedYear, selectedMake])

  // Handle vehicle selection and navigate to shop
  const handleFindParts = async () => {
    if (selectedYear && selectedMake && selectedModel) {
      await updateSelection({
        year: selectedYear,
        make: selectedMake,
        model: selectedModel,
        trim: null,
      })
      navigate('/shop')
    }
  }

  // Handle category click
  const handleCategoryClick = (categoryId) => {
    navigate(`/shop?category=${categoryId}`)
  }

  const isFormComplete = selectedYear && selectedMake && selectedModel

  return (
    <div className="min-h-screen bg-night-950">
      {/* Promo Banner */}
      <AnimatePresence>
        {showPromoBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative bg-gradient-to-r from-lime-600 via-lime-500 to-lime-600 text-night-950 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-sm font-medium">
              <Package className="h-4 w-4" />
              <span>
                <span className="font-bold">Free Shipping</span> on orders over $500
                <span className="hidden sm:inline"> — Most orders ship same day</span>
              </span>
              <button
                type="button"
                onClick={() => setShowPromoBanner(false)}
                className="absolute right-4 p-1 rounded hover:bg-lime-600/50 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Vehicle Selector */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-night-950 via-night-900/50 to-night-950" />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-lime-500/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-lime-500/3 rounded-full blur-[120px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-grid-pattern bg-[size:60px_60px] opacity-20" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              Find{' '}
              <span className="text-lime-400">Your Fit</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              Suspension, wheels, tires, and accessories for your truck.
            </p>
          </motion.div>

          {/* Vehicle Selector Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-night-900/90 backdrop-blur-xl border border-night-800 rounded-2xl p-6 shadow-2xl shadow-black/30"
          >
            {/* Selector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <VehicleSelect
                label="Year"
                value={selectedYear}
                options={years}
                onChange={(val) => {
                  setSelectedYear(val)
                  setSelectedMake('')
                  setSelectedModel('')
                }}
                placeholder="Select year"
                loading={loading.years}
              />

              <VehicleSelect
                label="Make"
                value={selectedMake}
                options={makes}
                onChange={(val) => {
                  setSelectedMake(val)
                  setSelectedModel('')
                }}
                placeholder="Select make"
                disabled={!selectedYear}
                loading={loading.makes}
              />

              <VehicleSelect
                label="Model"
                value={selectedModel}
                options={models}
                onChange={setSelectedModel}
                placeholder="Select model"
                disabled={!selectedMake}
                loading={loading.models}
              />

              {/* Search Button */}
              <div className="flex flex-col">
                <span className="block text-xs font-medium text-transparent mb-2 uppercase tracking-wider select-none">
                  Action
                </span>
                <button
                  onClick={handleFindParts}
                  disabled={!isFormComplete}
                  className="h-12 flex items-center justify-center gap-2 rounded-xl bg-lime-500 text-night-950 font-bold transition-all hover:bg-lime-400 hover:shadow-lg hover:shadow-lime-500/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-lime-500 disabled:hover:shadow-none"
                >
                  <Search className="h-5 w-5" />
                  <span>Find Parts</span>
                </button>
              </div>
            </div>

          </motion.div>

          {/* Or Browse All */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-6"
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
            >
              Or browse all products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Shop by Category
            </h2>
            <p className="text-slate-400 text-sm">
              Everything you need to build your dream setup
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {CATEGORIES.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                onClick={() => handleCategoryClick(category.id)}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-night-900 border border-night-800 transition-all duration-300 hover:border-lime-500/40 hover:shadow-xl hover:shadow-lime-500/5"
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-night-950 via-night-900/90 to-night-900/50" />

                {/* Icon */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl bg-lime-500/10 text-lime-400 mb-3 transition-all duration-300 group-hover:bg-lime-500 group-hover:text-night-950 group-hover:scale-110">
                    <category.icon className="h-7 w-7 sm:h-8 sm:w-8" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-0.5">{category.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 text-center">{category.description}</p>
                </div>

                {/* Hover arrow */}
                <div className="absolute bottom-3 right-3 opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  <ArrowRight className="h-5 w-5 text-lime-400" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 border-y border-night-800/50 bg-night-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-lime-500/10 text-lime-400">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-0.5">{feature.title}</h3>
                  <p className="text-sm text-slate-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-night-900/50 border border-night-800/50"
              >
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-lime-500/10 text-lime-400 mb-3">
                  <stat.icon className="h-6 w-6" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Builds */}
      {featuredBuilds.length > 0 && (
        <section className="py-16 sm:py-20 border-t border-night-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Featured Builds
                </h2>
                <p className="text-slate-400 text-sm">
                  See what other builders are running
                </p>
              </div>
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 text-lime-400 hover:text-lime-300 transition-colors text-sm font-medium"
              >
                View all builds
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {featuredBuilds.map((build, index) => (
                <motion.div
                  key={build.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to="/gallery"
                    className="group block relative aspect-[4/3] rounded-2xl overflow-hidden bg-night-900 border border-night-800 transition-all duration-300 hover:border-lime-500/40"
                  >
                    {build.image_url ? (
                      <img
                        src={build.image_url}
                        alt={`${build.vehicle_year} ${build.vehicle_make} ${build.vehicle_model}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-night-800">
                        <Image className="h-10 w-10 text-slate-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-sm font-medium text-white truncate">
                        {build.vehicle_year} {build.vehicle_make} {build.vehicle_model}
                      </p>
                      {build.lift_height && (
                        <p className="text-xs text-lime-400 mt-0.5">
                          {build.lift_height} lift
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-16 sm:py-20 border-t border-night-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              What Builders Say
            </h2>
            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-lime-400 fill-lime-400" />
                ))}
              </div>
              <span>4.9 out of 5 based on 2,400+ reviews</span>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="p-5 rounded-xl bg-night-900/50 border border-night-800/50"
              >
                {/* Stars & Verified */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-0.5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-lime-400 fill-lime-400" />
                    ))}
                  </div>
                  {testimonial.verified && (
                    <span className="flex items-center gap-1 text-xs text-lime-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Quote */}
                <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white text-sm">{testimonial.name}</p>
                    <p className="text-xs text-slate-500">{testimonial.vehicle}</p>
                  </div>
                  <span className="text-xs text-slate-500">{testimonial.location}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why ModLift */}
      <section className="py-16 sm:py-20 border-t border-night-800/50 bg-night-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Why ModLift?
            </h2>
            <p className="text-slate-400 text-sm">
              See how we compare to other aftermarket retailers
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-night-900/80 border border-night-800 overflow-hidden"
          >
            {/* Header */}
            <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-night-800/50 border-b border-night-800">
              <div className="text-sm font-medium text-slate-400">Feature</div>
              <div className="text-center">
                <span className="text-sm font-bold text-lime-400">ModLift</span>
              </div>
              <div className="text-center">
                <span className="text-sm font-medium text-slate-400">Others</span>
              </div>
            </div>

            {/* Rows */}
            {whyModLift.map((row, index) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 gap-4 px-6 py-4 ${
                  index !== whyModLift.length - 1 ? 'border-b border-night-800/50' : ''
                }`}
              >
                <div className="text-sm text-white">{row.feature}</div>
                <div className="flex justify-center">
                  {row.modlift ? (
                    <CheckCircle2 className="h-5 w-5 text-lime-400" />
                  ) : (
                    <X className="h-5 w-5 text-slate-600" />
                  )}
                </div>
                <div className="flex justify-center">
                  {row.others ? (
                    <CheckCircle2 className="h-5 w-5 text-slate-400" />
                  ) : (
                    <X className="h-5 w-5 text-slate-600" />
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 border-t border-night-800/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-sm">
              Got questions? We've got answers.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-night-900/50 border border-night-800/50 px-6"
          >
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaqIndex === index}
                onToggle={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <p className="text-slate-400 text-sm mb-3">Still have questions?</p>
            <a
              href="mailto:support@modlift.com"
              className="inline-flex items-center gap-2 text-lime-400 hover:text-lime-300 transition-colors text-sm font-medium"
            >
              <Headphones className="h-4 w-4" />
              Contact our support team
            </a>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 border-t border-night-800/50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to upgrade your ride?
            </h2>
            <p className="text-slate-400 mb-6">
              Join thousands of builders who trust ModLift for their truck and SUV builds.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-lime-500 text-night-950 font-bold transition-all hover:bg-lime-400 hover:shadow-xl hover:shadow-lime-500/25"
            >
              Start Shopping
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
