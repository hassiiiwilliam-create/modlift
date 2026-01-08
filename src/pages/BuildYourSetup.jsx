import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { vehiclesTable } from '../utils/tables'
import ModuleCard from '../components/ModuleCard'
import GalleryPreview from '../components/GalleryPreview'
import { saveBuild } from '../utils/saveBuild'

export default function BuildYourSetup() {
  const [form, setForm] = useState({
    year: '',
    make: '',
    model: '',
    submodel: '',
    drivetrain: '',
  })
  const [dropdowns, setDropdowns] = useState({ years: [], makes: [], models: [], submodels: [], drivetrains: [] })
  const [selectedParts, setSelectedParts] = useState({
    lift_kit_id: null,
    wheel_id: null,
    tire_id: null,
  })
  const navigate = useNavigate()
  const [loadingSave, setLoadingSave] = useState(false)

  useEffect(() => {
    let active = true

    const loadYears = async () => {
      try {
        const { data, error } = await supabase
          .from(vehiclesTable)
          .select('year')
          .order('year', { ascending: false })

        if (error) throw error
        const uniqueYears = [...new Set((data ?? []).map((entry) => entry.year).filter(Boolean))]
        if (active) {
          setDropdowns((prev) => ({ ...prev, years: uniqueYears }))
        }
      } catch (err) {
        console.error('Supabase vehicle years error:', err.message)
        if (active) {
          setDropdowns((prev) => ({ ...prev, years: [] }))
        }
      }
    }

    loadYears()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true

    const uniqueValues = (rows, key) =>
      [...new Set((rows ?? []).map((entry) => entry?.[key]).filter(Boolean))]

    const fetchOptions = async () => {
      if (!form.year) {
        if (active) {
          setDropdowns((prev) => ({
            ...prev,
            makes: [],
            models: [],
            submodels: [],
            drivetrains: [],
          }))
        }
        return
      }

      try {
        const { data: makesData, error: makesError } = await supabase
          .from(vehiclesTable)
          .select('make')
          .eq('year', form.year)

        if (makesError) throw makesError
        if (active) {
          setDropdowns((prev) => ({
            ...prev,
            makes: uniqueValues(makesData, 'make'),
          }))
        }
      } catch (err) {
        console.error('Supabase vehicle makes error:', err.message)
        if (active) {
          setDropdowns((prev) => ({ ...prev, makes: [] }))
        }
      }

      if (!form.make) {
        if (active) {
          setDropdowns((prev) => ({
            ...prev,
            models: [],
            submodels: [],
            drivetrains: [],
          }))
        }
        return
      }

      try {
        const { data: modelsData, error: modelsError } = await supabase
          .from(vehiclesTable)
          .select('model')
          .eq('year', form.year)
          .eq('make', form.make)

        if (modelsError) throw modelsError
        if (active) {
          setDropdowns((prev) => ({
            ...prev,
            models: uniqueValues(modelsData, 'model'),
          }))
        }
      } catch (err) {
        console.error('Supabase vehicle models error:', err.message)
        if (active) {
          setDropdowns((prev) => ({ ...prev, models: [] }))
        }
      }

      if (!form.model) {
        if (active) {
          setDropdowns((prev) => ({
            ...prev,
            submodels: [],
            drivetrains: [],
          }))
        }
        return
      }

      try {
        const { data: submodelsData, error: submodelsError } = await supabase
          .from(vehiclesTable)
          .select('submodel')
          .eq('year', form.year)
          .eq('make', form.make)
          .eq('model', form.model)

        if (submodelsError) throw submodelsError
        if (active) {
          setDropdowns((prev) => ({
            ...prev,
            submodels: uniqueValues(submodelsData, 'submodel'),
          }))
        }
      } catch (err) {
        console.error('Supabase vehicle submodels error:', err.message)
        if (active) {
          setDropdowns((prev) => ({ ...prev, submodels: [] }))
        }
      }

      if (!form.submodel) {
        if (active) {
          setDropdowns((prev) => ({
            ...prev,
            drivetrains: [],
          }))
        }
        return
      }

      try {
        const { data: drivetrainsData, error: drivetrainsError } = await supabase
          .from(vehiclesTable)
          .select('drivetrain')
          .eq('year', form.year)
          .eq('make', form.make)
          .eq('model', form.model)
          .eq('submodel', form.submodel)

        if (drivetrainsError) throw drivetrainsError
        if (active) {
          setDropdowns((prev) => ({
            ...prev,
            drivetrains: uniqueValues(drivetrainsData, 'drivetrain'),
          }))
        }
      } catch (err) {
        console.error('Supabase vehicle drivetrains error:', err.message)
        if (active) {
          setDropdowns((prev) => ({ ...prev, drivetrains: [] }))
        }
      }
    }

    fetchOptions()

    return () => {
      active = false
    }
  }, [form.year, form.make, form.model, form.submodel])

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((prev) => {
      if (name === 'year') {
        return {
          year: value,
          make: '',
          model: '',
          submodel: '',
          drivetrain: '',
        }
      }

      if (name === 'make') {
        return {
          ...prev,
          make: value,
          model: '',
          submodel: '',
          drivetrain: '',
        }
      }

      if (name === 'model') {
        return {
          ...prev,
          model: value,
          submodel: '',
          drivetrain: '',
        }
      }

      if (name === 'submodel') {
        return {
          ...prev,
          submodel: value,
          drivetrain: '',
        }
      }

      return {
        ...prev,
        [name]: value,
      }
    })
  }

  const handleSaveBuild = async () => {
    setLoadingSave(true)
    const user_id = 'demo-user-id'
    const build_name = `${form.year} ${form.make} ${form.model}`

    const { error } = await saveBuild({
      user_id,
      vehicle: form,
      selectedParts,
      build_name,
    })

    setLoadingSave(false)

    if (!error) {
      navigate('/build', { state: { vehicle: form, selectedParts } })
    } else {
      alert('❌ Error saving build.')
    }
  }

  const togglePart = (type, id) => {
    setSelectedParts((prev) => ({
      ...prev,
      [type]: prev[type] === id ? null : id,
    }))
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-6">Build Your Dream Setup</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        <select name="year" value={form.year} onChange={handleChange} className="p-3 rounded-xl text-black">
          <option value="">Select Year</option>
          {dropdowns.years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select name="make" value={form.make} onChange={handleChange} className="p-3 rounded-xl text-black">
          <option value="">Select Make</option>
          {dropdowns.makes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select name="model" value={form.model} onChange={handleChange} className="p-3 rounded-xl text-black">
          <option value="">Select Model</option>
          {dropdowns.models.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select name="submodel" value={form.submodel} onChange={handleChange} className="p-3 rounded-xl text-black">
          <option value="">Select Submodel</option>
          {dropdowns.submodels.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select name="drivetrain" value={form.drivetrain} onChange={handleChange} className="p-3 rounded-xl text-black">
          <option value="">Select Drivetrain</option>
          {dropdowns.drivetrains.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <ModuleCard
          title="Lift Kits"
          description="Explore height & style"
          icon="🛠️"
          selected={selectedParts.lift_kit_id === 'demo-lift'}
          onClick={() => togglePart('lift_kit_id', 'demo-lift')}
        />
        <ModuleCard
          title="Wheels"
          description="Choose your perfect wheel"
          icon="🛞"
          selected={selectedParts.wheel_id === 'demo-wheel'}
          onClick={() => togglePart('wheel_id', 'demo-wheel')}
        />
        <ModuleCard
          title="Tires"
          description="Get the right grip & fitment"
          icon="🚙"
          selected={selectedParts.tire_id === 'demo-tire'}
          onClick={() => togglePart('tire_id', 'demo-tire')}
        />
      </div>

      <GalleryPreview vehicle={form} />

      <div className="mt-10 text-center">
        <button
          className="bg-white text-black rounded-full px-8 py-4 text-lg font-semibold hover:bg-gray-100 transition disabled:opacity-50"
          onClick={handleSaveBuild}
          disabled={loadingSave}
        >
          {loadingSave ? 'Saving...' : 'Save & Continue →'}
        </button>
      </div>
    </div>
  )
}
