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
    <div className="flex min-h-screen bg-night-950">
      <AIChatSidebar />
      <div className="flex-1">
        <Hero
          title="Build Your Ride"
          subtitle="Choose your setup. Customize your ride. Save your dream build."
        />

        <div className="mx-auto max-w-5xl px-4">
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Vehicle fitment
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Lock in your exact vehicle to see only perfect-fit components.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search by SKU, size, or brand"
                className="w-full rounded-xl border border-night-800 bg-night-900 px-4 py-2.5 text-sm text-white placeholder-slate-500 shadow-sm outline-none transition focus:border-lime-500/50 focus:ring-2 focus:ring-lime-500/20 sm:w-72"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:text-lime-400 hover:bg-night-900"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <ProductFiltersProvider>
            <div className="mt-6 rounded-2xl bg-night-900/50 p-4 border border-night-800/50 backdrop-blur">
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
                  className="rounded-xl bg-lime-500 px-6 py-3 text-sm font-semibold text-night-950 shadow-lg shadow-lime-500/25 transition hover:bg-lime-400 hover:scale-105"
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
