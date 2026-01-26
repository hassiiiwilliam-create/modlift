import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uoaaiyzycbufdnptrluc.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvYWFpeXp5Y2J1ZmRucHRybHVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMjA0MjMsImV4cCI6MjA3MjU5NjQyM30.4jpb-1WgEF0mfQDGz0It8u8RER6evSSHr17TiIxmPR8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
