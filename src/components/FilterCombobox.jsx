import { Fragment, useMemo, useState, useRef, useEffect } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { Check, ChevronDown, Search, Loader2, X } from 'lucide-react'
import clsx from 'clsx'

const normalizeOption = (option) => {
  if (
    typeof option === 'string' ||
    typeof option === 'number' ||
    typeof option === 'boolean'
  ) {
    const value = String(option)
    return { value, label: value }
  }

  if (!option) return null

  const value =
    option.value ??
    option.slug ??
    option.id ??
    option.code ??
    option.key ??
    option.name ??
    option.label ??
    ''

  const label =
    option.label ??
    option.name ??
    option.title ??
    option.displayName ??
    option.text ??
    option.value ??
    option.slug ??
    ''

  const resolvedValue = String(value ?? '')
  const resolvedLabel = String(label || resolvedValue)

  if (!resolvedValue && !resolvedLabel) return null

  return {
    value: resolvedValue,
    label: resolvedLabel,
    isDefault: option.isDefault || false,
  }
}

const defaultFilter = (option, q) =>
  option.label.toLowerCase().includes(q.toLowerCase())

const toArray = (value) => {
  if (Array.isArray(value)) return value
  if (value === undefined || value === null || value === '') return []
  return [value]
}

export default function FilterCombobox({
  label,
  options = [],
  value,
  selected,
  onChange,
  placeholder,
  disabled = false,
  isLoading = false,
  loading = false,
  required = false,
  isMulti = false,
  filterFn = defaultFilter,
  className,
}) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef(null)

  const pending = loading || isLoading
  const selectionProp = value !== undefined ? value : selected
  const normalizedSelection = isMulti ? toArray(selectionProp) : selectionProp ?? ''

  const normalizedOptions = useMemo(
    () =>
      options
        .map(normalizeOption)
        .filter(
          (item, index, self) =>
            item &&
            item.value &&
            self.findIndex((candidate) => candidate?.value === item.value) === index,
        ),
    [options],
  )

  const optionMap = useMemo(() => {
    const map = new Map()
    normalizedOptions.forEach((option) => {
      if (option?.value && !map.has(option.value)) {
        map.set(option.value, option)
      }
    })
    return map
  }, [normalizedOptions])

  const filteredOptions =
    query.trim() === ''
      ? normalizedOptions
      : normalizedOptions.filter((item) => filterFn(item, query))

  const resolvedPlaceholder =
    placeholder || (label ? `Select ${label.toLowerCase()}` : 'Select...')

  const handleChange = (next) => {
    if (!onChange) return
    if (isMulti) {
      const values = Array.isArray(next) ? next : toArray(next)
      onChange(values)
    } else {
      onChange(next ?? '')
    }
    setQuery('')
  }

  const displayValue = (inputValue) => {
    if (isMulti) {
      const values = Array.isArray(inputValue) ? inputValue : []
      if (values.length === 0) return ''
      return values
        .map((val) => optionMap.get(val)?.label ?? val ?? '')
        .filter(Boolean)
        .join(', ')
    }
    return optionMap.get(inputValue)?.label ?? inputValue ?? ''
  }

  const hasValue = isMulti
    ? Array.isArray(normalizedSelection) && normalizedSelection.length > 0
    : Boolean(normalizedSelection)

  const clearValue = (e) => {
    e.stopPropagation()
    if (onChange) {
      onChange(isMulti ? [] : '')
    }
  }

  return (
    <div className={clsx('w-full', className)}>
      <Combobox
        value={normalizedSelection}
        onChange={handleChange}
        disabled={disabled || pending}
        multiple={isMulti}
      >
        {({ open }) => (
          <>
            {label && (
              <Combobox.Label className="mb-2 flex items-center gap-1 text-xs font-medium text-slate-400 uppercase tracking-wider">
                <span>{label}</span>
                {required && <span className="text-coral-500">*</span>}
              </Combobox.Label>
            )}
            <div className="relative">
              <div
                className={clsx(
                  'relative w-full cursor-pointer rounded-lg border transition-all duration-200',
                  'bg-night-800/50 backdrop-blur-sm',
                  open
                    ? 'border-lime-500/50 ring-2 ring-lime-500/20'
                    : 'border-night-700/50 hover:border-night-600',
                  (disabled || pending) && 'cursor-not-allowed opacity-50',
                )}
              >
                <Combobox.Input
                  ref={inputRef}
                  className={clsx(
                    'w-full bg-transparent py-2.5 pl-3 pr-20 text-sm text-white',
                    'placeholder:text-slate-500 focus:outline-none',
                    'disabled:cursor-not-allowed',
                  )}
                  displayValue={displayValue}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={pending ? 'Loading...' : resolvedPlaceholder}
                  disabled={disabled || pending}
                />

                <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
                  {pending && (
                    <Loader2 className="h-4 w-4 text-slate-500 animate-spin" />
                  )}

                  {hasValue && !pending && !disabled && (
                    <button
                      type="button"
                      onClick={clearValue}
                      className="p-1 rounded hover:bg-night-700 text-slate-500 hover:text-white transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}

                  <Combobox.Button className="p-1 text-slate-500 hover:text-white transition-colors">
                    <ChevronDown
                      className={clsx(
                        'h-4 w-4 transition-transform duration-200',
                        open && 'rotate-180',
                      )}
                    />
                  </Combobox.Button>
                </div>
              </div>

              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
                afterLeave={() => setQuery('')}
              >
                <Combobox.Options
                  className={clsx(
                    'absolute z-50 mt-2 w-full rounded-xl',
                    'bg-night-900 border border-night-700/50',
                    'shadow-xl shadow-black/30',
                    'focus:outline-none',
                    'max-h-64 overflow-y-auto overscroll-contain',
                  )}
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                  {/* Search indicator in dropdown */}
                  {normalizedOptions.length > 5 && (
                    <div className="px-3 py-2 border-b border-night-800/50 sticky top-0 bg-night-900 z-10">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Search className="h-3.5 w-3.5" />
                        <span>Type to search...</span>
                      </div>
                    </div>
                  )}

                  <div className="py-1">
                    {pending ? (
                      <div className="flex items-center justify-center gap-2 px-4 py-8 text-slate-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading options...</span>
                      </div>
                    ) : filteredOptions.length === 0 ? (
                      <div className="px-4 py-8 text-center text-slate-500">
                        {query ? (
                          <>
                            <p className="font-medium">No results found</p>
                            <p className="text-xs mt-1">Try a different search term</p>
                          </>
                        ) : (
                          <p>No options available</p>
                        )}
                      </div>
                    ) : (
                      filteredOptions.map((option) => (
                        <Combobox.Option
                          key={option.value}
                          value={option.value}
                          className={({ active, selected }) =>
                            clsx(
                              'relative cursor-pointer select-none py-2.5 pl-10 pr-4 transition-colors',
                              active ? 'bg-lime-500/10 text-white' : 'text-slate-300',
                              selected && 'bg-lime-500/5',
                            )
                          }
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={clsx(
                                  'block truncate',
                                  selected ? 'font-semibold text-white' : 'font-normal',
                                )}
                              >
                                {option.label}
                              </span>

                              {option.isDefault && !selected && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-lime-500/70 uppercase tracking-wider">
                                  Default
                                </span>
                              )}

                              {(selected ||
                                (isMulti &&
                                  toArray(normalizedSelection).includes(option.value))) && (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-lime-500">
                                  <Check className="h-4 w-4" strokeWidth={3} />
                                </span>
                              )}
                            </>
                          )}
                        </Combobox.Option>
                      ))
                    )}
                  </div>
                </Combobox.Options>
              </Transition>
            </div>
          </>
        )}
      </Combobox>
    </div>
  )
}
