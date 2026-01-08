import { supabase } from '../supabaseClient'

// Get user's cart items
export const getCartItems = async () => {
  const { data, error } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', (await supabase.auth.getUser()).data.user.id)

  if (error) throw error
  return data
}