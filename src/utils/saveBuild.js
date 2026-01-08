import { supabase } from '../supabaseClient'
import { buildsTable } from './tables'

export async function saveBuild({ user_id, vehicle, selectedParts, build_name }) {
  try {
    const payload = {
      user_id,
      build_name,
      vehicle, // JSON object
      selected_parts: selectedParts, // JSON object
    }
    const { data, error } = await supabase
      .from(buildsTable)
      .insert(payload)
      .select()
      .single()

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}
