import { supabase } from '../supabaseClient'

// Create order via Supabase Function (recommended)
export const submitOrder = async () => {
  const { data, error } = await supabase.rpc('submit_order')
  if (error) throw error
  return data
}