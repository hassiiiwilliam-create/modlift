// /src/pages/Dashboard.jsx
import { useEffect, useState, useContext, useMemo } from 'react'
import { supabase } from '../supabaseClient'
import { AppContext } from '../App'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Bar } from 'react-chartjs-2'
import 'chart.js/auto'

export default function Dashboard() {
  const { user } = useContext(AppContext)
  const isAdmin = user?.email === 'admin@modlift.us'
  const [builds, setBuilds] = useState([])
  const [selectedBuilds, setSelectedBuilds] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  if (!user) {
    return <div className="p-6 text-center">Please log in to view your dashboard.</div>
  }

  useEffect(() => {
    if (!user?.id) return

    if (process.env.NODE_ENV === 'development') {
      console.log('Context User:', user)
    }

    const fetchBuilds = async () => {
      const { data, error } = await supabase.from('builds').select('*').eq('user_id', user.id)
      if (error) {
        toast.error('Failed to fetch builds.')
      } else {
        setBuilds(data)
      }
      setLoading(false)
    }

    fetchBuilds()
  }, [user])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    const { error } = await supabase.from('builds').delete().eq('id', id)
    if (error) toast.error('Delete failed.')
    else {
      toast.success('Deleted.')
      const updated = builds.filter((b) => b.id !== id)
      setBuilds(updated)
    }
  }

  const handleSelectBuild = (id) => {
    setSelectedBuilds((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]))
  }

  const exportSelectedPDF = async () => {
    for (const id of selectedBuilds) {
      const element = document.getElementById(`build-${id}`)
      if (!element) continue
      const canvas = await html2canvas(element)
      const pdf = new jsPDF()
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 190, 0)
      pdf.save(`build-${id}.pdf`)
    }
  }

  const exportCSV = () => {
    const headers = ['id', 'year', 'make', 'model', 'step']
    const rows = builds.map((b) => headers.map(h => b[h]).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'modlift_builds.csv'
    link.click()
  }

  const monthlyCounts = useMemo(() => {
    const counts = Array(12).fill(0)
    builds.forEach(b => {
      const month = new Date(b.updated_at).getMonth()
      counts[month]++
    })
    return counts
  }, [builds])

  const duplicates = useMemo(() => {
    const seen = {}
    return builds.filter(b => {
      const key = `${b.year}-${b.make}-${b.model}`
      if (seen[key]) return true
      seen[key] = true
      return false
    })
  }, [builds])

  const filteredBuilds = useMemo(() => {
    return builds.filter((b) => {
      const matchSearch = `${b.year} ${b.make} ${b.model}`.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || b.step === statusFilter
      return matchSearch && matchStatus
    })
  }, [builds, search, statusFilter])

  const stepColors = {
    completed: 'bg-green-100 text-green-700',
    'vehicle-selected': 'bg-blue-100 text-blue-700',
    'build-started': 'bg-yellow-100 text-yellow-700',
  }

  const getRouteForStep = (step) => {
    switch (step) {
      case 'vehicle-selected': return '/build/step2'
      case 'completed': return '/build/summary'
      default: return '/build'
    }
  }

  const handleAddToCart = async (build) => {
    const { error } = await supabase.from('cart_items').insert({
      user_id: user.id,
      build_id: build.id,
      year: build.year,
      make: build.make,
      model: build.model,
    })

    if (error) {
      toast.error('Failed to add to cart.')
    } else {
      toast.success('Build added to cart!')
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search year, make, model..."
          className="border rounded px-3 py-2 text-sm w-full sm:w-64"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded px-2 py-2 text-sm">
          <option value="all">All</option>
          <option value="build-started">Build Started</option>
          <option value="vehicle-selected">Vehicle Selected</option>
          <option value="completed">Completed</option>
        </select>
        <button onClick={exportCSV} className="bg-black text-white text-sm px-3 py-2 rounded hover:bg-gray-800">Export CSV</button>
        <Link to="/Cart" className="bg-gray-200 text-sm px-3 py-2 rounded hover:bg-gray-300">🛒 View Cart</Link>
        {selectedBuilds.length > 0 && (
          <button onClick={exportSelectedPDF} className="bg-blue-600 text-white text-sm px-3 py-2 rounded hover:bg-blue-700">
            Export {selectedBuilds.length} PDF
          </button>
        )}
      </div>

      {isAdmin && (
        <div className="mb-10 bg-gray-100 dark:bg-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Trends</h2>
          <Bar
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              datasets: [{
                label: 'Builds',
                data: monthlyCounts,
                backgroundColor: 'rgba(0,0,0,0.7)',
              }]
            }}
          />
        </div>
      )}

      {loading ? <p>Loading builds...</p> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuilds.map((build) => (
            <div id={`build-${build.id}`} key={build.id} className="relative bg-white dark:bg-zinc-900 p-6 rounded-xl border dark:border-zinc-800 shadow hover:shadow-lg">
              <input
                type="checkbox"
                checked={selectedBuilds.includes(build.id)}
                onChange={() => handleSelectBuild(build.id)}
                className="absolute top-4 left-4 scale-125"
              />
              <div className="ml-6 space-y-3">
                <div className="font-semibold text-lg">{build.year} {build.make} {build.model}</div>
                <div className="text-sm text-gray-500">Updated: {new Date(build.updated_at).toLocaleDateString()}</div>
                <span className={`text-xs px-2 py-1 rounded-full ${stepColors[build.step] || 'bg-gray-200 text-gray-600'}`}>{build.step.replace(/-/g, ' ')}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Link to={getRouteForStep(build.step)} className="text-xs bg-black text-white px-3 py-1 rounded hover:bg-gray-800">Resume</Link>
                <button onClick={() => handleDelete(build.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                <button
                  onClick={() => handleAddToCart(build)}
                  className="text-xs bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {duplicates.length > 0 && (
        <div className="mt-10 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 border-l-4 border-yellow-400 p-4 rounded">
          ⚠️ Potential Duplicates: {duplicates.length} builds detected
        </div>
      )}

      {builds.length > 0 && builds.every((b) => b.step === 'completed') && (
        <div className="mt-10 text-center">
          <Link to="/build" className="inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">
            ➕ Start New Build
          </Link>
        </div>
      )}
    </main>
  )
}
