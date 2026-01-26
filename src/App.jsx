// /src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState, createContext } from 'react'
import { Toaster } from 'react-hot-toast'
import './index.css'

import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import Home from './pages/Home'
import BuildPage from './pages/BuildPage'
import Shop from './pages/Shop'
import Gallery from './pages/Gallery'
import Cart from './pages/Cart'
import NotFound from './pages/NotFound'
import Dashboard from './pages/Dashboard'
import Account from './pages/Account'
import Profile from './pages/Profile'
import Garage from './pages/Garage'
import Addresses from './pages/Addresses'
import AccountReturnsPage from './pages/AccountReturns'
import AdminReturnsPage from './pages/AdminReturns'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Returns from './pages/Returns'
import Shipping from './pages/Shipping'
import Warranty from './pages/Warranty'
import Financing from './pages/Financing'
import About from './pages/About'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import Cookies from './pages/Cookies'
import Wishlist from './pages/Wishlist'
import Support from './pages/Support'
import { supabase } from './supabaseClient'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Loader from './components/Loader'
import ScrollToTop from './components/ScrollToTop'
import ChatWidget from './components/ChatWidget'
import { ChatProvider } from './context/ChatContext'
import { WishlistProvider } from './context/wishlistContext'

export const AppContext = createContext()

export default function App() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [build, setBuild] = useState({})

  useEffect(() => {
    let isMounted = true

    const initAuth = async () => {
      // Check for OAuth callback tokens in URL hash (handles Google OAuth redirect)
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')

      if (accessToken && refreshToken) {
        // Set the session from OAuth callback tokens
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
        if (!isMounted) return
        if (error) {
          console.error('Failed to set session from OAuth callback', error)
        } else {
          setUser(data.session?.user ?? null)
          // Clean up URL hash
          window.history.replaceState(null, '', window.location.pathname)
        }
        setLoading(false)
        return
      }

      // Normal session check
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      if (!isMounted) return
      if (error) {
        console.error('Failed to load session', error)
      }
      setUser(session?.user ?? null)
      setLoading(false)
    }

    initAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" replace />
  }

  return (
    <AppContext.Provider value={{ user, setUser, build, setBuild }}>
      <WishlistProvider user={user}>
      <ChatProvider>
        <div className="bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen flex flex-col relative">
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'text-sm font-medium',
              duration: 4000,
            }}
          />
          <ScrollToTop />
          <Navbar />
          <main className="flex-grow">
            {loading ? (
              <Loader />
            ) : (
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/build" element={<BuildPage />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/account" element={<Account />} />
                <Route
                  path="/account/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/account/garage"
                  element={
                    <PrivateRoute>
                      <Garage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/account/addresses"
                  element={
                    <PrivateRoute>
                      <Addresses />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/account/returns"
                  element={
                    <PrivateRoute>
                      <AccountReturnsPage />
                    </PrivateRoute>
                  }
                />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/Orders"
                  element={
                    <PrivateRoute>
                      <Orders />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/order/:id"
                  element={
                    <PrivateRoute>
                      <OrderDetail />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/returns"
                  element={
                    <PrivateRoute>
                      <AdminReturnsPage />
                    </PrivateRoute>
                  }
                />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route
                  path="/support"
                  element={
                    <PrivateRoute>
                      <Support />
                    </PrivateRoute>
                  }
                />
                {/* Policy & Info Pages */}
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/warranty" element={<Warranty />} />
                <Route path="/financing" element={<Financing />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            )}
          </main>
          <Footer />
          <ChatWidget />
        </div>
      </ChatProvider>
      </WishlistProvider>
    </AppContext.Provider>
  )
}
