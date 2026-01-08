import { useEffect, useState } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import { FunnelIcon } from '@heroicons/react/24/outline'
import SidebarFilters from './SidebarFilters.jsx'

export default function MobileTopbar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (typeof window === 'undefined' || !open) return undefined
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open])

  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur lg:hidden">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Filters</h2>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-md"
          aria-label="Open Filters"
        >
          <FunnelIcon className="h-4 w-4" />
          Filter
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <Motion.div
              role="button"
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <Motion.div
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-transparent p-4 pb-6"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            >
              <SidebarFilters isMobile onClose={() => setOpen(false)} />
            </Motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
