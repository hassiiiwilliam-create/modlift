import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { supabase } from '../supabaseClient'

const WishlistContext = createContext(null)

export const useWishlist = () => {
  const value = useContext(WishlistContext)
  if (!value) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return value
}

export function WishlistProvider({ children, user }) {
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch wishlist from Supabase when user changes
  useEffect(() => {
    if (!user?.id) {
      setWishlistItems([])
      return
    }

    const fetchWishlist = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('wishlists')
          .select(`
            id,
            product_id,
            created_at,
            products (
              id,
              title,
              price,
              image_url,
              category,
              sku
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching wishlist:', error)
          return
        }

        // Transform data to include product info at top level
        // Map title -> name and image_url -> images for compatibility
        const items = (data || []).map((item) => ({
          wishlistId: item.id,
          productId: item.product_id,
          createdAt: item.created_at,
          id: item.products?.id,
          name: item.products?.title,
          title: item.products?.title,
          price: item.products?.price,
          image_url: item.products?.image_url,
          images: item.products?.image_url ? [item.products.image_url] : [],
          category: item.products?.category,
          sku: item.products?.sku,
        }))

        setWishlistItems(items)
      } catch (err) {
        console.error('Error fetching wishlist:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [user?.id])

  const addToWishlist = useCallback(async (product) => {
    if (!user?.id) {
      return { success: false, error: 'Please sign in to add items to your wishlist' }
    }

    try {
      const { data, error } = await supabase
        .from('wishlists')
        .insert({
          user_id: user.id,
          product_id: product.id,
        })
        .select()
        .single()

      if (error) {
        if (error.code === '23505') {
          // Unique constraint violation - already in wishlist
          return { success: false, error: 'Item already in wishlist' }
        }
        throw error
      }

      // Add to local state with normalized field names
      setWishlistItems((prev) => [
        {
          wishlistId: data.id,
          productId: product.id,
          createdAt: data.created_at,
          id: product.id,
          name: product.title || product.name,
          title: product.title || product.name,
          price: product.price,
          image_url: product.image_url,
          images: product.image_url ? [product.image_url] : (product.images || []),
          category: product.category,
          sku: product.sku,
        },
        ...prev,
      ])

      return { success: true }
    } catch (err) {
      console.error('Error adding to wishlist:', err)
      return { success: false, error: 'Failed to add to wishlist' }
    }
  }, [user?.id])

  const removeFromWishlist = useCallback(async (productId) => {
    if (!user?.id) return { success: false, error: 'Please sign in' }

    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)

      if (error) throw error

      // Remove from local state
      setWishlistItems((prev) => prev.filter((item) => item.productId !== productId))

      return { success: true }
    } catch (err) {
      console.error('Error removing from wishlist:', err)
      return { success: false, error: 'Failed to remove from wishlist' }
    }
  }, [user?.id])

  const isInWishlist = useCallback(
    (productId) => wishlistItems.some((item) => item.productId === productId || item.id === productId),
    [wishlistItems]
  )

  const toggleWishlist = useCallback(async (product) => {
    if (isInWishlist(product.id)) {
      return removeFromWishlist(product.id)
    }
    return addToWishlist(product)
  }, [isInWishlist, addToWishlist, removeFromWishlist])

  const wishlistCount = useMemo(() => wishlistItems.length, [wishlistItems])

  const value = useMemo(
    () => ({
      wishlistItems,
      loading,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      wishlistCount,
    }),
    [wishlistItems, loading, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist, wishlistCount]
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
