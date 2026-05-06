import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pnllpjvboanotbaozwbk.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBubGxwanZib2Fub3RiYW96d2JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMTc2MDAsImV4cCI6MjA5MzU5MzYwMH0.2lxlOY_m9-89B1JQnl0MrCX7roF32Eh2jOeY3jTUQDE'

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
)

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://'))
}
