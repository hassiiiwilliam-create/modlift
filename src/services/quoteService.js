import { supabase } from '../supabaseClient'

export const createQuote = async (quoteDetails) => {
  const { data, error } = await supabase
    .from('quotes')
    .insert([quoteDetails])

  if (error) throw error
  return data
}