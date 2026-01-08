import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.VEHICLE_API_PORT || 3001

app.use(cors())

// In-memory fallback data for local development
const years = Array.from({ length: 40 }, (_, index) => String(2025 - index))
const makes = ['Ford', 'Toyota', 'Chevrolet']
const models = {
  Ford: ['F-150', 'Bronco', 'Ranger'],
  Toyota: ['Tacoma', '4Runner', 'Tundra'],
  Chevrolet: ['Silverado', 'Colorado', 'Tahoe'],
}
const trims = {
  'F-150': ['XL', 'XLT', 'Lariat'],
  Tacoma: ['SR', 'TRD Sport', 'TRD Off-Road'],
  Silverado: ['WT', 'LT', 'LTZ'],
}

app.get('/api/years', (_req, res) => {
  res.json(years)
})

app.get('/api/makes', (req, res) => {
  const { year } = req.query
  if (!year) {
    return res.status(400).json({ error: 'Year required' })
  }
  res.json(makes)
})

app.get('/api/models', (req, res) => {
  const { year, make } = req.query
  if (!year || !make) {
    return res.status(400).json({ error: 'Year and make required' })
  }
  res.json(models[make] || [])
})

app.get('/api/trims', (req, res) => {
  const { year, make, model } = req.query
  if (!year || !make || !model) {
    return res.status(400).json({ error: 'Year, make and model required' })
  }
  res.json(trims[model] || [])
})

app.listen(PORT, () => {
  console.log(`🚗 Vehicle service running at http://localhost:${PORT}`)
})
