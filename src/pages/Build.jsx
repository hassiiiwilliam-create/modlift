import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import ModuleCard from '../components/ModuleCard'
import GalleryPreview from '../components/GalleryPreview'
import { supabase } from '../supabaseClient'
import AIChatSidebar from '../components/AIChatSidebar'
import VehicleSelectorCombobox from '@/components/filters/VehicleSelectorCombobox.jsx'
import { ProductFiltersProvider } from '@/hooks/useProductFilters.jsx'
import { useDebouncedValue } from '@/hooks/useDebouncedValue.js'

export default function Build() {
  const [vehicle, setVehicle] = useState(null)
  const [wheel, setWheel] = useState('')
  const [tire, setTire] = useState('')
  const [saved, setSaved] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  const navigate = useNavigate()
  const debouncedSearch = useDebouncedValue(searchInput, 350)

  useEffect(() => {
    if (!debouncedSearch) return
    const trimmed = debouncedSearch.trim()
    if (!trimmed) return
    navigate(`/shop?search=${encodeURIComponent(trimmed)}`)
  }, [debouncedSearch, navigate])

  const handleVehicleComplete = (selection) => {
    setVehicle(selection)
    setSaved(false)
  }

  const userId = 'anonymous'

  const handleSaveBuild = async () => {
    if (!vehicle) return
    const { error } = await supabase.from('builds').insert([
      {
        user_id: userId,
        vehicle_year: vehicle.year,
        vehicle_make: vehicle.make,
        vehicle_model: vehicle.model,
        vehicle_submodel: vehicle.trim ?? '',
        drivetrain: vehicle.drivetrain ?? '',
        wheel,
        tire,
        build_name: `${vehicle.year ?? ''} ${vehicle.make ?? ''} ${vehicle.model ?? ''}`.trim(),
      },
    ])
    if (!error) setSaved(true)
  }

  return (
    <div className="flex min-h-screen bg-white text-black transition dark:bg-black dark:text-white">
      <AIChatSidebar />
      <div className="flex-1">
        <Hero
          title="Build Your Ride"
          subtitle="Choose your setup. Customize your ride. Save your dream build."
        />

        <div className="mx-auto max-w-5xl px-4">
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Vehicle fitment
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Lock in your exact vehicle to see only perfect-fit components.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search by SKU, size, or brand"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white sm:w-72"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <ProductFiltersProvider>
            <div className="mt-6 rounded-2xl bg-white/70 p-4 shadow-inner shadow-black/5 ring-1 ring-black/10 backdrop-blur dark:bg-neutral-900/70 dark:ring-neutral-800">
              <VehicleSelectorCombobox
                includeDrivetrain
                onCompleteSelection={handleVehicleComplete}
              />
            </div>
          </ProductFiltersProvider>

          {vehicle && (
            <>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <ModuleCard
                  title="Wheel Style"
                  options={['Black Mamba', 'Chrome Vortex', 'Bronze Beast']}
                  selected={wheel}
                  onSelect={(option) => {
                    setWheel(option)
                    setSaved(false)
                  }}
                />
                <ModuleCard
                  title="Tire Size"
                  options={['33” All Terrain', '35” Mud Terrain', '37” Street Sport']}
                  selected={tire}
                  onSelect={(option) => {
                    setTire(option)
                    setSaved(false)
                  }}
                />
                <ModuleCard
                  title="Install Kit"
                  options={['Bolt-On Kit', 'Extended Lug Nuts', 'No Install Kit']}
                  selected={null}
                  onSelect={() => {}}
                />
              </div>

              <GalleryPreview vehicle={vehicle} wheel={wheel} tire={tire} />

              <div className="mt-10 text-center">
                <button
                  onClick={handleSaveBuild}
                  className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white shadow transition hover:scale-105 dark:bg-white dark:text-black"
                >
                  {saved ? '✅ Build Saved!' : '💾 Save Build'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
