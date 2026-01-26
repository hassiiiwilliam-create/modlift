import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, Search, Loader2 } from 'lucide-react'
import clsx from 'clsx'

export default function VehicleSelect({
  label,
  value,
  options = [],
  onChange,
  placeholder = 'Select...',
  disabled = false,
  loading = false,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [dropdownStyle, setDropdownStyle] = useState({})
  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)

  // Update dropdown position when open
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      })
    }
  }, [isOpen])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on scroll (only when scrolling outside the dropdown)
  useEffect(() => {
    const handleScroll = (e) => {
      if (isOpen) {
        // Don't close if scrolling within the dropdown
        if (dropdownRef.current && dropdownRef.current.contains(e.target)) {
          return
        }
        setIsOpen(false)
        setSearch('')
      }
    }
    window.addEventListener('scroll', handleScroll, true)
    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [isOpen])

  // Focus search when opened (with preventScroll to avoid page jumping)
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus({ preventScroll: true })
    }
  }, [isOpen])

  // Normalize options
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { value: String(opt), label: String(opt) }
    }
    return {
      value: opt.value || opt.slug || opt.name || '',
      label: opt.label || opt.name || opt.value || '',
    }
  })

  // Filter options
  const filteredOptions = search
    ? normalizedOptions.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      )
    : normalizedOptions

  // Get display value
  const selectedOption = normalizedOptions.find((opt) => opt.value === value)
  const displayValue = selectedOption?.label || ''

  const handleSelect = (optValue) => {
    onChange?.(optValue)
    setIsOpen(false)
    setSearch('')
  }

  const toggleOpen = (e) => {
    if (!disabled && !loading) {
      // Prevent any default scroll behavior
      e.preventDefault()
      setIsOpen(!isOpen)
      if (!isOpen) setSearch('')
    }
  }

  const dropdown = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          style={dropdownStyle}
          className={clsx(
            'rounded-xl overflow-hidden',
            'bg-night-900 border border-night-700',
            'shadow-2xl shadow-black/40',
          )}
        >
          {/* Search Input */}
          {normalizedOptions.length > 6 && (
            <div className="p-3 border-b border-night-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className={clsx(
                    'w-full h-10 pl-10 pr-4 rounded-lg',
                    'bg-night-800 border border-night-700',
                    'text-sm text-white placeholder:text-slate-500',
                    'focus:outline-none focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/20',
                  )}
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-night-700 scrollbar-track-transparent">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-8 text-center text-slate-500 text-sm">
                {search ? 'No results found' : 'No options available'}
              </div>
            ) : (
              <div className="py-1">
                {filteredOptions.map((option) => {
                  const isSelected = option.value === value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={clsx(
                        'w-full px-4 py-3 text-left text-sm transition-colors',
                        'flex items-center justify-between gap-2',
                        isSelected
                          ? 'bg-lime-500/10 text-white'
                          : 'text-slate-300 hover:bg-night-800 hover:text-white',
                      )}
                    >
                      <span className={clsx('truncate', isSelected && 'font-semibold')}>
                        {option.label}
                      </span>
                      {isSelected && (
                        <Check className="h-4 w-4 text-lime-500 flex-shrink-0" strokeWidth={3} />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <div ref={containerRef} className="relative">
      {/* Label */}
      {label && (
        <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleOpen}
        disabled={disabled || loading}
        className={clsx(
          'w-full h-12 px-4 rounded-xl text-left transition-all duration-200',
          'flex items-center justify-between gap-2',
          'bg-night-800 border',
          isOpen
            ? 'border-lime-500 ring-2 ring-lime-500/20'
            : 'border-night-700 hover:border-night-600',
          (disabled || loading) && 'opacity-50 cursor-not-allowed',
        )}
      >
        <span
          className={clsx(
            'text-sm font-medium truncate',
            displayValue ? 'text-white' : 'text-slate-500',
          )}
        >
          {loading ? 'Loading...' : displayValue || placeholder}
        </span>

        <div className="flex items-center gap-2">
          {loading && <Loader2 className="h-4 w-4 text-slate-500 animate-spin" />}
          <ChevronDown
            className={clsx(
              'h-5 w-5 text-slate-500 transition-transform duration-200',
              isOpen && 'rotate-180',
            )}
          />
        </div>
      </button>

      {/* Dropdown rendered via portal to escape overflow constraints */}
      {createPortal(dropdown, document.body)}
    </div>
  )
}
