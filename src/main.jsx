// /src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import './index.css'
import { CartProvider } from './context/cartContext.jsx'
import { VehicleProvider } from './context/VehicleContext.jsx'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CartProvider>
          <VehicleProvider>
            <App />
          </VehicleProvider>
        </CartProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
