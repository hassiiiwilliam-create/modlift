import express from 'express'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()
const PORT = 5174 // different from Vite

app.use(cors())
app.use(express.json())

const BASE_URL = 'https://api.wheel-size.com/v1'

app.get('/api/wheels/:endpoint', async (req, res) => {
  const { endpoint } = req.params
  const queryParams = new URLSearchParams(req.query)
  queryParams.set('user_key', process.env.VITE_WHEELS_USER_KEY)
  const query = queryParams.toString()

  try {
    const response = await fetch(`${BASE_URL}/${endpoint}?${query}`, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ModLift-App',
        Accept: 'application/json',
        'X-Api-Key': process.env.VITE_WHEELS_USER_KEY,
      },
    })

    if (!response.ok) {
      return res.status(response.status).json({ error: await response.text() })
    }

    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error('Proxy error:', err)
    res.status(500).json({ error: 'Internal proxy error' })
  }
})

app.listen(PORT, () => {
  console.log(`🔧 WheelSize Proxy listening on http://localhost:${PORT}`)
})
