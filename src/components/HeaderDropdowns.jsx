import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon, MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/solid'
import { Link } from 'react-router-dom'

const searchLinks = [
  { label: 'Top Selling Wheels', to: '/shop?tag=Best%20Seller' },
  { label: 'Lift Kits by Vehicle', to: '/shop?category=Suspension' },
  { label: 'Shop Combos', to: '/shop?combo=true' },
  { label: 'Browse by Brand', to: '/brands' },
  { label: 'Featured Builds', to: '/builds?featured=true' },
  { label: 'Merch & Apparel', to: '/merch' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Deals of the Week', to: '/shop?tag=Discounted' },
  { label: 'Wheel Size Guide', to: '/guides/size' },
  { label: 'Install Support', to: '/support/install' },
  { label: 'Gift Cards', to: '/gift-cards' },
  { label: 'Clear Filters', to: '/shop?clear=true' },
]

const accountLinks = [
  { label: 'Orders', to: '/account/orders' },
  { label: 'Your Saves', to: '/account/saved' },
  { label: 'Account', to: '/account' },
  { label: 'Sign In', to: '/login' },
]

function Dropdown({ icon: Icon, label, links }) {
  return (
    <Popover className="relative">
      <Popover.Button className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-gray-900 transition hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
        <Icon className="h-5 w-5" />
        <span>{label}</span>
        <ChevronDownIcon className="h-4 w-4" />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute right-0 z-30 mt-2 w-72 overflow-hidden rounded-2xl bg-white/95 shadow-xl ring-1 ring-black/10 backdrop-blur dark:bg-neutral-900/95 dark:ring-white/10">
          <div className="p-3">
            <ul className="space-y-1">
              {links.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="block rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-white/10 dark:hover:text-blue-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}

export default function HeaderDropdowns() {
  return (
    <div className="hidden items-center gap-3 md:flex">
      <Dropdown icon={MagnifyingGlassIcon} label="Search" links={searchLinks} />
      <Dropdown icon={UserIcon} label="Account" links={accountLinks} />
    </div>
  )
}
