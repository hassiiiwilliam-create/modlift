import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'modlift_cart_v1'
const TAX_RATE = 0.0825
const CartContext = createContext(null)

export const useCart = () => {
  const value = useContext(CartContext)
  if (!value) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return value
}

const normalizeQuantity = (quantity) => {
  if (Number.isNaN(Number(quantity))) return 1
  return Math.max(1, Math.min(99, Math.floor(Number(quantity))))
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return []
      const parsed = JSON.parse(stored)
      if (!Array.isArray(parsed)) return []
      return parsed.map((item) => ({
        ...item,
        quantity: normalizeQuantity(item.quantity ?? 1),
      }))
    } catch (err) {
      console.warn('Failed to load cart from storage', err)
      return []
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems))
    } catch (err) {
      console.warn('Failed to persist cart', err)
    }
  }, [cartItems])

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((cartItem) => cartItem.id === item.id)
      if (existingIndex !== -1) {
        const updated = [...prev]
        const existing = updated[existingIndex]
        const increment = normalizeQuantity(item.quantity ?? 1)
        updated[existingIndex] = {
          ...existing,
          quantity: normalizeQuantity((existing.quantity ?? 1) + increment),
        }
        return updated
      }

      return [
        ...prev,
        {
          ...item,
          quantity: normalizeQuantity(item.quantity ?? 1),
          _addedAt: Date.now(),
        },
      ]
    })
  }

  const updateQuantity = (id, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: normalizeQuantity(quantity),
            }
          : item
      )
    )
  }

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const clearCart = () => setCartItems([])

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.quantity ?? 1), 0),
    [cartItems]
  )

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1), 0),
    [cartItems]
  )

  const subtotal = totalPrice
  const tax = useMemo(() => Number((subtotal * TAX_RATE).toFixed(2)), [subtotal])
  const total = useMemo(() => Number((subtotal + tax).toFixed(2)), [subtotal, tax])

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      subtotal,
      tax,
      total,
      totalPrice: subtotal,
    }),
    [cartItems, cartCount, subtotal, tax, total]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
