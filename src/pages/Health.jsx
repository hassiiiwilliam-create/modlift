import { useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'
import VehicleFilter from '../components/VehicleFilter'
import { vehiclesTable } from '../utils/tables'

export default function Health() {
  const [status, setStatus] = useState({ running: false, ok: null, error: null, count: null })

  const env = useMemo(() => {
    const url = import.meta.env.VITE_SUPABASE_URL || ''
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
    const mask = (s) => (s ? `${s.slice(0, 8)}…${s.slice(-6)}` : '')
    return { url, keyMasked: mask(key), present: Boolean(url && key) }
  }, [])

  const run = async () => {
    setStatus({ running: true, ok: null, error: null, count: null })
    try {
      const { error, count } = await supabase
        .from(vehiclesTable)
        .select('*', { count: 'exact', head: true })
      if (error) throw error
      setStatus({ running: false, ok: true, error: null, count: count ?? 0 })
      if ((count ?? 0) === 0) {
        await insertTestData()
        console.log('Inserted sample vehicle data.')
      }
    } catch (e) {
      setStatus({ running: false, ok: false, error: String(e.message || e), count: null })
    }
  }

  const insertTestData = async () => {
    const sample = [
      { year: '2022', make: 'Ford', model: 'F-150', submodel: 'XLT', drivetrain: '4WD' },
      { year: '2021', make: 'Chevrolet', model: 'Silverado', submodel: 'LT', drivetrain: 'RWD' },
      { year: '2023', make: 'Ram', model: '1500', submodel: 'Laramie', drivetrain: 'AWD' },
    ]
    const { error } = await supabase.from(vehiclesTable).insert(sample)
    if (error) console.error('Test data insert failed:', error)
  }

  return (
    <section className="section min-h-screen bg-neutral-50 dark:bg-neutral-900 py-10 px-4">
      <div className="max-w-3xl mx-auto card-style">
        <h1 className="text-2xl font-bold mb-3">Supabase Health Check</h1>
        <ul className="text-sm text-neutral-700 mb-4">
          <li>
            Env present: <span className={env.present ? 'text-emerald-600' : 'text-red-600'}>{String(env.present)}</span>
          </li>
          <li>URL: <code className="text-neutral-900">{env.url || '(empty)'}</code></li>
          <li>Anon key: <code className="text-neutral-900">{env.keyMasked || '(empty)'}</code></li>
        </ul>
        <button
          onClick={run}
          disabled={status.running}
          className="rounded-full bg-neutral-900 px-5 py-2 text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {status.running ? 'Checking…' : 'Run Check'}
        </button>
        <div className="mt-4 text-sm">
          {status.ok === true && (
            <p className="text-emerald-700">OK: vehicles table reachable. Row count: {status.count ?? 0}</p>
          )}
          {status.ok === false && (
            <p className="text-red-600">Error: {status.error}</p>
          )}
          {status.ok === null && !status.running && (
            <p className="text-neutral-600">Press "Run Check" to test connectivity.</p>
          )}
        </div>
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Quick Years Dropdown</h2>
          <div className="space-y-2">
            <label className="block text-sm text-neutral-700 dark:text-neutral-300">Select Year</label>
            <select className="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm">
              <option>2021</option>
              <option>2022</option>
              <option>2023</option>
            </select>

            <label className="block text-sm text-neutral-700 dark:text-neutral-300">Select Make</label>
            <select className="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm">
              <option>Ford</option>
              <option>Chevrolet</option>
              <option>Ram</option>
            </select>

            <label className="block text-sm text-neutral-700 dark:text-neutral-300">Select Model</label>
            <select className="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm">
              <option>F-150</option>
              <option>Silverado</option>
              <option>1500</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  )
}
