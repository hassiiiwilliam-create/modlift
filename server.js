import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import axios from 'axios'

// ✅ Load env variables from .env.local
dotenv.config({ path: '.env.local' })

const app = express()
const PORT = process.env.PORT || 3001
const API_KEY = process.env.WHEELSIZE_API_KEY
const API_BASE = 'https://api.wheel-size.com/v2'

if (!API_KEY) {
  console.warn('⚠️  Missing WHEELSIZE_API_KEY environment variable.')
}

app.use(cors())
app.use(express.json())

// ✅ Universal proxy route for any /api/* path
app.use('/api', async (req, res) => {
  try {
    const targetUrl = `${API_BASE}${req.path}`

    const response = await axios({
      method: req.method,
      url: targetUrl,
      params: {
        ...req.query,
        user_key: API_KEY,
      },
      data: req.body,
    })

    res.status(response.status).json(response.data)
  } catch (error) {
    const status = error.response?.status || 500
    const payload = error.response?.data || { error: 'Proxy failed' }

    console.error(`❌ Proxy Error: ${req.path}`, error.message, payload)
    res.status(status).json(payload)
  }
})

app.listen(PORT, () => {
  console.log(`✅ WheelSize Proxy running on http://localhost:${PORT}`)
})