import express from 'express'
import axios from 'axios'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const WHEELSIZE_API_KEY = process.env.WHEELSIZE_API_KEY
const WHEELSIZE_API_BASE = 'https://api.wheel-size.com/v1'

if (!WHEELSIZE_API_KEY) {
  console.error('❌ Missing WHEELSIZE_API_KEY environment variable')
  process.exit(1)
}

// Allow frontend access
app.use(cors())

// Helper to call the real API with the user_key param
const fetchFromWheelSize = async (endpoint, params = {}) => {
  const url = `${WHEELSIZE_API_BASE}${endpoint}`
  try {
    const response = await axios.get(url, {
      params: {
        user_key: WHEELSIZE_API_KEY,
        ...params,
      },
      headers: {
        'X-Api-Key': WHEELSIZE_API_KEY,
      },
    })
    return response.data
  } catch (err) {
    console.error('Wheel-Size error:', err?.response?.data || err.message)
    throw err
  }
}

// Proxy endpoints
app.get('/api/years', async (req, res) => {
  try {
    const data = await fetchFromWheelSize('/years')
    res.json(data)
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: 'Failed to fetch from Wheel-Size API', details: err.message })
  }
})

app.get('/api/makes', async (req, res) => {
  try {
    const { year } = req.query
    const data = await fetchFromWheelSize('/makes', { year })
    res.json(data)
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: 'Failed to fetch makes', details: err.message })
  }
})

app.get('/api/models', async (req, res) => {
  try {
    const { year, make } = req.query
    const data = await fetchFromWheelSize('/models', { year, make })
    res.json(data)
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: 'Failed to fetch models', details: err.message })
  }
})

app.get('/api/trims', async (req, res) => {
  try {
    const { year, make, model } = req.query
    const data = await fetchFromWheelSize('/trims', { year, make, model })
    res.json(data)
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: 'Failed to fetch trims', details: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`✅ Proxy server running at http://localhost:${PORT}`)
})
